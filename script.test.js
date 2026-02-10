const fs = require('fs');
const path = require('path');

const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    clear: jest.fn(() => { store = {}; })
  };
})();
global.localStorage = localStorageMock;

const createMockElement = (id = '', tagName = 'DIV') => {
    const el = {
        id,
        tagName: tagName.toUpperCase(),
        _innerHTML: '',
        classes: new Set(),
        get className() { return Array.from(this.classes).join(' '); },
        set className(val) { this.classes = new Set(String(val).split(' ').filter(c => c)); },
        classList: {
            add: jest.fn((cls) => { el.classes.add(cls); }),
            remove: jest.fn((cls) => { el.classes.delete(cls); }),
            contains: jest.fn((cls) => el.classes.has(cls)),
            toggle: jest.fn((cls) => {
                if (el.classes.has(cls)) { el.classes.delete(cls); return false; }
                else { el.classes.add(cls); return true; }
            })
        },
        focus: jest.fn(),
        style: {},
        dataset: {},
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        get innerHTML() { return this._innerHTML; },
        set innerHTML(val) { this._innerHTML = String(val); },
        get textContent() { return String(this._innerHTML).replace(/<[^>]*>/g, ''); },
        set textContent(val) { this._innerHTML = String(val); },
        get innerText() { return this.textContent; },
        set innerText(val) { this.textContent = val; },
        tabIndex: 0,
        appendChild: jest.fn(function(child) {
            const content = child.innerHTML || child.textContent || child.innerText || '';
            const tag = child.tagName ? child.tagName.toLowerCase() : '';
            if (tag) {
                const cls = child.className ? ` class="${child.className}"` : '';
                let dataAttrs = '';
                if (child.dataset) {
                    for (const key in child.dataset) {
                        dataAttrs += ` data-${key}="${child.dataset[key]}"`;
                    }
                }
                this.innerHTML += `<${tag}${cls}${dataAttrs}>${content}</${tag}>`;
            } else {
                this.innerHTML += content;
            }
            return child;
        }),
        role: '',
        querySelectorAll: jest.fn(() => []),
        requestFullscreen: jest.fn(() => Promise.resolve()),
        click: jest.fn(),
        addEventListener: jest.fn()
    };
    return el;
};

const mockElements = {};
let quizHandler = null;

[
    'modal-body', 'uni-modal', 'modal-close-btn', 'home', 'materiale', 'admitere', 'biblioteca', 'grila',
    'chapters-list', 'uni-grid', 'library-list', 'sidebar', 'mobile-toggle', 'swiper-wrapper',
    'slide-viewer-modal', 'results', 'quiz', 'lectie-detaliu', 'biblioteca-detaliu', 'review-mode', 'review-container',
    'final-score-text', 'final-grade-big', 'result-circle', 'final-time', 'timer', 'performance-msg', 'correct-count', 'wrong-count',
    'final-correct', 'final-wrong',
    'q-text', 'q-counter', 'progress-bar', 'options-box', 'quiz-feedback-overlay',
    'library-body', 'lesson-body', 'lesson-title', 'library-title'
].forEach(id => {
    mockElements[id] = createMockElement(id);
    if (id === 'options-box') {
        mockElements[id].addEventListener = jest.fn((type, handler) => {
            if (type === 'click') quizHandler = handler;
        });
    }
});

global.document = {
    body: createMockElement('body', 'BODY'),
    head: { appendChild: jest.fn() },
    getElementById: jest.fn((id) => mockElements[id] || createMockElement(id)),
    querySelectorAll: jest.fn(() => []),
    querySelector: jest.fn((selector) => {
        if (selector.startsWith('#')) return mockElements[selector.substring(1)] || createMockElement();
        return createMockElement();
    }),
    createElement: jest.fn((tag) => createMockElement('', tag)),
    addEventListener: jest.fn(),
        createDocumentFragment: jest.fn(() => {
        const fragment = {
            _innerHTML: '',
            get innerHTML() { return this._innerHTML; },
            set innerHTML(val) { this._innerHTML = val; },
            appendChild: jest.fn(function(child) {
                const tag = child.tagName ? child.tagName.toLowerCase() : 'div';
                const cls = child.className ? ` class="${child.className}"` : '';
                let dataAttrs = '';
                if (child.dataset) {
                    for (const key in child.dataset) {
                        dataAttrs += ` data-${key}="${child.dataset[key]}"`;
                    }
                }
                const content = child.innerHTML || child.textContent || '';
                this._innerHTML += `<${tag}${cls}${dataAttrs}>${content}</${tag}>`;
                return child;
            })
        };
        return fragment;
    }),
    exitFullscreen: jest.fn()
};

const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf8'));
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) }));

global.window = {
    scrollTo: jest.fn(),
    history: { pushState: jest.fn(), replaceState: jest.fn() },
    location: { hash: '', href: 'http://localhost/' },
    innerWidth: 1024,
    addEventListener: jest.fn(),
    open: jest.fn(),
    MathJax: { typesetPromise: jest.fn(() => Promise.resolve()) }
};

global.history = global.window.history;
global.setInterval = jest.fn(() => 123);
global.clearInterval = jest.fn();
global.Swiper = jest.fn(() => ({ destroy: jest.fn() }));

