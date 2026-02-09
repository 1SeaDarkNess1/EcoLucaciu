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
    { id: 0, titlu: "Nevoile și Resursele", file: "Materiale/Lectia 1-Nevoi_si_resurse.ppt", type: "ppt" },
    { id: 1, titlu: "Costul de Oportunitate", file: "Materiale/2-Costul_de_oportunitate.ppt", type: "ppt" },
    { id: 2, titlu: "Oferta", file: "Materiale/2.1.-2.2-Oferta.ppt", type: "ppt" },
    { id: 3, titlu: "Factori de Producție (1)", file: "Materiale/2.3-Factori_de_productie-_partea_1 (1).ppt", type: "ppt" },
    { id: 4, titlu: "Factori de Producție (2)", file: "Materiale/2.4-Factori_de_productie-_partea_2.ppt", type: "ppt" },
    { id: 5, titlu: "Costuri de Producție (1)", file: "Materiale/2.5-Costuri_de_productie-_partea_1 (1).ppt", type: "ppt" },
    { id: 6, titlu: "Productivitatea", file: "Materiale/2.6-Productivitatea.ppt", type: "ppt" },
    { id: 7, titlu: "Profitul", file: "Materiale/2.7-Profitul.ppt", type: "ppt" },
    { id: 8, titlu: "Utilitatea Economică", file: "Materiale/3-Utilitatea_economica.ppt", type: "ppt" },
    { id: 9, titlu: "Mecanismul Concurențial", file: "Materiale/3.2-Mecanismul_concurential.ppt", type: "ppt" },
    { id: 10, titlu: "Piața Capitalurilor", file: "Materiale/3.3-Piata_capitalurilor (1).ppt", type: "ppt" },
    { id: 11, titlu: "Piața Muncii", file: "Materiale/3.4. - Piața muncii_.ppt", type: "ppt" },
    { id: 12, titlu: "Piața Monetară", file: "Materiale/3.5.-Piata monetară.ppt", type: "ppt" },
    { id: 13, titlu: "Cererea (Partea 1)", file: "Materiale/4-Cererea_partea_1.ppt", type: "ppt" },
    { id: 14, titlu: "Cererea (Partea 2)", file: "Materiale/5-Cererea_partea_2.ppt", type: "ppt" },
    { id: 15, titlu: "Proprietatea și Libera Inițiativă", file: "Materiale/6-Proprietatea_si_propria_initiativa.ppt", type: "ppt" },
    { id: 16, titlu: "Relația Cerere-Ofertă-Preț", file: "Materiale/Capitolul 3-3.1-Piata_Relatia_cerere-oferta-pret_in_economia_de_piata.ppt", type: "ppt" },
    { id: 17, titlu: "Factorii de Producție și Combinarea Acestora", file: "Materiale/Factorii de productie si combinarea acestora.ppt", type: "ppt" }
];

