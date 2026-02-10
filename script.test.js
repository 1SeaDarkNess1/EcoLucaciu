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
        appendChild: jest.fn(function(child) {
            const content = child.innerHTML || child.textContent || child.innerText || '';
            const tag = child.tagName ? child.tagName.toLowerCase() : '';
            if (tag) {
                const cls = child.className ? ` class="${child.className}"` : '';
                this.innerHTML += `<${tag}${cls}>${content}</${tag}>`;
            } else {
                this.innerHTML += content;
            }
            return child;
        }),
        tabIndex: 0,
        role: '',
        querySelectorAll: jest.fn((selector) => {
            if (selector === '.toc-item') {
                return el.tocItems || [];
            }
            return [];
        }),
        requestFullscreen: jest.fn(() => Promise.resolve()),
        click: jest.fn()
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
    'slide-body', 'slide-counter', 'lesson-toc', 'mySwiper', 'lesson-title', 'library-title'
].forEach(id => {
    mockElements[id] = createMockElement(id);
});

// Add .view class to view elements
['home', 'lectii', 'biblioteca', 'about', 'results', 'quiz', 'lectie-detaliu', 'biblioteca-detaliu'].forEach(id => mockElements[id].classList.add('view'));
mockElements['uni-modal'].classList.add('hidden');
mockElements['slide-viewer-modal'].classList.add('hidden');

global.document = {
    body: { style: {} },
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
    showPage, openUni, closeModal, unis, finish,
    setScore: (v) => score = v,
    setTimer: (v) => timer = v,
    getScore: () => score,
    getTimer: () => timer,
    startQuiz, renderQ,
    getCurrentIdx: () => currentIdx,
    getCorrect: () => correct,
    getWrong: () => wrong,
    getCurrentQuestions: () => currentQuestions,
    getQuizType: () => currentQuizType,
    nextLibrarySlide, prevLibrarySlide,
    getLibrarySlideIndex: () => currentLibrarySlideIndex,
    setLibrarySlides: (s) => currentLibrarySlides = s,
    setLibrarySlideIndex: (i) => currentLibrarySlideIndex = i,
    renderLibrarySlide,
    openLesson, openLibraryItem,

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
if (loadListener) loadListener();
const toggleSidebar = global.window.toggleSidebar;

Object.assign(global, context);
global.toggleSidebar = toggleSidebar;

describe('Core Functionality', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockElements['uni-modal'].classList.add('hidden');
        mockElements['slide-viewer-modal'].classList.add('hidden');
    });

    test('openUni should show modal with correct info', () => {
        const uni = unis[0];
        openUni(uni.id);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.n);
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
    });

    test('closeModal hides modal', () => {
        mockElements['uni-modal'].classList.remove('hidden');
        closeModal();
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });

    test('showPage should navigate correctly', () => {
        showPage('lectii');
        expect(mockElements['lectii'].classes.has('active')).toBe(true);
        expect(mockElements['home'].classes.has('active')).toBe(false);
    });

    test('toggleSidebar should toggle class', () => {
        toggleSidebar();
        expect(mockElements['sidebar'].classes.has('open')).toBe(true);
        toggleSidebar();
        expect(mockElements['sidebar'].classes.has('open')).toBe(false);
    });

    test('window.onpopstate should call showPage', () => {
        if (popstateListener) popstateListener({ state: { pageId: 'lectii' } });
        expect(mockElements['lectii'].classes.has('active')).toBe(true);
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

    test('openLesson opens slide viewer for ppt', () => {
        openLesson(0);
        expect(mockElements['slide-viewer-modal'].classes.has('hidden')).toBe(false);
        expect(mockElements['swiper-wrapper'].innerHTML).toContain('Introducere');
    });
});

describe('Quiz Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('startQuiz resets state and starts timer', () => {
        startQuiz();
        expect(getCurrentIdx()).toBe(0);
        expect(global.setInterval).toHaveBeenCalled();
        expect(mockElements['quiz'].classes.has('active')).toBe(true);
    });

    test('startQuiz filters by type', () => {
        startQuiz('micro');
        expect(getQuizType()).toBe('micro');
    });

    test('renderQ updates options', () => {
        startQuiz();
        renderQ();
        expect(mockElements['options-box'].innerHTML).toContain('opt-btn');
    });

    test('finish shows results', () => {
        setScore(95);
        finish();
        expect(mockElements['results'].classes.has('active')).toBe(true);
        expect(mockElements['final-score'].innerText).toBe(95);
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
