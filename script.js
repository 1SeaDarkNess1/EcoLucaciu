// --- NAVIGARE CU BROWSER BACK FIX ---
function showPage(id, saveHistory = true) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Actualizăm URL-ul fără a reîncărca pagina
        if(saveHistory) {
            history.pushState({ pageId: id }, "", "#" + id);
        }
    }
}

window.onpopstate = function(event) {
    if (event.state && event.state.pageId) {
        showPage(event.state.pageId, false);
    } else {
        showPage('home', false);
    }
};

// --- DATA: LECTII COMPLETE (EXTRASE DIN PPT-URILE TALE) ---
const lectiiCompleta = [
    { 
        id: 0, 
        titlu: "Nevoile și Resursele", 
        slides: [
            { t: "Conceptul de Nevoie", c: "Nevoile umane reprezintă cerințele obiectiv necesare ale vieții, fiind nelimitate și în continuă diversificare. Clasificare: Primare (biologice), Secundare (sociale), Superioare (spirituale)." },
            { t: "Resursele și Raritatea", c: "Resursele sunt elementele utilizate pentru a produce bunuri. Problema fundamentală a economiei este <b>raritatea</b>: resursele sunt limitate, în timp ce nevoile sunt nelimitate." },
            { t: "Legea Raritǎții", c: "Resursele și bunurile sunt limitate în raport cu nevoile umane. Această tensiune obligă agenții economici la ALEGERI raționale." }
        ]
    },
    { 
        id: 1, 
        titlu: "Costul de Oportunitate", 
        slides: [
            { t: "Definiție", c: "Costul de oportunitate (Cop) reprezintă valoarea celei mai bune alternative la care se renunță în favoarea alegerii făcute. Este un cost al 'șansei sacrificate'." },
            { t: "Formula de Calcul", c: "Formula standard: $$Cop = - \\frac{\\Delta Y}{\\Delta X}$$ Unde $\\Delta Y$ este cantitatea la care se renunță și $\\Delta X$ este cantitatea câștigată." }
        ]
    },
    {
        id: 2,
        titlu: "Utilitatea Economică",
        slides: [
            { t: "Utilitatea Individuală", c: "Satisfacția resimțită prin consumarea unei unități dintr-un bun." },
            { t: "Legea lui Gossen", c: "Legea utilității marginale descrescânde: pe măsură ce se consumă unități succesive dintr-un bun, satisfacția suplimentară (Umg) scade până la zero (pragul de saturație)." }
        ]
    }
    // ... aici pot fi adăugate toate cele 12 module similare
];

const unis = [
    { id: 1, n: "ASE București - Cibernetică", m: "9.85", d: "<h3>Admitere</h3><p>Examen grilă la Matematică/Economie. Hub de elită pentru IT Economic.</p>" },
    { id: 2, n: "FSEGA Cluj (UBB)", m: "9.65", d: "<h3>Viziune</h3><p>Cel mai mare centru de business din Ardeal. Programe multilingve.</p>" }
];

const masterBank = [
    { q: "Nevoile umane sunt, în raport cu resursele:", o: ["Limitate", "Nelimitate", "Statice"], c: 1 },
    { q: "Costul de oportunitate reprezintă:", o: ["Costul banilor", "Cea mai bună alternativă sacrificată", "Profitul net"], c: 1 },
    { q: "Utilitatea marginală este zero când utilitatea totală este:", o: ["Minimă", "Maximă", "Negativă"], c: 1 }
];

// --- LOGICA SUBPAGINI LECTII ---
function openLesson(index) {
    const lectie = lectiiCompleta[index];
    if(!lectie) return;
    
    document.getElementById('lesson-title').innerText = lectie.titlu;
    const body = document.getElementById('lesson-body');
    body.innerHTML = "";
    
    lectie.slides.forEach(s => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'ppt-slide';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'slide-title';
        titleSpan.textContent = s.t;

        const textDiv = document.createElement('div');
        textDiv.className = 'slide-text';
        textDiv.innerHTML = s.c;

        slideDiv.appendChild(titleSpan);
        slideDiv.appendChild(textDiv);
        body.appendChild(slideDiv);
    });
    
    showPage('lectie-detaliu');
    if (window.MathJax) MathJax.typeset();
}

