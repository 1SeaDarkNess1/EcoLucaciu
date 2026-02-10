let mathJaxPromise = null;
function loadMathJax() {
    if (mathJaxPromise) return mathJaxPromise;
    if (window.MathJax) return Promise.resolve();

    mathJaxPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'MathJax-script';
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            mathJaxPromise = null;
            reject(new Error('Failed to load MathJax'));
        };
        document.head.appendChild(script);
    });
    return mathJaxPromise;
}

// --- NAVIGARE CU BROWSER BACK FIX ---
function showPage(id, saveHistory = true) {
    if (!id) return;

    // Evităm adăugarea aceleiași pagini în istoric dacă suntem deja pe ea
    if (saveHistory && history.state && history.state.pageId === id) {
        return;
    }

    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById(id);
    if(target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        if(saveHistory) {
            history.pushState({ pageId: id }, "", "#" + id);
        }
    }
}
window.addEventListener("popstate", (event) => {

    // Închidem orice modal deschis la navigarea înapoi
    if (typeof closeModal === "function") closeModal();
    if (typeof closeSlideViewer === "function") closeSlideViewer();

    if (event.state && event.state.pageId) {
        showPage(event.state.pageId, false);
    } else {
        showPage("home", false);
    }
});
// --- DATA: LECTII COMPLETE (EXTRASE DIN PPT-URILE TALE) ---
// --- DATA: ASYNC LOADING ---
const lectiiCompleta = [];
const bibliotecaCompleta = [];
const testeAntrenament = [];
const unis = [];
const masterBank = [];

async function initData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data.json');
        const data = await response.json();
        if (data.lectiiCompleta) lectiiCompleta.push(...data.lectiiCompleta);
        if (data.bibliotecaCompleta) bibliotecaCompleta.push(...data.bibliotecaCompleta);
        if (data.testeAntrenament) testeAntrenament.push(...data.testeAntrenament);
        if (data.unis) unis.push(...data.unis);
        if (data.masterBank) masterBank.push(...data.masterBank);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

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

// --- LOGICA MODERN SLIDE VIEWER (SWIPER) ---
let swiperInstance = null;

