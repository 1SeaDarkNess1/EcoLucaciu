const fs = require('fs');
const path = require('path');

// Mock DOM elements
const mockElements = {
    'modal-body': {
        innerHTML: '',
        focus: jest.fn(),
        appendChild: jest.fn(function(child) {
            // Simplified simulation of appendChild for text checks
            if (child.textContent) this.innerHTML += child.textContent;
            if (child.innerHTML) this.innerHTML += child.innerHTML;
            if (child.tagName === 'HR') this.innerHTML += '<hr>';
        })
    },
    'uni-modal': {
        classList: {
            add: jest.fn((cls) => {
                if(mockElements['uni-modal'].classes) mockElements['uni-modal'].classes.add(cls);
            }),
            remove: jest.fn((cls) => {
                 if(mockElements['uni-modal'].classes) mockElements['uni-modal'].classes.delete(cls);
            }),
            contains: jest.fn((cls) => {
                 if(mockElements['uni-modal'].classes) return mockElements['uni-modal'].classes.has(cls);
                 return false;
            })
        },
        classes: new Set(['hidden']),
        focus: jest.fn()
    },
    'modal-close-btn': { focus: jest.fn() },
    'home': { id: 'home', classList: { add: jest.fn(), remove: jest.fn() } },
    'about': { id: 'about', classList: { add: jest.fn(), remove: jest.fn() } }
};

global.document = {
    getElementById: jest.fn((id) => {
        if (mockElements[id]) return mockElements[id];
        if (id === 'non-existent') return null;
        // Return a generic mock if not found, to avoid crashes in other parts of the script
        return {
            focus: jest.fn(),
            classList: { add: jest.fn(), remove: jest.fn() },
            style: {},
            innerText: ''
        };
    }),
    querySelectorAll: jest.fn((selector) => {
        if (selector === '.view') {
            return [mockElements['home'], mockElements['about']];
        }
        return [];
    }),
    activeElement: { className: '', id: '', focus: jest.fn() },
    createElement: jest.fn((tag) => {
        return {
            tagName: tag.toUpperCase(),
            textContent: '',
            innerHTML: '',
            style: {},
            className: '',
            appendChild: jest.fn(function(child) {
                 if (child.textContent) this.textContent += child.textContent;
                 if (child.innerHTML) this.innerHTML += child.innerHTML;
            }),
            setAttribute: jest.fn(),
            focus: jest.fn()
        };
    })
};

global.window = {
    scrollTo: jest.fn(),
    history: {
        pushState: jest.fn(),
        replaceState: jest.fn()
    },
    location: { hash: '' }
};

global.history = global.window.history;
global.setInterval = jest.fn();
global.clearInterval = jest.fn();

// Load the script
const scriptPath = path.resolve(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// We need to execute the script in the global context
const scriptFunc = new Function('window', 'document', 'history', 'setInterval', 'clearInterval', scriptContent + '\n return { showPage, openUni, closeModal, unis };');
const { showPage, openUni, closeModal, unis } = scriptFunc(global.window, global.document, global.history, global.setInterval, global.clearInterval);

// Expose them to the test context
global.showPage = showPage;
global.openUni = openUni;
global.closeModal = closeModal;
global.unis = unis;

describe('University Modal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockElements['modal-body'].innerHTML = '';
        mockElements['uni-modal'].classes = new Set(['hidden']);
    });

    test('openUni should populate modal-body with correct university info and show the modal', () => {
        const uniId = 1;
        const expectedUni = unis.find(u => u.id === uniId);

        openUni(uniId);

        expect(mockElements['modal-body'].innerHTML).toContain(expectedUni.n);
        expect(mockElements['modal-body'].innerHTML).toContain(expectedUni.m);
        expect(mockElements['modal-body'].innerHTML).toContain(expectedUni.d);
        expect(mockElements['uni-modal'].classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
    });

    test('closeModal should add hidden class to uni-modal', () => {
        // First make sure it's visible
        mockElements['uni-modal'].classes.delete('hidden');

        closeModal();

        expect(mockElements['uni-modal'].classList.add).toHaveBeenCalledWith('hidden');
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });

    test('openUni should handle non-existent ID gracefully', () => {
        // Should not throw, should not update innerHTML, should not show modal
        const initialHTML = mockElements['modal-body'].innerHTML;

        expect(() => openUni(999)).not.toThrow();
        expect(mockElements['modal-body'].innerHTML).toBe(initialHTML);
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
    });
});

describe('Navigation (showPage)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('showPage should remove active class from all views and add it to the target', () => {
        showPage('home');

        expect(mockElements['home'].classList.remove).toHaveBeenCalledWith('active');
        expect(mockElements['about'].classList.remove).toHaveBeenCalledWith('active');
        expect(mockElements['home'].classList.add).toHaveBeenCalledWith('active');
        expect(mockElements['about'].classList.add).not.toHaveBeenCalled();
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
        expect(mockElements['home'].classList.remove).toHaveBeenCalledWith('active');
        expect(mockElements['about'].classList.remove).toHaveBeenCalledWith('active');

        // But it doesn't add active to anything or scroll/pushState
        expect(global.window.scrollTo).not.toHaveBeenCalled();
        expect(global.history.pushState).not.toHaveBeenCalled();
    });
});