// --- DATA: BIBLIOTECA (PLACEHOLDER) ---
const bibliotecaCompleta = [
    { id: 0, titlu: "Consumatorul și Utilitatea Economică", file: "Bibliotecă/03 Consumatorul si utilitatea economica.pdf", type: "pdf" },
    { id: 1, titlu: "Piața - Test 1", file: "Bibliotecă/05t Piata. Test 1.pdf", type: "pdf" },
    { id: 2, titlu: "Agenții Economici", file: "Bibliotecă/Agentii economici.pdf", type: "pdf" },
    { id: 3, titlu: "Banii", file: "Bibliotecă/Banii.pdf", type: "pdf" },
    { id: 4, titlu: "CEREREA", file: "Bibliotecă/CEREREA.pdf", type: "pdf" },
    { id: 5, titlu: "Ce este Economia", file: "Bibliotecă/Ce este economia.pdf", type: "pdf" },
    { id: 6, titlu: "Concurența", file: "Bibliotecă/Concurenta.pdf", type: "pdf" },
    { id: 7, titlu: "Consumatorul", file: "Bibliotecă/Consumatorul.pdf", type: "pdf" },
    { id: 8, titlu: "Inflația", file: "Bibliotecă/Inflatia.pdf", type: "pdf" },
    { id: 9, titlu: "OFERTA", file: "Bibliotecă/OFERTA.pdf", type: "pdf" },
    { id: 10, titlu: "Piața - Cererea", file: "Bibliotecă/Piata - Cererea.pdf", type: "pdf" },
    { id: 11, titlu: "Piața - Oferta. Prețul", file: "Bibliotecă/Piata - Oferta. Pretul.pdf", type: "pdf" },
    { id: 12, titlu: "Piața Capitalurilor", file: "Bibliotecă/Piata capitalurilor.pdf", type: "pdf" },
    { id: 13, titlu: "Piața Monetară", file: "Bibliotecă/Piata monetara.pdf", type: "pdf" },
    { id: 14, titlu: "Piața Muncii", file: "Bibliotecă/Piata muncii.pdf", type: "pdf" },
    { id: 15, titlu: "Piața Valutară", file: "Bibliotecă/Piata valutara.pdf", type: "pdf" },
    { id: 16, titlu: "Profitul", file: "Bibliotecă/Profitul.pdf", type: "pdf" },
    { id: 17, titlu: "Proprietatea și Libera Inițiativă", file: "Bibliotecă/Proprietatea si libera initiativa.pdf", type: "pdf" },
    { id: 18, titlu: "Rezumat - Concurența", file: "Bibliotecă/Rezumat_Concurenta.pdf", type: "pdf" },
    { id: 19, titlu: "Șomajul", file: "Bibliotecă/Somajul.pdf", type: "pdf" },
    { id: 20, titlu: "Venit, Consum, Investiții", file: "Bibliotecă/Venit consum investitii.pdf", type: "pdf" }
];

