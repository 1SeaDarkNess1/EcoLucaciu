const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><div id="chapters-list"></div>');
const document = dom.window.document;
const lectiiCompleta = Array.from({length: 18}, (_, i) => ({ titlu: 'Lectia ' + i }));

function benchDocumentFragment() {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = '';
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
        chaptersList.innerHTML = '';
        const chapterFragment = document.createDocumentFragment();
        lectiiCompleta.forEach((l, idx) => {
            const div = document.createElement('div');
            div.className = 'chapter-card glass';
            div.onclick = () => {};

            const h3 = document.createElement('h3');
            h3.textContent = `CAPITOLUL ${idx + 1}`;

            const p = document.createElement('p');
            p.textContent = l.titlu;

            const small = document.createElement('small');
            small.style.color = 'var(--accent)';
            small.textContent = 'Click pentru lecție →';

            div.appendChild(h3);
            div.appendChild(p);
            div.appendChild(small);
            chapterFragment.appendChild(div);
        });
        chaptersList.appendChild(chapterFragment);
    }
    return Date.now() - start;
}

function benchInnerHTML() {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = '';
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
        chaptersList.innerHTML = lectiiCompleta.map((l, idx) => `
            <div class='chapter-card glass' onclick='openLesson(${idx})'>
                <h3>CAPITOLUL ${idx + 1}</h3>
                <p>${l.titlu}</p>
                <small style='color: var(--accent)'>Click pentru lecție →</small>
            </div>`).join('');
    }
    return Date.now() - start;
}

console.log('DocumentFragment:', benchDocumentFragment(), 'ms');
console.log('InnerHTML once:', benchInnerHTML(), 'ms');
