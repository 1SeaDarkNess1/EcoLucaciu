const fs = require('fs');
const path = require('path');

// Mock DOM elements
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
                if (el.classes.has(cls)) el.classes.delete(cls);
                else el.classes.add(cls);
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
        querySelectorAll: jest.fn((selector) => {
            if (selector === '.toc-item') {
                return el.tocItems || [];
            }
            return [];
        }),
        requestFullscreen: jest.fn(() => Promise.resolve()),
        click: jest.fn(),
        addEventListener: jest.fn()
    };
    return el;
};
const mockElements = {};
let quizHandler = null;

[
    'modal-body', 'uni-modal', 'modal-close-btn', 'home', 'lectii', 'biblioteca', 'about',
    'chapters-list', 'uni-grid', 'library-list', 'sidebar', 'mobile-toggle', 'swiper-wrapper',
    'slide-viewer-modal', 'results', 'quiz', 'lectie-detaliu', 'biblioteca-detaliu',
    'final-score', 'final-time', 'timer', 'final-grade', 'performance-msg', 'correct-count', 'wrong-count',
    'q-text', 'q-counter', 'progress-bar', 'options-box', 'quiz-feedback-overlay',
    'library-body', 'library-slide-counter', 'library-toc',
    'lesson-body', 'slide-counter', 'lesson-toc', 'mySwiper', 'lesson-title', 'library-title'
].forEach(id => {
    mockElements[id] = createMockElement(id);
    if (id === 'options-box') {
        mockElements[id].addEventListener = jest.fn((type, handler) => {
            if (type === 'click') quizHandler = handler;
        });
    }
});

// Add .view class to view elements
['home', 'lectii', 'biblioteca', 'about', 'results', 'quiz', 'lectie-detaliu', 'biblioteca-detaliu'].forEach(id => mockElements[id].classList.add('view'));
mockElements['uni-modal'].classList.add('hidden');
mockElements['slide-viewer-modal'].classList.add('hidden');

global.document = {
    body: { style: {} },
    head: { appendChild: jest.fn() },
    getElementById: jest.fn((id) => {
        return mockElements[id] || createMockElement(id);
    }),
    querySelectorAll: jest.fn((selector) => {
        if (selector === '.view') {
            return ['home', 'lectii', 'biblioteca', 'about', 'results', 'quiz', 'lectie-detaliu', 'biblioteca-detaliu'].map(id => mockElements[id]);
        }
        return [];
    }),
    querySelector: jest.fn((selector) => {
        if (mockElements[selector]) return mockElements[selector];
        if (selector === '.mySwiper') return mockElements['mySwiper'];
        if (selector === '.slide-viewer-modal') return mockElements['slide-viewer-modal'];
        if (selector.includes('.reader-toolbar')) return createMockElement();
        return createMockElement();
    }),
    activeElement: { className: '', id: '', focus: jest.fn() },
    createElement: jest.fn((tag) => {
        return createMockElement('', tag);
    }),
    addEventListener: jest.fn(),
    createDocumentFragment: jest.fn(() => {
        const fragment = {
            innerHTML: '',
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
                this.innerHTML += `<${tag}${cls}${dataAttrs}>${content}</${tag}>`;
                return child;
            }),
            childNodes: []
        };
        return fragment;
    }),
    exitFullscreen: jest.fn(),
    fullscreenElement: null
};


const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf8'));
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
    })
);

