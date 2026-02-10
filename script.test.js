const fs = require('fs');
const path = require('path');

// Mock DOM elements
const createMockElement = (id = '', tagName = 'DIV') => {
    const el = {
        id,
        tagName: tagName.toUpperCase(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn((cls) => el.classes.has(cls))
        },
        classes: new Set(),
        focus: jest.fn(),
        style: {},
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(function(child) {
            const content = child.innerHTML || child.textContent || '';
            this.innerHTML += content;
            return child;
        }),
        tabIndex: 0,
        role: ''
    };
    // Special handling for classList.add/remove to update the Set
    el.classList.add.mockImplementation((cls) => el.classes.add(cls));
    el.classList.remove.mockImplementation((cls) => el.classes.delete(cls));
    return el;
};

const mockElements = {
    'modal-body': createMockElement('modal-body'),
    'uni-modal': createMockElement('uni-modal'),
    'modal-close-btn': createMockElement('modal-close-btn'),
    'home': createMockElement('home'),
    'lectii': createMockElement('lectii'),
    'biblioteca': createMockElement('biblioteca'),
    'about': createMockElement('about'),
    'chapters-list': createMockElement('chapters-list'),
    'uni-grid': createMockElement('uni-grid'),
    'library-list': createMockElement('library-list'),
    'sidebar': createMockElement('sidebar'),
    'mobile-toggle': createMockElement('mobile-toggle'),
    'swiper-wrapper': createMockElement('swiper-wrapper'),
    'slide-viewer-modal': createMockElement('slide-viewer-modal')
};
// Add .view class to view elements
['home', 'lectii', 'biblioteca', 'about'].forEach(id => mockElements[id].classes.add('view'));
mockElements['uni-modal'].classes.add('hidden');

global.document = {
    getElementById: jest.fn((id) => {
        if (mockElements[id]) return mockElements[id];
        if (id === 'non-existent') return null;
        return createMockElement(id);
    }),
    querySelectorAll: jest.fn((selector) => {
        if (selector === '.view') {
            return [mockElements['home'], mockElements['lectii'], mockElements['biblioteca'], mockElements['about']];
        }
        if (selector === '.toc-item') return [];
        return [];
    }),
    querySelector: jest.fn((selector) => {
        if (mockElements[selector]) return mockElements[selector];
        if (selector === '.quiz-dashboard') return createMockElement('quiz-dashboard');
        if (selector === '.mySwiper') return createMockElement('mySwiper');
        return null;
    }),
    activeElement: { className: '', id: '', focus: jest.fn() },
    createElement: jest.fn((tag) => {
        return createMockElement('', tag);
    }),
    addEventListener: jest.fn(),
    createDocumentFragment: jest.fn(() => ({
        appendChild: jest.fn()
    }))
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
    open: jest.fn()
};

global.history = global.window.history;
global.setInterval = jest.fn();
global.clearInterval = jest.fn();

// Mock Swiper
global.Swiper = jest.fn(() => ({
    destroy: jest.fn()
}));

// Load the script
const scriptPath = path.resolve(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// We need to execute the script in the global context
const scriptFunc = new Function('window', 'document', 'history', 'setInterval', 'clearInterval', 'Swiper', scriptContent + '\n return { showPage, openUni, closeModal, unis };');
const { showPage, openUni, closeModal, unis } = scriptFunc(global.window, global.document, global.history, global.setInterval, global.clearInterval, global.Swiper);

// Expose them to the test context
global.showPage = showPage;
global.openUni = openUni;
global.closeModal = closeModal;
global.unis = unis;

describe('University Modal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockElements['modal-body'].innerHTML = '';
        mockElements['uni-modal'].classes.clear();
        mockElements['uni-modal'].classes.add('hidden');
    });

    test('openUni should populate modal-body with correct university info and show the modal', () => {
        const uniId = 1;
        const expectedUni = unis.find(u => u.id === uniId);

        openUni(uniId);

        expect(mockElements['modal-body'].innerHTML).toContain(expectedUni.n);
        expect(mockElements['modal-body'].innerHTML).toContain(expectedUni.m);
        expect(mockElements['modal-body'].innerHTML).toContain(expectedUni.d);
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
    });

    test('closeModal should add hidden class to uni-modal', () => {
        // First make sure it's visible
        mockElements['uni-modal'].classes.delete('hidden');

        closeModal();

        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });

    test('openUni should handle non-existent ID gracefully', () => {
        const initialHTML = mockElements['modal-body'].innerHTML;
        openUni(999);
        expect(mockElements['modal-body'].innerHTML).toBe(initialHTML);
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });
});

describe('Navigation (showPage)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset classes
        ['home', 'lectii', 'biblioteca', 'about'].forEach(id => {
            mockElements[id].classes.clear();
            mockElements[id].classes.add('view');
        });
    });

    test('showPage should remove active class from all views and add it to the target', () => {
        mockElements['about'].classes.add('active');

        showPage('home');

        expect(mockElements['home'].classes.has('active')).toBe(true);
        expect(mockElements['lectii'].classes.has('active')).toBe(false);
        expect(mockElements['biblioteca'].classes.has('active')).toBe(false);
        expect(mockElements['about'].classes.has('active')).toBe(false);
    });

    test('showPage should scroll to top', () => {
        showPage('home');
        expect(global.window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    test('showPage should push to history by default', () => {
        showPage('about');
        expect(global.history.pushState).toHaveBeenCalledWith({ pageId: 'about' }, "", "#about");
    });

    test('showPage should NOT push to history if saveHistory is false', () => {
        showPage('about', false);
        expect(global.history.pushState).not.toHaveBeenCalled();
    });

    test('showPage should do nothing if target element does not exist', () => {
        showPage('non-existent');

        // It still removes active from all views
        expect(mockElements['home'].classes.has('active')).toBe(false);
        expect(mockElements['about'].classes.has('active')).toBe(false);

        // But it doesn't scroll or pushState
        expect(global.window.scrollTo).not.toHaveBeenCalled();
        expect(global.history.pushState).not.toHaveBeenCalled();
    });

    test('window.onpopstate should call showPage with state pageId', () => {
        const event = { state: { pageId: 'lectii' } };
        global.window.onpopstate(event);

        expect(mockElements['lectii'].classes.has('active')).toBe(true);
        expect(global.history.pushState).not.toHaveBeenCalled(); // saveHistory should be false
    });

    test('window.onpopstate should call showPage with home if no state', () => {
        global.window.onpopstate({});

        expect(mockElements['home'].classes.has('active')).toBe(true);
        expect(global.history.pushState).not.toHaveBeenCalled(); // saveHistory should be false
    });
});