const scriptContent = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');
const scriptFunc = new Function('window', 'document', 'history', 'setInterval', 'clearInterval', 'Swiper', 'MathJax', scriptContent + `
 return {
    showPage,
    openUni: (id) => ModalManager.openUni(id),
    closeModal: () => ModalManager.closeModal(),
    unis, masterBank, lectiiCompleta, bibliotecaCompleta,
    finish: () => QuizManager.finish(),
    setScore: (v) => QuizManager.score = v,
    setTimer: (v) => QuizManager.timer = v,
    setSecs: (v) => QuizManager.secs = v,
    setCorrect: (v) => QuizManager.correct = v,
    setWrong: (v) => QuizManager.wrong = v,
    getScore: () => QuizManager.score,
    getTimer: () => QuizManager.timer,
    getSecs: () => QuizManager.secs,
    startQuiz: (type) => QuizManager.start(type),
    stopQuiz: () => QuizManager.stop(),
    renderQ: () => QuizManager.render(),
    getCurrentIdx: () => QuizManager.index,
    setCurrentIdx: (v) => QuizManager.index = v,
    getCorrect: () => QuizManager.correct,
    getWrong: () => QuizManager.wrong,
    getCurrentQuestions: () => QuizManager.questions,
    setCurrentQuestions: (v) => QuizManager.questions = v,
    getQuizType: () => QuizManager.type,
    showReview: () => QuizManager.showReview(),
    openLesson, openLibraryItem,

    openSlideViewer, closeSlideViewer, toggleFullScreen
 };`);

const context = scriptFunc(global.window, global.document, global.history, global.setInterval, global.clearInterval, global.Swiper, global.window.MathJax);
const loadCall = global.window.addEventListener.mock.calls.find(call => call[0] === 'load');
const loadListener = loadCall ? loadCall[1] : null;
let initializationPromise;
if (loadListener) initializationPromise = loadListener();

Object.assign(global, context);

beforeAll(async () => { if (initializationPromise) await initializationPromise; });


describe('Lesson Logic', () => {
    test('openLesson for lesson with file renders into lesson-body', () => {
        openLesson(1);
        expect(mockElements['lectie-detaliu'].classes.has('active')).toBe(true);
        expect(mockElements['lesson-title'].innerText).toBe("Costul de Oportunitate");
        expect(mockElements['lesson-body'].innerHTML).toContain('iframe');
    });
});

describe('Library Logic', () => {
    test('openLibraryItem shows library detail with iframe for PDF', () => {
        context.bibliotecaCompleta[0] = { id: 0, titlu: 'Test PDF', file: 'test.pdf', type: 'pdf' };
        openLibraryItem(0);
        expect(mockElements['biblioteca-detaliu'].classes.has('active')).toBe(true);
        expect(mockElements['library-body'].innerHTML).toContain('iframe');
    });
});

describe('Quiz Logic', () => {
    test('startQuiz resets state and starts timer', () => {
        startQuiz();
        expect(getCurrentIdx()).toBe(0);
        expect(getScore()).toBe(0);
        expect(global.setInterval).toHaveBeenCalled();
        expect(mockElements['quiz'].classes.has('active')).toBe(true);
    });

    test('renderQ populates DOM', () => {
        setCurrentQuestions([{ q: 'Q1', o: ['A', 'B'], c: 0 }]);
        setCurrentIdx(0);
        renderQ();
        expect(mockElements['q-text'].innerText).toBe('Q1');
        expect(mockElements['options-box'].innerHTML).toContain('opt-btn');
    });

    test('finish updates dashboard stats', () => {
        setCurrentQuestions([{ q: 'Q1', o: ['A', 'B'], c: 0 }]);
        setScore(5);
        setCorrect(1);
        setWrong(0);
        mockElements['timer'].innerText = '00:05';
        finish();
        expect(mockElements['results'].classes.has('active')).toBe(true);
        expect(mockElements['final-correct'].innerText).toBe("1");
        expect(mockElements['final-wrong'].innerText).toBe("0");
        expect(mockElements['final-time'].innerText).toBe("00:05");
    });

    test('showReview populates review-container', () => {
        setCurrentQuestions([{ q: 'Q1', o: ['A', 'B'], c: 0, e: 'Expl' }]);
        context.userAnswers = [0]; // Added to scriptFunc or set manually
        showReview();
        expect(mockElements['review-mode'].classes.has('active')).toBe(true);
        expect(mockElements['review-container'].innerHTML).toContain('Q1');
        expect(mockElements['review-container'].innerHTML).toContain('Expl');
    });
});

describe('University Logic', () => {
    test('openUni populates modal with new structured data', () => {
        const u = { id: 99, n: 'Uni Test', logo: 'logo.png', m: '9.00', admission: 'Test adm', seats: '100', career: ['Dev'], url: 'http://uni.ro' };
        context.unis.push(u);
        openUni(99);
        expect(mockElements['uni-modal'].classes.has('active-link')).toBe(false); // check visibility
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
        expect(mockElements['modal-body'].innerHTML).toContain('Uni Test');
        expect(mockElements['modal-body'].innerHTML).toContain('Test adm');
        expect(mockElements['modal-body'].innerHTML).toContain('100');
        expect(mockElements['modal-body'].innerHTML).toContain('Dev');
    });
});
