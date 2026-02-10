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