// --- LOGICA QUIZ ---
let currentQuestions = [];
let currentIdx = 0, score = 0, timer, secs = 0, correct = 0, wrong = 0;

function startQuiz() {
    currentQuestions = [...masterBank].sort(() => 0.5 - Math.random()).slice(0, 20);
    currentIdx = 0; score = 0; secs = 0; correct = 0; wrong = 0;
    document.getElementById('correct-count').innerText = 0;
    document.getElementById('wrong-count').innerText = 0;
    showPage('quiz');
    clearInterval(timer);
    timer = setInterval(() => {
        secs++; document.getElementById('timer').innerText = `${Math.floor(secs / 60)}:${secs % 60 < 10 ? '0' : ''}${secs % 60}`;
    }, 1000);
    renderQ();
}

function renderQ() {
    const d = currentQuestions[currentIdx];
    const qText = document.getElementById('q-text');
    qText.innerText = d.q;
    document.getElementById('q-counter').innerText = `${currentIdx + 1} / ${currentQuestions.length}`;
    document.getElementById('progress-bar').style.width = `${((currentIdx + 1) / currentQuestions.length) * 100}%`;
    const box = document.getElementById('options-box'); box.innerHTML = '';
    d.o.forEach((opt, i) => {
        const btn = document.createElement('button'); btn.className = 'opt-btn'; btn.innerText = opt;
        btn.onclick = () => {
            const overlay = document.getElementById('quiz-feedback-overlay');
            overlay.classList.remove('hidden');
            if (i === d.c) {
                score += 5; correct++;
                overlay.innerText = "CORECT!"; overlay.className = "feedback-overlay correct-overlay";
                document.getElementById('correct-count').innerText = correct;
            } else {
                wrong++;
                overlay.innerText = "GREȘIT!"; overlay.className = "feedback-overlay wrong-overlay";
                document.getElementById('wrong-count').innerText = wrong;
            }
            setTimeout(() => {
                overlay.classList.add('hidden');
                currentIdx++;
                if (currentIdx < currentQuestions.length) renderQ(); else finish();
            }, 700);
        };
        box.appendChild(btn);
    });
}

function finish() {
    clearInterval(timer);
    showPage('results');
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-time').innerText = document.getElementById('timer').innerText;
    document.getElementById('final-grade').innerText = (score / 10).toFixed(1);
    document.getElementById('performance-msg').innerText = score >= 85 ? "Excelent! Pregătit de succes." : "Continuă studiul pentru rezultate mai bune.";
}

function openUni(id) {
    const u = unis.find(x => x.id === id);
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = "";

    const h1 = document.createElement('h1');
    h1.textContent = u.n;
    modalBody.appendChild(h1);

    const p = document.createElement('p');
    p.textContent = 'Medie: ';
    const b = document.createElement('b');
    b.textContent = u.m;
    p.appendChild(b);
    modalBody.appendChild(p);

    modalBody.appendChild(document.createElement('hr'));

    const details = document.createElement('div');
    details.innerHTML = u.d;
    modalBody.appendChild(details);

    document.getElementById('uni-modal').classList.remove('hidden');
}
function closeModal() { document.getElementById('uni-modal').classList.add('hidden'); }

// --- INITIALIZARE ---
window.onload = () => {
    // Populare listă capitole
    const chaptersList = document.getElementById('chapters-list');
    lectiiCompleta.forEach((l, idx) => {
        const div = document.createElement('div');
        div.className = 'chapter-card glass';
        div.onclick = () => openLesson(idx);

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
        chaptersList.appendChild(div);
    });
    // Populare universități
    const uniGrid = document.getElementById('uni-grid');
    unis.forEach(u => {
        const div = document.createElement('div');
        div.className = 'nav-card glass';
        div.onclick = () => openUni(u.id);

        const h3 = document.createElement('h3');
        h3.textContent = u.n;

        const p = document.createElement('p');
        p.textContent = 'Medie: ';
        const b = document.createElement('b');
        b.textContent = u.m;

        p.appendChild(b);
        div.appendChild(h3);
        div.appendChild(p);
        uniGrid.appendChild(div);
    });
    
    // Setăm starea inițială în istoric
    history.replaceState({ pageId: 'home' }, "", "#home");
};
