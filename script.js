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

// --- MANAGERS ---

const LessonManager = {
    index: 0,
    slides: [],
    render() {
        const body = document.getElementById('lesson-body');
        const slide = this.slides[this.index];
        if(!slide) return;

        body.innerHTML = `
            <div class='ppt-slide'>
                <span class='slide-title'>${slide.t}</span>
                <div class='slide-text'>${slide.c}</div>
            </div>`;

        document.getElementById('slide-counter').innerText = `Slide ${this.index + 1} / ${this.slides.length}`;

        // Update toolbar buttons
        const prevBtn = document.querySelector("#lectie-detaliu .reader-toolbar button:first-child");
        const nextBtn = document.querySelector("#lectie-detaliu .reader-toolbar button:last-child");

        if(prevBtn) prevBtn.disabled = this.index === 0;
        if(nextBtn) nextBtn.disabled = this.index === this.slides.length - 1;

        updateActiveTOC('lesson-toc', this.index);

        loadMathJax().then(() => { if (window.MathJax) MathJax.typesetPromise(); });
    },
    next() {
        if (this.index < this.slides.length - 1) {
            this.index++;
            this.render();
        }
    },
    prev() {
        if (this.index > 0) {
            this.index--;
            this.render();
        }
    }
};

const LibraryManager = {
    index: 0,
    slides: [],
    render() {
        const body = document.getElementById('library-body');
        const slide = this.slides[this.index];
        if(!slide) return;

        body.innerHTML = `
            <div class='ppt-slide'>
                <span class='slide-title'>${slide.t}</span>
                <div class='slide-text'>${slide.c}</div>
            </div>`;

        document.getElementById('library-slide-counter').innerText = `Slide ${this.index + 1} / ${this.slides.length}`;

        // Update toolbar buttons
        const prevBtn = document.querySelector("#biblioteca-detaliu .reader-toolbar button:first-child");
        const nextBtn = document.querySelector("#biblioteca-detaliu .reader-toolbar button:last-child");

        if(prevBtn) prevBtn.disabled = this.index === 0;
        if(nextBtn) nextBtn.disabled = this.index === this.slides.length - 1;

        updateActiveTOC('library-toc', this.index);

        loadMathJax().then(() => { if (window.MathJax) MathJax.typesetPromise(); });
    },
    next() {
        if (this.index < this.slides.length - 1) {
            this.index++;
            this.render();
        }
    },
    prev() {
        if (this.index > 0) {
            this.index--;
            this.render();
        }
    }
};