global.window = {
    scrollTo: jest.fn(),
    history: {
        pushState: jest.fn(),
        replaceState: jest.fn()
    },
    location: { hash: '' },
    innerWidth: 1024,
    addEventListener: jest.fn(),
    open: jest.fn(),
    MathJax: {
        typesetPromise: jest.fn(() => Promise.resolve())
    }
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
    getLastFocusedElement: () => ModalManager.lastFocusedElement,
    setScore: (v) => QuizManager.score = v,
    setTimer: (v) => QuizManager.timer = v,
    setSecs: (v) => QuizManager.secs = v,
    setCorrect: (v) => QuizManager.correct = v,
    setWrong: (v) => QuizManager.wrong = v,
    getScore: () => QuizManager.score,
    getTimer: () => QuizManager.timer,
    getSecs: () => QuizManager.secs,
    startQuiz: (type) => QuizManager.start(type),
    renderQ: () => QuizManager.render(),
    getCurrentIdx: () => QuizManager.index,
    setCurrentIdx: (v) => QuizManager.index = v,
    getCorrect: () => QuizManager.correct,
    getWrong: () => QuizManager.wrong,
    getCurrentQuestions: () => QuizManager.questions,
    setCurrentQuestions: (v) => QuizManager.questions = v,
    getQuizType: () => QuizManager.type,
    nextLibrarySlide: () => LibraryManager.next(),
    prevLibrarySlide: () => LibraryManager.prev(),
    getLibrarySlideIndex: () => LibraryManager.index,
    setLibrarySlides: (s) => LibraryManager.slides = s,
    setLibrarySlideIndex: (i) => LibraryManager.index = i,
    renderLibrarySlide: () => LibraryManager.render(),
    openLesson, openLibraryItem,
    loadMathJax,

    toggleTOC, generateTOC, updateActiveTOC,
    openSlideViewer, closeSlideViewer, toggleFullScreen,
    nextSlide: () => LessonManager.next(),
    prevSlide: () => LessonManager.prev(),
    renderSlide: () => LessonManager.render(),
    getSlideIndex: () => LessonManager.index,
    setSlideIndex: (i) => LessonManager.index = i,
    setLessonSlides: (s) => LessonManager.slides = s,
    getLessonSlides: () => LessonManager.slides,
 };`);

const context = scriptFunc(global.window, global.document, global.history, global.setInterval, global.clearInterval, global.Swiper, global.window.MathJax);
const loadCall = global.window.addEventListener.mock.calls.find(call => call[0] === 'load');
const loadListener = loadCall ? loadCall[1] : null;
let initializationPromise;
if (loadListener) initializationPromise = loadListener();

Object.assign(global, context);

describe('Core Functionality', () => {
    beforeAll(async () => { if (initializationPromise) await initializationPromise; });
    beforeEach(() => {
        jest.clearAllMocks();
        mockElements['uni-modal'].classList.add('hidden');
        mockElements['slide-viewer-modal'].classList.add('hidden');
    });

    test('openUni should show modal with correct info and manage focus', () => {
        const uni = unis[0];
        const previousActiveElement = { focus: jest.fn() };
        global.document.activeElement = previousActiveElement;

        openUni(uni.id);

        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.n);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.m);
        expect(mockElements['modal-body'].innerHTML).toContain('Medie:');
        expect(mockElements['modal-body'].innerHTML).toContain(uni.d);
        expect(mockElements['modal-close-btn'].focus).toHaveBeenCalled();
        expect(getLastFocusedElement()).toBe(previousActiveElement);

        // Verify structure
        expect(mockElements['modal-body'].innerHTML).toContain('<h1');
        expect(mockElements['modal-body'].innerHTML).toContain('<b');
        expect(mockElements['modal-body'].innerHTML).toContain('<hr');
        expect(mockElements['modal-body'].innerHTML).toContain('<div');
    });
    test('openUni with invalid ID does nothing', () => {
        openUni('invalid');
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });

    test('closeModal hides modal and restores focus', () => {
        const previousActiveElement = { focus: jest.fn() };
        global.document.activeElement = previousActiveElement;

        openUni(unis[0].id);
        expect(getLastFocusedElement()).toBe(previousActiveElement);

        closeModal();
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
        expect(previousActiveElement.focus).toHaveBeenCalled();
        expect(getLastFocusedElement()).toBe(null);
    });
    test('showPage should navigate correctly', () => {
        showPage('biblioteca');
        expect(mockElements['biblioteca'].classes.has('active')).toBe(true);
        expect(mockElements['home'].classes.has('active')).toBe(false);
        expect(global.window.history.pushState).toHaveBeenCalledWith({ pageId: 'biblioteca' }, "", "#biblioteca");
    });

    test('toggleSidebar should toggle class', () => {
        global.window.toggleSidebar();
        expect(mockElements['sidebar'].classes.has('open')).toBe(true);
        global.window.toggleSidebar();
        expect(mockElements['sidebar'].classes.has('open')).toBe(false);
    });

    test('window.onpopstate should call showPage', () => {
        const popstateCall = global.window.addEventListener.mock.calls.find(call => call[0] === 'popstate');
        const popstateListener = popstateCall ? popstateCall[1] : null;
        if (popstateListener) popstateListener({ state: { pageId: 'biblioteca' } });
        expect(mockElements['biblioteca'].classes.has('active')).toBe(true);
    });
});

describe('MathJax Loading', () => {
    let originalMathJax;
    beforeEach(() => {
        originalMathJax = global.window.MathJax;
        global.document.head.appendChild.mockClear();
    });
    afterEach(() => {
        global.window.MathJax = originalMathJax;
    });

    test('loadMathJax should lazy load script when MathJax is missing', async () => {
         delete global.window.MathJax;

         const p = loadMathJax();
         expect(global.document.head.appendChild).toHaveBeenCalled();

         const script = global.document.head.appendChild.mock.calls[0][0];
         script.onload();
         await expect(p).resolves.toBeUndefined();
    });
});

describe('TOC & Navigation Logic', () => {
    test('toggleTOC toggles collapsed class', () => {
        const el = mockElements['lesson-toc'];
        toggleTOC('lesson-toc');
        expect(el.classes.has('collapsed')).toBe(true);
        toggleTOC('lesson-toc');
        expect(el.classes.has('collapsed')).toBe(false);
    });

    test('generateTOC creates toc items', () => {
        const container = mockElements['lesson-toc'];
        const slides = [{ t: 'Slide 1' }, { t: 'Slide 2' }];
        const callback = jest.fn();
        generateTOC('lesson-toc', slides, callback);
        expect(container.innerHTML).toContain('toc-item');
        expect(container.innerHTML).toContain('Slide 1');
        expect(container.innerHTML).toContain('Slide 2');
    });

    test('updateActiveTOC manages active class', () => {
        const container = mockElements['lesson-toc'];
        const item0 = createMockElement('', 'DIV');
        item0.classList.add('toc-item');
        item0.dataset.idx = '0';
        const item1 = createMockElement('', 'DIV');
        item1.classList.add('toc-item');
        item1.dataset.idx = '1';
        container.tocItems = [item0, item1];

        updateActiveTOC('lesson-toc', 1);
        expect(item1.classes.has('active')).toBe(true);
        expect(item0.classes.has('active')).toBe(false);
    });
});

describe('Slide Viewer', () => {
    test('openSlideViewer shows modal and populates wrapper', () => {
        openSlideViewer('lesson', 0);
        expect(mockElements['slide-viewer-modal'].classes.has('hidden')).toBe(false);
        expect(mockElements['swiper-wrapper'].innerHTML).toContain('swiper-slide');
    });

    test('closeSlideViewer hides modal and destroys swiper', () => {
        mockElements['slide-viewer-modal'].classList.remove('hidden');
        closeSlideViewer();
        expect(mockElements['slide-viewer-modal'].classes.has('hidden')).toBe(true);
    });

    test('toggleFullScreen requests fullscreen', () => {
        document.fullscreenElement = null;
        toggleFullScreen();
        expect(mockElements['slide-viewer-modal'].requestFullscreen).toHaveBeenCalled();
    });
});

describe('Lesson Logic', () => {
    test('nextSlide increments index', () => {
        setLessonSlides([{t:'S1',c:'C1'}, {t:'S2',c:'C2'}]);
        setSlideIndex(0);
        nextSlide();
        expect(getSlideIndex()).toBe(1);
    });

    test('prevSlide decrements index', () => {
        setLessonSlides([{t:'S1',c:'C1'}, {t:'S2',c:'C2'}]);
        setSlideIndex(1);
        prevSlide();
        expect(getSlideIndex()).toBe(0);
    });

    test('openLesson opens slide viewer for lesson with predefined slides', () => {
        openLesson(0);
        expect(mockElements['slide-viewer-modal'].classes.has('hidden')).toBe(false);
        expect(mockElements['swiper-wrapper'].innerHTML).toContain('Introducere');
    });

    test('openLesson for lesson with file but no slides renders into lesson-body', () => {
        openLesson(1);
        expect(mockElements['lectie-detaliu'].classes.has('active')).toBe(true);
        expect(mockElements['lesson-title'].innerText).toBe("Costul de Oportunitate");
        expect(mockElements['lesson-body'].innerHTML).toContain('file-view-container');
        expect(mockElements['lesson-body'].innerHTML).toContain('iframe');
    });

    test('openLesson with invalid index returns early', () => {
        const initialTitle = "initial";
        mockElements['lesson-title'].innerText = initialTitle;
        openLesson(999);
        expect(mockElements['lesson-title'].innerText).toBe(initialTitle);
    });
});

describe('Quiz Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('startQuiz resets state and starts timer', () => {
        setScore(10);
        setCurrentIdx(5);
        setSecs(100);
        setCorrect(5);
        setWrong(5);
        setTimer(999);
        mockElements['correct-count'].innerText = 5;
        mockElements['wrong-count'].innerText = 5;
        mockElements['timer'].innerText = "01:40";

        startQuiz();

        expect(getCurrentIdx()).toBe(0);
        expect(getScore()).toBe(0);
        expect(getSecs()).toBe(0);
        expect(getCorrect()).toBe(0);
        expect(getWrong()).toBe(0);

        expect(global.clearInterval).toHaveBeenCalledWith(999);
        expect(global.setInterval).toHaveBeenCalled();

        expect(mockElements['correct-count'].innerText).toBe("0");
        expect(mockElements['wrong-count'].innerText).toBe("0");
        expect(mockElements['timer'].innerText).toBe("00:00");

        expect(mockElements['quiz'].classes.has('active')).toBe(true);
        expect(getCurrentQuestions().length).toBeGreaterThan(0);
        expect(getCurrentQuestions().length).toBeLessThanOrEqual(20);
        expect(mockElements['q-text'].innerText).not.toBe('');
        expect(mockElements['q-counter'].innerText).toContain('1 /');
    });

    test('startQuiz filters by type', () => {
        startQuiz('micro');
        expect(getQuizType()).toBe('micro');
        expect(getCurrentQuestions().length).toBeGreaterThan(0);
    });

    test('renderQ correctly populates DOM with question and options', () => {
        const mockQuestions = [
            { q: 'What is 1+1?', o: ['1', '2', '3'], c: 1 },
            { q: 'What is 2+2?', o: ['3', '4', '5'], c: 1 }
        ];
        setCurrentQuestions(mockQuestions);
        setCurrentIdx(0);
        renderQ();

        expect(mockElements['q-text'].innerText).toBe('What is 1+1?');
        expect(mockElements['q-counter'].innerText).toBe('1 / 2');
        expect(mockElements['progress-bar'].style.width).toBe('50%');
        expect(mockElements['options-box'].innerHTML).toContain('opt-btn');
        expect(mockElements['options-box'].innerHTML).toContain('1');
        expect(mockElements['options-box'].innerHTML).toContain('data-index="0"');

        setCurrentIdx(1);
        mockElements['options-box'].innerHTML = 'some old content';
        renderQ();

        expect(mockElements['q-text'].innerText).toBe('What is 2+2?');
        expect(mockElements['q-counter'].innerText).toBe('2 / 2');
        expect(mockElements['progress-bar'].style.width).toBe('100%');
        expect(mockElements['options-box'].innerHTML).not.toContain('some old content');
        expect(mockElements['options-box'].innerHTML).toContain('4');
    });
    test('finish shows results', () => {
        setScore(95);
        finish();
        expect(mockElements['results'].classes.has('active')).toBe(true);
        expect(mockElements['final-score'].innerText).toBe("95");
    });

    test('Event Delegation works: Click on option updates score', async () => {
        await initializationPromise;
        startQuiz();
        renderQ();

        const handler = quizHandler;
        expect(handler).toBeDefined();

        const q = getCurrentQuestions()[getCurrentIdx()];
        const correctIndex = q.c;
        const mockEvent = { target: { classList: { contains: (c) => c === 'opt-btn' }, dataset: { index: correctIndex.toString() } } };
        const initialScore = getScore();
        handler(mockEvent);
        expect(getScore()).toBeGreaterThan(initialScore);
        expect(mockElements['quiz-feedback-overlay'].innerText).toBe('CORECT!');
    });

});
describe('Library Logic', () => {
    test('nextLibrarySlide increments index', () => {
        setLibrarySlides([{t:'S1',c:'C1'}, {t:'S2',c:'C2'}]);
        setLibrarySlideIndex(0);
        nextLibrarySlide();
        expect(getLibrarySlideIndex()).toBe(1);
    });

    test('prevLibrarySlide decrements index', () => {
        setLibrarySlides([{t:'S1',c:'C1'}, {t:'S2',c:'C2'}]);
        setLibrarySlideIndex(1);
        prevLibrarySlide();
        expect(getLibrarySlideIndex()).toBe(0);
    });

    test('openLibraryItem shows library detail with iframe for PDF', () => {
        openLibraryItem(0);
        expect(mockElements['biblioteca-detaliu'].classes.has('active')).toBe(true);
        expect(mockElements['library-body'].innerHTML).toContain('iframe');
    });
});