function openSlideViewer(type, index) {
    let slides = [];
    let title = '';

    if (type === 'lesson') {
        const lectie = lectiiCompleta[index];
        slides = lectie.slides || [];
        title = lectie.titlu;
    } else if (type === 'library') {
        const item = bibliotecaCompleta[index];
        slides = item.slides || [];
        title = item.titlu;
    }

    if (slides.length === 0) {
        slides = [{ t: title, c: '<p>Acest material este disponibil momentan doar pentru descărcare.</p>' }];
    }

    const wrapper = document.getElementById('swiper-wrapper');
    wrapper.innerHTML = '';

    slides.forEach(slide => {
        const swiperSlide = document.createElement('div');
        swiperSlide.className = 'swiper-slide';

        let contentHtml = '<div class="slide-content-wrapper">';
        contentHtml += '<h2 class="slide-title-modern">' + slide.t + '</h2>';
        contentHtml += '<div class="slide-text-modern">' + slide.c + '</div>';

        if (slide.img) {
            contentHtml += '<img src="' + slide.img + '" alt="' + slide.t + '" class="slide-image-modern">';
        }

        contentHtml += '</div>';
        swiperSlide.innerHTML = contentHtml;
        wrapper.appendChild(swiperSlide);
    });

    document.getElementById('slide-viewer-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (swiperInstance) swiperInstance.destroy();

    swiperInstance = new Swiper('.mySwiper', {
        speed: 800,
        loop: false,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        mousewheel: true,
    });
}

function closeSlideViewer() {
    document.getElementById('slide-viewer-modal').classList.add('hidden');
    document.body.style.overflow = '';
    if (swiperInstance) swiperInstance.destroy();
}

function toggleFullScreen() {
    const elem = document.getElementById('slide-viewer-modal');
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            console.error('Full screen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function openLesson(index) {
    loadMathJax();
    const lectie = lectiiCompleta[index];
    if(!lectie) return;

    // Folosim viewer-ul de slide-uri doar dacă avem slide-uri predefinite (cum e la Lecția 1)
    if (lectie.slides) {
        openSlideViewer('lesson', index);
        return;
    }
    
    document.getElementById('lesson-title').innerText = lectie.titlu;

    if (lectie.file) {
        // Dacă e PPT, încercăm să-l "simulăm" cu un viewer embedded
        const fileContent = (lectie.type === 'ppt')
            ? `
                <div class="file-view-container" style="text-align: center; padding: 20px;">
                    <div class="file-icon" style="font-size: 3rem; margin-bottom: 15px;">📊</div>
                    <h3 style="margin-bottom: 10px;">Simulare Prezentare PowerPoint</h3>
                    <p style="margin-bottom: 20px;">Vizualizați materialul mai jos sau descărcați-l pentru acces complet.</p>

                    <div style="width: 100%; height: 600px; margin-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border);">
                        <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/' + lectie.file)}&embedded=true" width="100%" height="100%" frameborder="0"></iframe>
                    </div>

                    <a href="${lectie.file}" download target="_blank" class="btn-start" style="display: inline-block; text-decoration: none;">
                        📥 Descarcă Materialul (.ppt)
                    </a>
                </div>
            `
            : `
                <div class="file-view-container" style="text-align: center; padding: 40px;">
                    <div class="file-icon" style="font-size: 5rem; margin-bottom: 20px;">📄</div>
                    <h3 style="margin-bottom: 15px;">Document Capitol</h3>
                    <p>Acest capitol este disponibil sub formă de fișier descărcabil.</p>
                    <a href="${lectie.file}" download target="_blank" class="btn-start" style="display: inline-block; text-decoration: none; margin-top: 20px;">
                        📥 Descarcă Materialul
                    </a>
                </div>
            `;

        currentLessonSlides = [{
            t: lectie.titlu,
            c: fileContent
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

    loadMathJax().then(() => { if (window.MathJax) MathJax.typesetPromise(); });
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
    loadMathJax();
    const item = bibliotecaCompleta[index];
    if(!item) return;

    if (item.slides) {
        openSlideViewer('library', index);
        return;
    }

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

    loadMathJax().then(() => { if (window.MathJax) MathJax.typesetPromise(); });
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
    const timerEl = document.getElementById("timer");
    timer = setInterval(() => {
        secs++;
        const min = Math.floor(secs / 60);
        const sec = secs % 60;
        timerEl.innerText = `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
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
        const btn = document.createElement('button'); btn.className = 'opt-btn'; btn.innerText = opt; btn.dataset.index = i;
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
window.addEventListener('load', async () => {
    await initData();
    // Event delegation for Quiz Options
    const quizOptionsBox = document.getElementById('options-box');
    if (quizOptionsBox) {
        quizOptionsBox.addEventListener('click', (e) => {
            const btn = e.target.classList.contains('opt-btn') ? e.target : e.target.closest('.opt-btn');
            if (btn) {
                const i = parseInt(btn.dataset.index);
                const d = currentQuestions[currentIdx];
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
            }
        });
    }
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
        if (e.key === 'Escape') { closeModal(); closeSlideViewer(); }
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
    // Gestionare navigare inițială bazată pe hash
    const initialHash = window.location.hash.substring(1);
    const validSections = ['home', 'materiale', 'admitere', 'biblioteca', 'grila'];

    if (initialHash && validSections.includes(initialHash)) {
        showPage(initialHash, false);
        history.replaceState({ pageId: initialHash }, "", "#" + initialHash);
    } else {
        // Dacă nu avem hash valid, mergem pe home
        history.replaceState({ pageId: 'home' }, "", "#home");
    }
});
