const fs = require('fs');
const path = require('path');

// Mock DOM elements
const createMockElement = (id = '', tagName = 'DIV') => {
    const el = {
        id,
        tagName: tagName.toUpperCase(),
        className: '',
        classList: {
            add: jest.fn((cls) => { el.classes.add(cls); el.className = Array.from(el.classes).join(' '); }),
            remove: jest.fn((cls) => { el.classes.delete(cls); el.className = Array.from(el.classes).join(' '); }),
            contains: jest.fn((cls) => el.classes.has(cls)),
            toggle: jest.fn((cls) => {
                if (el.classes.has(cls)) el.classes.delete(cls);
                else el.classes.add(cls);
                el.className = Array.from(el.classes).join(' ');
            })
        },
        classes: new Set(),
        focus: jest.fn(),
        style: {},
        dataset: {},
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        innerHTML: '',
        textContent: '',
        innerText: '',
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
        if (selector.includes('.reader-toolbar')) return createMockElement();
        return createMockElement();
    }),
    activeElement: { className: '', id: '', focus: jest.fn() },
    createElement: jest.fn((tag) => {
        return createMockElement('', tag);
    }),
    addEventListener: jest.fn(),
    createDocumentFragment: jest.fn(() => ({
        appendChild: jest.fn(function(child) {
            this.innerHTML = (this.innerHTML || '') + (child.innerHTML || '');
            return child;
        }),
        childNodes: []
    })),
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
    showPage, openUni, closeModal, unis, finish, getLastFocusedElement: () => lastFocusedElement,
    setScore: (v) => score = v,
    setTimer: (v) => timer = v,
    setSecs: (v) => secs = v,
    setCorrect: (v) => correct = v,
    setWrong: (v) => wrong = v,
    getScore: () => score,
    getTimer: () => timer,
    getSecs: () => secs,
    startQuiz, renderQ,
    getCurrentIdx: () => currentIdx, setCurrentIdx: (v) => currentIdx = v,
    getCorrect: () => correct,
    getWrong: () => wrong,
    getCurrentQuestions: () => currentQuestions, setCurrentQuestions: (v) => currentQuestions = v,
    getQuizType: () => currentQuizType,
    nextLibrarySlide, prevLibrarySlide,
    getLibrarySlideIndex: () => currentLibrarySlideIndex,
    setLibrarySlides: (s) => currentLibrarySlides = s,
    setLibrarySlideIndex: (i) => currentLibrarySlideIndex = i,
    renderLibrarySlide,
    openLesson, openLibraryItem,
    loadMathJax,

    toggleTOC, generateTOC, updateActiveTOC,
    openSlideViewer, closeSlideViewer, toggleFullScreen,
    nextSlide, prevSlide, renderSlide,
    getSlideIndex: () => currentSlideIndex,
    setSlideIndex: (i) => currentSlideIndex = i,
    setLessonSlides: (s) => currentLessonSlides = s,
    getLessonSlides: () => currentLessonSlides,

 };`);

const context = scriptFunc(global.window, global.document, global.history, global.setInterval, global.clearInterval, global.Swiper, global.window.MathJax);
const loadCall = global.window.addEventListener.mock.calls.find(call => call[0] === 'load');
const loadListener = loadCall ? loadCall[1] : null;
const popstateCall = global.window.addEventListener.mock.calls.find(call => call[0] === 'popstate');
const popstateListener = popstateCall ? popstateCall[1] : null;
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

        expect(mockElements['modal-body'].innerHTML).toContain(uni.n);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.m);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.d);
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
        expect(getLastFocusedElement()).toBe(previousActiveElement);
        expect(mockElements['modal-close-btn'].focus).toHaveBeenCalled();
    });

    test('openUni with invalid ID does nothing', () => {
        const initialHTML = mockElements['modal-body'].innerHTML;
        mockElements['uni-modal'].classList.add('hidden');
        openUni('non-existent');
        expect(mockElements['modal-body'].innerHTML).toBe(initialHTML);
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });

    test('closeModal hides modal and restores focus', () => {
        const previousActiveElement = { focus: jest.fn() };
        global.document.activeElement = previousActiveElement;

        openUni(unis[0].id);
        mockElements['uni-modal'].classList.remove('hidden');

        closeModal();
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
        expect(previousActiveElement.focus).toHaveBeenCalled();
        expect(getLastFocusedElement()).toBeNull();
    });

    test('showPage should navigate correctly', () => {
        showPage('lectii');
        expect(mockElements['lectii'].classes.has('active')).toBe(true);
        expect(mockElements['home'].classes.has('active')).toBe(false);
    });

    test('toggleSidebar should toggle class', () => {
        global.window.toggleSidebar();
        expect(mockElements['sidebar'].classes.has('open')).toBe(true);
        global.window.toggleSidebar();
        expect(mockElements['sidebar'].classes.has('open')).toBe(false);
    });

    test('window.onpopstate should call showPage', () => {
        if (popstateListener) popstateListener({ state: { pageId: 'lectii' } });
        expect(mockElements['lectii'].classes.has('active')).toBe(true);
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
        const item1 = createMockElement('', 'DIV');
        item1.classList.add('toc-item');
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
        // Lesson 1 has file: "Materiale/2-Costul_de_oportunitate.ppt" but no slides
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
        // Setup initial dirty state
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

        // Verify global state resets
        expect(getCurrentIdx()).toBe(0);
        expect(getScore()).toBe(0);
        expect(getSecs()).toBe(0);
        expect(getCorrect()).toBe(0);
        expect(getWrong()).toBe(0);

        // Verify timer management
        expect(global.clearInterval).toHaveBeenCalledWith(999);
        expect(global.setInterval).toHaveBeenCalled();

        // Verify DOM resets
        expect(mockElements['correct-count'].innerText).toBe(0);
        expect(mockElements['wrong-count'].innerText).toBe(0);
        expect(mockElements['timer'].innerText).toBe("00:00");

        // Verify navigation and initial render
        expect(mockElements['quiz'].classes.has('active')).toBe(true);
        expect(getCurrentQuestions().length).toBeGreaterThan(0);
        expect(getCurrentQuestions().length).toBeLessThanOrEqual(20);

        // renderQ side effects (check first question is rendered)
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

        // Test first question
        setCurrentIdx(0);
        renderQ();

        expect(mockElements['q-text'].innerText).toBe('What is 1+1?');
        expect(mockElements['q-counter'].innerText).toBe('1 / 2');
        expect(mockElements['progress-bar'].style.width).toBe('50%');
        expect(mockElements['options-box'].innerHTML).toContain('opt-btn');
        expect(mockElements['options-box'].innerHTML).toContain('1');
        expect(mockElements['options-box'].innerHTML).toContain('2');
        expect(mockElements['options-box'].innerHTML).toContain('3');
        expect(mockElements['options-box'].innerHTML).toContain('data-index="0"');
        expect(mockElements['options-box'].innerHTML).toContain('data-index="1"');
        expect(mockElements['options-box'].innerHTML).toContain('data-index="2"');

        // Test second question (clearing and updating)
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
        expect(mockElements['final-score'].innerText).toBe(95);
    });

    test('Event Delegation works: Click on option updates score', async () => {
        await loadListener();
        startQuiz();
        renderQ();
        const addListenerCall = mockElements['options-box'].addEventListener.mock.calls.find(call => call[0] === 'click');
        expect(addListenerCall).toBeDefined();
        const handler = addListenerCall[1];
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