const testeAntrenament = [
    { id: 0, titlu: "Bacalaureat 2020 - Varianta 5", file: "Teste de Antrenament/E_d_economie_2020_var_05_LRO.pdf", type: "pdf" },
    { id: 1, titlu: "Bacalaureat 2020 - Barem 5", file: "Teste de Antrenament/E_d_economie_2020_bar_05_LRO.pdf", type: "pdf" },
    { id: 2, titlu: "Filosofie 2020 - Barem 5", file: "Teste de Antrenament/E_d_filosofie_2020_bar_05_LRO.pdf", type: "pdf" },
    { id: 3, titlu: "Logică 2020 - Varianta 5", file: "Teste de Antrenament/E_d_logica_2020_var_05_LRO.pdf", type: "pdf" },
    { id: 4, titlu: "Recapitulare - Pregătire Bacalaureat", file: "Teste de Antrenament/Economie_Recapitulare_Pregatire pentru bacalaureat.pdf", type: "pdf" }
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

function toggleTOC(id) {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('collapsed');
}

function generateTOC(tocId, slides, setIndexCallback) {
    const container = document.getElementById(tocId);
    if(!container) return;
    container.innerHTML = '';

    slides.forEach((slide, idx) => {
        const item = document.createElement('div');
        item.className = 'toc-item';
        item.dataset.idx = idx;
        item.textContent = `${idx + 1}. ${slide.t}`;
        item.onclick = () => setIndexCallback(idx);
        container.appendChild(item);
    });
}

function updateActiveTOC(tocId, idx) {
    const container = document.getElementById(tocId);
    if(!container) return;
    const items = container.querySelectorAll('.toc-item');
    items.forEach(item => item.classList.remove('active'));
    if(items[idx]) items[idx].classList.add('active');
}

function openLesson(index) {
    const lectie = lectiiCompleta[index];
    if(!lectie) return;
    
    document.getElementById('lesson-title').innerText = lectie.titlu;

    if (lectie.file) {
        currentLessonSlides = [{
            t: lectie.titlu,
            c: `
                <div class="file-view-container" style="text-align: center; padding: 40px;">
                    <div class="file-icon" style="font-size: 5rem; margin-bottom: 20px;">📊</div>
                    <h3 style="margin-bottom: 15px;">Prezentare PowerPoint</h3>
                    <p>Acest capitol este disponibil sub formă de prezentare descărcabilă.</p>
                    <a href="${lectie.file}" download target="_blank" class="btn-start" style="display: inline-block; text-decoration: none; margin-top: 20px;">
                        📥 Descarcă Materialul
                    </a>
                </div>
            `
        }];
    } else {
        currentLessonSlides = lectie.slides || [];
    }

    currentSlideIndex = 0;

    showPage('lectie-detaliu');
    generateTOC('lesson-toc', currentLessonSlides, (idx) => {
        currentSlideIndex = idx;
        renderSlide();
    });
    renderSlide();
}

function renderSlide() {
    const body = document.getElementById('lesson-body');
    const slide = currentLessonSlides[currentSlideIndex];
    if(!slide) return;

    body.innerHTML = `
        <div class='ppt-slide'>
            <span class='slide-title'>${slide.t}</span>
            <div class='slide-text'>${slide.c}</div>
        </div>`;

    document.getElementById('slide-counter').innerText = `Slide ${currentSlideIndex + 1} / ${currentLessonSlides.length}`;
    
    // Update toolbar buttons (new selector)
    const prevBtn = document.querySelector("#lectie-detaliu .reader-toolbar button:first-child");
    const nextBtn = document.querySelector("#lectie-detaliu .reader-toolbar button:last-child");

    if(prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if(nextBtn) nextBtn.disabled = currentSlideIndex === currentLessonSlides.length - 1;

    updateActiveTOC('lesson-toc', currentSlideIndex);

    if (window.MathJax) MathJax.typesetPromise();
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

    if (item.file) {
        if (item.type === 'pdf') {
            currentLibrarySlides = [{
                t: item.titlu,
                c: `<iframe src="${item.file}" style="width: 100%; height: 700px; border: none; border-radius: 8px;"></iframe>
                <p style="text-align: center; margin-top: 10px;"><a href="${item.file}" download target="_blank" class="uni-link" style="color: var(--accent); font-weight: bold;">Sau descarcă PDF</a></p>`
            }];
        } else {
             currentLibrarySlides = [{
                t: item.titlu,
                c: `<div style="text-align: center; padding: 40px;">
                        <p>Acest fișier poate fi descărcat:</p>
                        <a href="${item.file}" download class="btn-start" style="text-decoration: none; display: inline-block; margin-top: 10px;">📥 Descarcă ${item.titlu}</a>
                    </div>`
            }];
        }
    } else {
        currentLibrarySlides = item.slides || [];
    }

    currentLibrarySlideIndex = 0;

    showPage('biblioteca-detaliu');
    generateTOC('library-toc', currentLibrarySlides, (idx) => {
        currentLibrarySlideIndex = idx;
        renderLibrarySlide();
    });
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

    // Update toolbar buttons
    const prevBtn = document.querySelector("#biblioteca-detaliu .reader-toolbar button:first-child");
    const nextBtn = document.querySelector("#biblioteca-detaliu .reader-toolbar button:last-child");

    if(prevBtn) prevBtn.disabled = currentLibrarySlideIndex === 0;
    if(nextBtn) nextBtn.disabled = currentLibrarySlideIndex === currentLibrarySlides.length - 1;

    updateActiveTOC('library-toc', currentLibrarySlideIndex);

    if (window.MathJax) MathJax.typesetPromise();
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
let currentIdx = 0, score = 0, timer = null, secs = 0, correct = 0, wrong = 0;
let currentQuizType = "";

function startQuiz(type = "general") {
    currentQuizType = type;
    // Aici am putea filtra masterBank în funcție de tip, momentan folosim toate întrebările
    let bank = [...masterBank];
    if(type === 'micro') bank = bank.filter((_, i) => i % 2 === 0);
    if(type === 'macro') bank = bank.filter((_, i) => i % 2 !== 0);
    // Dacă nu sunt suficiente întrebări după filtrare, folosim tot bank-ul sau duplicăm (logică placeholder)
    if (bank.length < 5) bank = [...masterBank];

    currentQuestions = bank.sort(() => 0.5 - Math.random()).slice(0, 20);

    // Resetare stare
    currentIdx = 0; score = 0; secs = 0; correct = 0; wrong = 0;
    document.getElementById('correct-count').innerText = 0;
    document.getElementById('wrong-count').innerText = 0;
    document.getElementById('timer').innerText = "00:00";

    showPage('quiz');

    // Timer
    if (timer) clearInterval(timer);
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

let lastFocusedElement = null;

function openUni(id) {
    const u = unis.find(x => x.id === id);
    if (!u) return;

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

    lastFocusedElement = document.activeElement;
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    document.getElementById('uni-modal').classList.add('hidden');
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

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
        const card = document.createElement('div');
        card.className = 'nav-card glass';
        card.onclick = () => openUni(u.id);

        // Accessibility
        card.tabIndex = 0;
        card.role = 'button';
        card.setAttribute('aria-label', `Vezi detalii despre ${u.n}`);
        card.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openUni(u.id);
            }
        };

        card.innerHTML = `<h3>${u.n}</h3><p>Medie: <b>${u.m}</b></p>`;
        uniGrid.appendChild(card);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Populare listă bibliotecă
    const libraryList = document.getElementById('library-list');
    if (libraryList) {
        const fragment = document.createDocumentFragment();
        bibliotecaCompleta.forEach((l, idx) => {
            const div = document.createElement('div');
            div.className = 'chapter-card glass';
            div.onclick = () => openLibraryItem(idx);

            const h3 = document.createElement('h3');
            h3.textContent = `RESURSA ${idx + 1}`;

            const p = document.createElement('p');
            p.textContent = l.titlu;

            const small = document.createElement('small');
            small.style.color = 'var(--accent)';
            small.textContent = 'Click pentru detalii →';

            div.appendChild(h3);
            div.appendChild(p);
            div.appendChild(small);
            fragment.appendChild(div);
        });
        libraryList.appendChild(fragment);
    }

    // Populare teste antrenament
    const quizDashboard = document.querySelector('.quiz-dashboard');
    if (quizDashboard && typeof testeAntrenament !== 'undefined') {
        const testSection = document.createElement('div');
        testSection.style.marginTop = "60px";
        testSection.innerHTML = '<h3 style="margin-bottom: 30px; font-size: 1.8rem; color: var(--accent);">Teste de Antrenament (PDF)</h3>';

        const grid = document.createElement('div');
        grid.className = 'quiz-grid';

        testeAntrenament.forEach(t => {
            const card = document.createElement('div');
            card.className = 'quiz-card glass';
            card.style.cursor = "pointer";
            card.onclick = () => window.open(t.file, '_blank');

            card.innerHTML = `
                <div class="quiz-icon" style="font-size: 2.5rem;">📄</div>
                <h3 style="font-size: 1.1rem; margin: 10px 0;">${t.titlu}</h3>
                <p style="font-size: 0.9rem; margin-bottom: 15px;">Descarcă / Vizualizează PDF</p>
                <button class="btn-start" style="padding: 8px 20px; font-size: 0.9rem;">Deschide</button>
            `;
            grid.appendChild(card);
        });

        testSection.appendChild(grid);
        quizDashboard.appendChild(testSection);
    }

    // Sidebar toggle fix for mobile
    window.toggleSidebar = function() {
        const s = document.getElementById('sidebar');
        s.classList.toggle('open');
    };

    // Close sidebar on click outside on mobile
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('mobile-toggle');
        if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle) {
            sidebar.classList.remove('open');
        }
    });
    
    // Setăm starea inițială în istoric
    history.replaceState({ pageId: 'home' }, "", "#home");
};
