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
    'modal-close-btn': { focus: jest.fn() }
};

global.document = {
    getElementById: jest.fn((id) => {
        if (!mockElements[id]) {
             // Return a generic mock if not found, to avoid crashes
             return { focus: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } };
        }
        return mockElements[id];
    }),
    querySelectorAll: jest.fn(() => []),
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
const scriptFunc = new Function('window', 'document', 'history', 'setInterval', 'clearInterval', scriptContent + '\n return { openUni, closeModal, unis };');
const { openUni, closeModal, unis } = scriptFunc(global.window, global.document, global.history, global.setInterval, global.clearInterval);

// Expose them to the test context
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
