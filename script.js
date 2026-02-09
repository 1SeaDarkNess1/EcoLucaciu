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

// --- DATA: BIBLIOTECA (PLACEHOLDER) ---
const bibliotecaCompleta = [
    {
        id: 0,
        titlu: "Ghid de Studiu Economie",
        slides: [
            { t: "Introducere", c: "Acest ghid oferă o privire de ansamblu asupra conceptelor economice fundamentale." },
            { t: "Microeconomie vs Macroeconomie", c: "Microeconomia studiază comportamentul agenților individuali, în timp ce macroeconomia analizează economia ca un întreg." }
        ]
    },
    {
        id: 1,
        titlu: "Mic Dicționar Economic",
        slides: [
            { t: "A - Active", c: "Bunuri sau drepturi deținute de o companie care au valoare economică." },
            { t: "B - Buget", c: "Plan financiar care estimează veniturile și cheltuielile pe o anumită perioadă." }
        ]
    }
];

const unis = [
    {
        id: 1,
        n: "ASE București - Cibernetică",
        m: "9.85",
        d: "<h3>Cibernetică, Statistică și Informatică Economică</h3><p>Cea mai prestigioasă facultate din cadrul ASE. Programul de licență îmbină economia cu tehnologia informației.</p><h4>Admitere</h4><ul><li>Examen scris la Matematică sau Economie (60-70% din medie)</li><li>Media Bacalaureat (30-40%)</li></ul><h4>Oportunități</h4><p>Data Scientist, Business Analyst, Developer în Fintech.</p><a href='https://csie.ase.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 2,
        n: "FSEGA Cluj (UBB)",
        m: "9.65",
        d: "<h3>Facultatea de Științe Economice și Gestiunea Afacerilor</h3><p>Parte a Universității Babeș-Bolyai, FSEGA este cea mai mare facultate din România ca număr de studenți.</p><h4>Admitere</h4><ul><li>Concurs de dosare (media Bacalaureat + nota la disciplină relevantă)</li></ul><h4>Specializări Top</h4><p>Informatică Economică, Finanțe-Bănci, Marketing (linii de studiu în RO, EN, DE, FR, HU).</p><a href='https://econ.ubbcluj.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 3,
        n: "UAIC Iași - FEAA",
        m: "9.45",
        d: "<h3>Facultatea de Economie și Administrarea Afacerilor</h3><p>Polul educației economice din Moldova, cu o tradiție academică puternică și campus modern.</p><h4>Admitere</h4><p>Media de la Bacalaureat (100% sau ponderată cu nota la diverse discipline).</p><h4>Facilități</h4><p>Acces la baze de date internaționale, stagii de practică la multinaționale din Iași.</p><a href='https://www.feaa.uaic.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 4,
        n: "UVT Timișoara - FEAA",
        m: "9.30",
        d: "<h3>Facultatea de Economie și de Administrare a Afacerilor</h3><p>Orientare vestică, focalizată pe nevoile pieței muncii și antreprenoriat.</p><h4>Admitere</h4><p>Concurs de dosare. Media generală de la bacalaureat.</p><h4>Puncte forte</h4><p>Parteneriate solide cu mediul de afaceri din Timișoara (Continental, Nokia, etc.).</p><a href='https://feaa.uvt.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 5,
        n: "UBB Cluj - Facultatea de Business",
        m: "9.50",
        d: "<h3>Facultatea de Business</h3><p>Prima facultate de profil din România, cu o abordare unică, practică și orientată spre leadership.</p><h4>Admitere</h4><p>Eseu motivațional + Media Bacalaureat.</p><h4>Viziune</h4><p>Pregătirea viitorilor antreprenori și manageri prin simulări de business și proiecte reale.</p><a href='https://tbs.ubbcluj.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 6,
        n: "Politehnica București - FAIMA",
        m: "9.10",
        d: "<h3>Facultatea de Antreprenoriat, Ingineria și Managementul Afacerilor</h3><p>Îmbină rigoarea ingineriei cu flexibilitatea economică.</p><h4>Admitere</h4><p>Examen scris tip grilă (Matematică + Economie/Fizică).</p><h4>Carieră</h4><p>Manageri tehnici, Consultanță în producție, Project Management.</p><a href='https://faima.upb.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 7,
        n: "Transilvania Brașov - SEAA",
        m: "9.25",
        d: "<h3>Științe Economice și Administrarea Afacerilor</h3><p>Excelență în turism, comerț și servicii, profitând de poziția strategică a Brașovului.</p><h4>Admitere</h4><p>Concurs de dosare.</p><h4>Specializări unice</h4><p>Economia Comerțului, Turismului și Serviciilor.</p><a href='https://economice.unitbv.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    },
    {
        id: 8,
        n: "Universitatea din București - FAA",
        m: "9.40",
        d: "<h3>Facultatea de Administrație și Afaceri</h3><p>O facultate tânără și dinamică în cadrul celei mai vechi universități din București.</p><h4>Admitere</h4><p>Examen scris (50%) + Media Bacalaureat (50%).</p><h4>Focus</h4><p>Administrarea afacerilor, Marketing, Administrație publică.</p><a href='https://faa.unibuc.ro' target='_blank' class='uni-link'>Vizitează site oficial</a>"
    }
];

const masterBank = [
    { q: "Nevoile umane sunt, în raport cu resursele:", o: ["Limitate", "Nelimitate", "Statice"], c: 1 },
    { q: "Costul de oportunitate reprezintă:", o: ["Costul banilor", "Cea mai bună alternativă sacrificată", "Profitul net"], c: 1 },
    { q: "Utilitatea marginală este zero când utilitatea totală este:", o: ["Minimă", "Maximă", "Negativă"], c: 1 },
    { q: "Salariul este prețul plătit pentru:", o: ["Capital", "Pământ", "Muncă"], c: 2 },
    { q: "Care dintre următoarele este un bun liber?", o: ["Aerul", "Haina", "Autobuzul"], c: 0 },
    { q: "Piața cu concurență perfectă presupune:", o: ["Produse diferențiate", "Atomicitatea participanților", "Bariere la intrare"], c: 1 },
    { q: "Inflația se manifestă prin:", o: ["Scăderea prețurilor", "Creșterea puterii de cumpărare", "Creșterea generalizată a prețurilor"], c: 2 },
    { q: "Dobânda este prețul:", o: ["Muncii", "Capitalului împrumutat", "Pământului"], c: 1 },
    { q: "Produsul Intern Brut (PIB) măsoară:", o: ["Bogăția totală", "Valoarea bunurilor finale produse într-un an", "Exporturile nete"], c: 1 },
    { q: "Cererea este inelastică dacă:", o: ["Coeficientul elasticității < 1", "Coeficientul elasticității > 1", "Coeficientul elasticității = 1"], c: 0 }
];

// --- LOGICA SUBPAGINI LECTII ---
let currentSlideIndex = 0;
let currentLessonSlides = [];

function openLesson(index) {
    const lectie = lectiiCompleta[index];
    if(!lectie) return;
    
    document.getElementById('lesson-title').innerText = lectie.titlu;
    currentLessonSlides = lectie.slides;
    currentSlideIndex = 0;

    showPage('lectie-detaliu');
    renderSlide();
}

function renderSlide() {
    const body = document.getElementById('lesson-body');
    
fix-xss-university-grid-13260253321983992451
    lectie.slides.forEach(s => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'ppt-slide';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'slide-title';
    titleSpan.textContent = s.t; // Sigur împotriva XSS

    const textDiv = document.createElement('div');
    textDiv.className = 'slide-text';
    textDiv.innerHTML = s.c; // Păstrat innerHTML doar dacă s.c conține HTML intenționat (ex: bold, italic)

    slideDiv.appendChild(titleSpan);
    slideDiv.appendChild(textDiv);
    body.appendChild(slideDiv);
    });

    body.innerHTML = `
        <div class='ppt-slide'>
            <span class='slide-title'>${slide.t}</span>
            <div class='slide-text'>${slide.c}</div>
        </div>`;

    document.getElementById('slide-counter').innerText = `Slide ${currentSlideIndex + 1} / ${currentLessonSlides.length}`;
 main
    
    const prevBtn = document.querySelector("button[onclick='prevSlide()']");
    const nextBtn = document.querySelector("button[onclick='nextSlide()']");

    if(prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if(nextBtn) nextBtn.disabled = currentSlideIndex === currentLessonSlides.length - 1;

    if (window.MathJax) MathJax.typeset();
}

function nextSlide() {
    if (currentSlideIndex < currentLessonSlides.length - 1) {
        currentSlideIndex++;
        renderSlide();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
    }
}

// --- LOGICA SUBPAGINI BIBLIOTECA ---
let currentLibrarySlideIndex = 0;
let currentLibrarySlides = [];

function openLibraryItem(index) {
    const item = bibliotecaCompleta[index];
    if(!item) return;

    document.getElementById('library-title').innerText = item.titlu;
    currentLibrarySlides = item.slides;
    currentLibrarySlideIndex = 0;

    showPage('biblioteca-detaliu');
    renderLibrarySlide();
}

function renderLibrarySlide() {
    const body = document.getElementById('library-body');
    const slide = currentLibrarySlides[currentLibrarySlideIndex];
    if(!slide) return;

    body.innerHTML = `
        <div class='ppt-slide'>
            <span class='slide-title'>${slide.t}</span>
            <div class='slide-text'>${slide.c}</div>
        </div>`;

    document.getElementById('library-slide-counter').innerText = `Slide ${currentLibrarySlideIndex + 1} / ${currentLibrarySlides.length}`;

    const prevBtn = document.querySelector("#biblioteca-detaliu .slide-navigation button:first-child");
    const nextBtn = document.querySelector("#biblioteca-detaliu .slide-navigation button:last-child");

    if(prevBtn) prevBtn.disabled = currentLibrarySlideIndex === 0;
    if(nextBtn) nextBtn.disabled = currentLibrarySlideIndex === currentLibrarySlides.length - 1;

    if (window.MathJax) MathJax.typeset();
}

function nextLibrarySlide() {
    if (currentLibrarySlideIndex < currentLibrarySlides.length - 1) {
        currentLibrarySlideIndex++;
        renderLibrarySlide();
    }
}

function prevLibrarySlide() {
    if (currentLibrarySlideIndex > 0) {
        currentLibrarySlideIndex--;
        renderLibrarySlide();
    }
}

// --- LOGICA QUIZ ---
let currentQuestions = [];
let currentIdx = 0, score = 0, timer, secs = 0, correct = 0, wrong = 0;
let currentQuizType = "";

function startQuiz(type = "general") {
    currentQuizType = type;
    // Aici am putea filtra masterBank în funcție de tip, momentan folosim toate întrebările
    let bank = [...masterBank];
    if(type === 'micro') bank = bank.filter((_, i) => i % 2 === 0); // Exemplu filtrare
    if(type === 'macro') bank = bank.filter((_, i) => i % 2 !== 0);

    currentQuestions = bank.sort(() => 0.5 - Math.random()).slice(0, 20);

    // Resetare stare
    currentIdx = 0; score = 0; secs = 0; correct = 0; wrong = 0;
    document.getElementById('correct-count').innerText = 0;
    document.getElementById('wrong-count').innerText = 0;

    showPage('quiz');

    // Timer
    clearInterval(timer);
    timer = setInterval(() => {
        secs++;
        const min = Math.floor(secs / 60);
        const sec = secs % 60;
        document.getElementById('timer').innerText = `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
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

    if (!u) return;
    document.getElementById('modal-body').innerHTML = `<h1>${u.n}</h1><p>Medie: <b>${u.m}</b></p><hr>${u.d}`;
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
    document.getElementById('chapters-list').innerHTML = chaptersHTML;

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

    // Populare listă bibliotecă
    bibliotecaCompleta.forEach((l, idx) => {
        const list = document.getElementById('library-list');
        if(list) {
            list.innerHTML += `
                <div class='chapter-card glass' onclick='openLibraryItem(${idx})'>
                    <h3>RESURSA ${idx + 1}</h3>
                    <p>${l.titlu}</p>
                    <small style='color: var(--accent)'>Click pentru detalii →</small>
                </div>`;
        }
    });
    document.getElementById('uni-grid').innerHTML = unisHTML;
    
    // Setăm starea inițială în istoric
    history.replaceState({ pageId: 'home' }, "", "#home");
};