const QuizManager = {
    questions: [],
    index: 0,
    score: 0,
    timer: null,
    secs: 0,
    correct: 0,
    wrong: 0,
    type: "",

    initElements() {
        if (this.timerEl) return;
        this.timerEl = document.getElementById('timer');
        this.correctEl = document.getElementById('correct-count');
        this.wrongEl = document.getElementById('wrong-count');
        this.qTextEl = document.getElementById('q-text');
        this.qCounterEl = document.getElementById('q-counter');
        this.progressEl = document.getElementById('progress-bar');
        this.optionsBoxEl = document.getElementById('options-box');
        this.feedbackEl = document.getElementById('quiz-feedback-overlay');
    },

    start(type = "general") {
        this.initElements();
        this.type = type;
        let bank = [...masterBank];
        if(type === 'micro') bank = bank.filter((_, i) => i % 2 === 0);
        if(type === 'macro') bank = bank.filter((_, i) => i % 2 !== 0);
        if (bank.length < 5) bank = [...masterBank];

        this.questions = bank.sort(() => 0.5 - Math.random()).slice(0, 20);

        // Resetare stare
        this.index = 0; this.score = 0; this.secs = 0; this.correct = 0; this.wrong = 0;
        this.correctEl.innerText = 0;
        this.wrongEl.innerText = 0;
        this.timerEl.innerText = "00:00";

        showPage('quiz');

        // Timer
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.secs++;
            const min = Math.floor(this.secs / 60);
            const sec = this.secs % 60;
            this.timerEl.innerText = `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
        }, 1000);

        this.render();
    },

    render() {
        this.initElements();
        const d = this.questions[this.index];
        this.qTextEl.innerText = d.q;
        this.qCounterEl.innerText = `${this.index + 1} / ${this.questions.length}`;
        this.progressEl.style.width = `${((this.index + 1) / this.questions.length) * 100}%`;
        this.optionsBoxEl.innerHTML = '';
        d.o.forEach((opt, i) => {
            const btn = document.createElement('button'); btn.className = 'opt-btn'; btn.innerText = opt; btn.dataset.index = i;
            this.optionsBoxEl.appendChild(btn);
        });
    },

    handleAnswer(i) {
        this.initElements();
        const d = this.questions[this.index];
        const overlay = this.feedbackEl;
        overlay.classList.remove('hidden');

        if (i === d.c) {
            this.score += 5; this.correct++;
            overlay.innerText = "CORECT!"; overlay.className = "feedback-overlay correct-overlay";
            this.correctEl.innerText = this.correct;
        } else {
            this.wrong++;
            overlay.innerText = "GREȘIT!"; overlay.className = "feedback-overlay wrong-overlay";
            this.wrongEl.innerText = this.wrong;
        }
        setTimeout(() => {
            overlay.classList.add('hidden');
            this.index++;
            if (this.index < this.questions.length) this.render(); else this.finish();
        }, 700);
    },

    finish() {
        this.initElements();
        clearInterval(this.timer);
        showPage('results');
        document.getElementById('final-score').innerText = this.score;
        document.getElementById('final-time').innerText = this.timerEl.innerText;
        document.getElementById('final-grade').innerText = (this.score / 10).toFixed(1);
        document.getElementById('performance-msg').innerText = this.score >= 85 ? "Excelent! Pregătit de succes." : "Continuă studiul pentru rezultate mai bune.";
    }
};

const ModalManager = {
    lastFocusedElement: null,
    openUni(id) {
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

        this.lastFocusedElement = document.activeElement;
        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) closeBtn.focus();
    },
    closeModal() {
        document.getElementById('uni-modal').classList.add('hidden');
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }
};

// --- ALIASES FOR GLOBAL ACCESS ---
window.showPage = showPage;
window.startQuiz = (type) => QuizManager.start(type);
window.nextSlide = () => LessonManager.next();
window.prevSlide = () => LessonManager.prev();
window.nextLibrarySlide = () => LibraryManager.next();
window.prevLibrarySlide = () => LibraryManager.prev();
window.closeModal = () => ModalManager.closeModal();
window.openUni = (id) => ModalManager.openUni(id);
window.toggleTOC = toggleTOC;
window.openLesson = openLesson;
window.openLibraryItem = openLibraryItem;
window.toggleFullScreen = toggleFullScreen;
window.closeSlideViewer = closeSlideViewer;

// --- NAVIGARE CU BROWSER BACK FIX ---
function showPage(id, saveHistory = true) {
    if (!id) return;

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
    if (typeof closeModal === "function") closeModal();
    if (typeof closeSlideViewer === "function") closeSlideViewer();

    if (event.state && event.state.pageId) {
        showPage(event.state.pageId, false);
    } else {
        showPage("home", false);
    }
});

// --- DATA ---
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

// --- LECTII LOGIC ---
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
    items.forEach(it => it.classList.remove('active'));
    const current = Array.from(items).find(it => parseInt(it.dataset.idx) === idx);
    if(current) current.classList.add('active');
}

function openLesson(index) {
    const lesson = lectiiCompleta[index];
    if(!lesson) return;

    if (lesson.slides && lesson.slides.length > 0) {
        openSlideViewer('lesson', index);
        return;
    }

    document.getElementById('lesson-title').innerText = lesson.titlu;

    if (lesson.file) {
        LessonManager.slides = [{
            t: lesson.titlu,
            c: `<div class="file-view-container">
                    <iframe src="${lesson.file}" style="width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>
                    <div style="margin-top: 15px; text-align: center;">
                        <a href="${lesson.file}" download target="_blank" class="uni-link" style="color: var(--accent); font-weight: bold;">📥 Descarcă Materialul</a>
                    </div>
                </div>`
        }];
    } else {
        LessonManager.slides = lesson.slides || [];
    }

    LessonManager.index = 0;

    showPage('lectie-detaliu');
    generateTOC('lesson-toc', LessonManager.slides, (idx) => {
        LessonManager.index = idx;
        LessonManager.render();
    });
    LessonManager.render();
}

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
            LibraryManager.slides = [{
                t: item.titlu,
                c: `<iframe src="${item.file}" style="width: 100%; height: 700px; border: none; border-radius: 8px;"></iframe>
                <p style="text-align: center; margin-top: 10px;"><a href="${item.file}" download target="_blank" class="uni-link" style="color: var(--accent); font-weight: bold;">Sau descarcă PDF</a></p>`
            }];
        } else {
             LibraryManager.slides = [{
                t: item.titlu,
                c: `<div style="text-align: center; padding: 40px;">
                        <p>Acest fișier poate fi descărcat:</p>
                        <a href="${item.file}" download class="btn-start" style="text-decoration: none; display: inline-block; margin-top: 10px;">📥 Descarcă ${item.titlu}</a>
                    </div>`
            }];
        }
    } else {
        LibraryManager.slides = item.slides || [];
    }

    LibraryManager.index = 0;

    showPage('biblioteca-detaliu');
    generateTOC('library-toc', LibraryManager.slides, (idx) => {
        LibraryManager.index = idx;
        LibraryManager.render();
    });
    LibraryManager.render();
}

function openSlideViewer(type, index) {
    const data = type === 'lesson' ? lectiiCompleta[index] : bibliotecaCompleta[index];
    if (!data || !data.slides) return;

    const wrapper = document.getElementById('swiper-wrapper');
    wrapper.innerHTML = '';

    data.slides.forEach(slide => {
        const div = document.createElement('div');
        div.className = 'swiper-slide';
        div.innerHTML = `<div class='ppt-slide'>
            <span class='slide-title'>${slide.t}</span>
            <div class='slide-text'>${slide.c}</div>
        </div>`;
        wrapper.appendChild(div);
    });

    document.getElementById('slide-viewer-modal').classList.remove('hidden');

    if (window.ecoSwiper) window.ecoSwiper.destroy();
    window.ecoSwiper = new Swiper('.mySwiper', {
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        keyboard: true
    });

    loadMathJax().then(() => { if (window.MathJax) MathJax.typesetPromise(); });
}

function closeSlideViewer() {
    document.getElementById('slide-viewer-modal').classList.add('hidden');
    if (window.ecoSwiper) window.ecoSwiper.destroy();
}

function toggleFullScreen() {
    const elem = document.querySelector('.slide-viewer-modal');
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
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
                QuizManager.handleAnswer(parseInt(btn.dataset.index));
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
    
    const initialHash = window.location.hash.substring(1);
    const validSections = ['home', 'materiale', 'admitere', 'biblioteca', 'grila'];

    if (initialHash && validSections.includes(initialHash)) {
        showPage(initialHash, false);
        history.replaceState({ pageId: initialHash }, "", "#" + initialHash);
    } else {
        history.replaceState({ pageId: 'home' }, "", "#home");
    }
});
