const lectiiCompleta = []; const bibliotecaCompleta = []; const testeAntrenament = []; const unis = []; const masterBank = [];
let cachedViews = [];
let viewsMap = {};
let isViewCacheInitialized = false;

function initViewCache() {
    if (isViewCacheInitialized) return;
    cachedViews = Array.from(document.querySelectorAll(".view"));
    cachedViews.forEach(v => { if (v.id) viewsMap[v.id] = v; });
    isViewCacheInitialized = true;
}

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
    initElements() {
        if (this.bodyEl) return;
        this.bodyEl = document.getElementById('lesson-body');
        this.counterEl = document.getElementById('slide-counter');
        this.prevBtn = document.querySelector("#lectie-detaliu .reader-toolbar button:first-child");
        this.nextBtn = document.querySelector("#lectie-detaliu .reader-toolbar button:last-child");
    },
    render() {
        this.initElements();
        const slide = this.slides[this.index];
        if(!slide) return;

        this.bodyEl.innerHTML = `
            <div class='ppt-slide'>
                <span class='slide-title'>${slide.t}</span>
                <div class='slide-text'>${slide.c}</div>
            </div>`;

        this.counterEl.innerText = `Slide ${this.index + 1} / ${this.slides.length}`;

        if(this.prevBtn) this.prevBtn.disabled = this.index === 0;
        if(this.nextBtn) this.nextBtn.disabled = this.index === this.slides.length - 1;

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
    initElements() {
        if (this.bodyEl) return;
        this.bodyEl = document.getElementById('library-body');
        this.counterEl = document.getElementById('library-slide-counter');
        this.prevBtn = document.querySelector("#biblioteca-detaliu .reader-toolbar button:first-child");
        this.nextBtn = document.querySelector("#biblioteca-detaliu .reader-toolbar button:last-child");
    },
    render() {
        this.initElements();
        const slide = this.slides[this.index];
        if(!slide) return;

        this.bodyEl.innerHTML = `
            <div class='ppt-slide'>
                <span class='slide-title'>${slide.t}</span>
                <div class='slide-text'>${slide.c}</div>
            </div>`;

        this.counterEl.innerText = `Slide ${this.index + 1} / ${this.slides.length}`;

        if(this.prevBtn) this.prevBtn.disabled = this.index === 0;
        if(this.nextBtn) this.nextBtn.disabled = this.index === this.slides.length - 1;

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
        const fragment = document.createDocumentFragment();
        d.o.forEach((opt, i) => {
            const btn = document.createElement('button'); btn.className = 'opt-btn'; btn.innerText = opt; btn.dataset.index = i;
            fragment.appendChild(btn);
        });
        this.optionsBoxEl.appendChild(fragment);
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

    // Lazy initialization if called before 'load' event
    initViewCache();

    cachedViews.forEach(v => v.classList.remove("active"));
    const target = viewsMap[id] || document.getElementById(id);
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

    const fragment = document.createDocumentFragment();
    slides.forEach((slide, idx) => {
        const item = document.createElement('div');
        item.className = 'toc-item';
        item.dataset.idx = idx;
        item.textContent = `${idx + 1}. ${slide.t}`;
        item.onclick = () => setIndexCallback(idx);
        fragment.appendChild(item);
    });
    container.appendChild(fragment);
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

    const titleEl = document.getElementById('lesson-title');
    if (titleEl) titleEl.innerText = lesson.titlu;

    if (lesson.file) {
        const isPPT = lesson.file.endsWith('.ppt') || lesson.file.endsWith('.pptx');
        let contentHtml = '';

        if (isPPT) {
            let baseUrl = (window.location && window.location.href) ? window.location.href.split('#')[0].split('?')[0] : '';
            baseUrl = baseUrl.replace(/\/index\.html$/, '/');
            if (!baseUrl.endsWith('/')) baseUrl += '/';

            // Handle relative paths that might start with / or no slash
            let cleanFile = lesson.file;
            if (cleanFile.startsWith('/')) cleanFile = cleanFile.substring(1);

            const fullUrl = baseUrl + cleanFile;
            const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;

            contentHtml = `<div class="file-view-container">
                    <iframe src="${embedUrl}" style="width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>
                    <div style="margin-top: 15px; text-align: center;">
                        <p style="margin-bottom: 5px; font-size: 0.9rem; color: var(--text-muted);">Dacă previzualizarea nu încarcă (necesită URL public), folosește butonul:</p>
                        <a href="${lesson.file}" download target="_blank" class="uni-link" style="color: var(--accent); font-weight: bold;">📥 Descarcă Materialul PPT</a>
                    </div>
                </div>`;
        } else {
             contentHtml = `<div class="file-view-container">
                    <iframe src="${lesson.file}" style="width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>
                    <div style="margin-top: 15px; text-align: center;">
                        <a href="${lesson.file}" download target="_blank" class="uni-link" style="color: var(--accent); font-weight: bold;">📥 Descarcă Materialul</a>
                    </div>
                </div>`;
        }

        LessonManager.slides = [{
            t: lesson.titlu,
            c: contentHtml
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

    const titleEl = document.getElementById('library-title');
    if (titleEl) titleEl.innerText = item.titlu;

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
    const modal = document.getElementById('slide-viewer-modal');

    if (wrapper) {
        wrapper.innerHTML = '';
        const fragment = document.createDocumentFragment();
        data.slides.forEach(slide => {
            const swiperSlide = document.createElement('div');
            swiperSlide.className = 'swiper-slide';

            const pptSlide = document.createElement('div');
            pptSlide.className = 'ppt-slide';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'slide-title';
            titleSpan.textContent = slide.t;

            const textDiv = document.createElement('div');
            textDiv.className = 'slide-text';
            textDiv.innerHTML = slide.c;

            pptSlide.appendChild(titleSpan);
            pptSlide.appendChild(textDiv);
            swiperSlide.appendChild(pptSlide);
            fragment.appendChild(swiperSlide);
        });
        wrapper.appendChild(fragment);
    }

    if (modal) modal.classList.remove('hidden');

    if (window.ecoSwiper) window.ecoSwiper.destroy();
    window.ecoSwiper = new Swiper('.mySwiper', {
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        keyboard: true
    });

    loadMathJax().then(() => { if (window.MathJax) MathJax.typesetPromise(); });
}

function closeSlideViewer() {
    const modal = document.getElementById('slide-viewer-modal');
    if (modal) modal.classList.add('hidden');
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
    // Populate views cache
    initViewCache();

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
    chaptersList.innerHTML = lectiiCompleta.map((l, idx) => `
        <div class='chapter-card glass' onclick='openLesson(${idx})'>
            <h3>CAPITOLUL ${idx + 1}</h3>
            <p>${l.titlu}</p>
            <small style='color: var(--accent)'>Click pentru lecție →</small>
        </div>`).join('');

    // Populare universități
    const uniGrid = document.getElementById('uni-grid');
    if (uniGrid) {
        uniGrid.innerHTML = unis.map(u => `
            <div class='nav-card glass' data-id='${u.id}' tabIndex='0' role='button' aria-label='Vezi detalii despre ${u.n}'>
                <h3>${u.n}</h3>
                <p>Medie: <b>${u.m}</b></p>
            </div>`).join('');

        // Event delegation for Universities Grid
        uniGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.nav-card');
            if (card && card.dataset.id) {
                openUni(parseInt(card.dataset.id));
            }
        });
        uniGrid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.nav-card');
                if (card && card.dataset.id) {
                    e.preventDefault();
                    openUni(parseInt(card.dataset.id));
                }
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); closeSlideViewer(); }
    });

    // Populare listă bibliotecă
    const libraryList = document.getElementById('library-list');
    if (libraryList) {
        libraryList.innerHTML = bibliotecaCompleta.map((l, idx) => `
            <div class='chapter-card glass' onclick='openLibraryItem(${idx})'>
                <h3>RESURSA ${idx + 1}</h3>
                <p>${l.titlu}</p>
                <small style='color: var(--accent)'>Click pentru detalii →</small>
            </div>`).join('');
    }

    // Populare teste antrenament
    const quizDashboard = document.querySelector('.quiz-dashboard');
    if (quizDashboard && typeof testeAntrenament !== 'undefined') {
        const testSection = document.createElement('div');
        testSection.style.marginTop = "60px";
        testSection.innerHTML = '<h3 style="margin-bottom: 30px; font-size: 1.8rem; color: var(--accent);">Teste de Antrenament (PDF)</h3>';

        const grid = document.createElement('div');
        grid.className = 'quiz-grid';

        grid.innerHTML = testeAntrenament.map(t => `
            <div class='quiz-card glass' style='cursor: pointer;' onclick='window.open("${t.file}", "_blank")'>
                <div class='quiz-icon' style='font-size: 2.5rem;'>📄</div>
                <h3 style='font-size: 1.1rem; margin: 10px 0;'>${t.titlu}</h3>
                <p style='font-size: 0.9rem; margin-bottom: 15px;'>Descarcă / Vizualizează PDF</p>
                <button class='btn-start' style='padding: 8px 20px; font-size: 0.9rem;'>Deschide</button>
            </div>`).join('');

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
