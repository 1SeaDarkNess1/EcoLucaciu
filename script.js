// Global State
let lectiiCompleta = [];
let bibliotecaCompleta = [];
let testeAntrenament = [];
let unis = [];
let masterBank = [];

// Quiz State
const QuizManager = {
    active: false,
    score: 0,
    index: 0,
    questions: [],
    timer: null,
    secs: 0,
    userAnswers: [], // Store user choices for review
    type: 'general',

    start: function(type) {
        this.type = type;
        this.active = true;
        this.score = 0;
        this.index = 0;
        this.secs = 0;
        this.userAnswers = [];

        // Filter and Shuffle Questions
        // For now, using all questions or filtering by type if data supports it
        // Simulating different types by just shuffling for now as masterBank is simple
        this.questions = [...masterBank].sort(() => Math.random() - 0.5).slice(0, 20);

        if (this.questions.length === 0) {
            alert("Nu sunt întrebări disponibile pentru acest tip.");
            showPage('grila');
            return;
        }

        document.getElementById('correct-count').textContent = '0';
        document.getElementById('wrong-count').textContent = '0';

        showPage('quiz');
        this.startTimer();
        this.renderQ();
    },

    startTimer: function() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.secs++;
            const mins = Math.floor(this.secs / 60).toString().padStart(2, '0');
            const secs = (this.secs % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${mins}:${secs}`;
        }, 1000);
    },

    renderQ: function() {
        if (this.index >= this.questions.length) {
            this.finish();
            return;
        }

        const q = this.questions[this.index];
        document.getElementById('q-counter').textContent = `${this.index + 1} / ${this.questions.length}`;
        document.getElementById('progress-bar').style.width = `${((this.index) / this.questions.length) * 100}%`;
        document.getElementById('q-text').textContent = q.q;

        const opts = document.getElementById('options-box');
        opts.innerHTML = '';

        q.o.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => this.check(i);
            opts.appendChild(btn);
        });
    },

    check: function(choiceIndex) {
        const q = this.questions[this.index];
        this.userAnswers.push({ qIndex: this.index, choice: choiceIndex, correct: q.c });

        // Feedback
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.c) btn.classList.add('correct');
            if (i === choiceIndex && i !== q.c) btn.classList.add('wrong');
        });

        if (choiceIndex === q.c) {
            this.score++;
            document.getElementById('correct-count').textContent = this.score;
            // Immediate feedback overlay? Optional, keep it fast.
        } else {
            document.getElementById('wrong-count').textContent = (this.index + 1 - this.score);
        }

        setTimeout(() => {
            this.index++;
            this.renderQ();
        }, 1000);
    },

    finish: function() {
        clearInterval(this.timer);
        this.active = false;
        showPage('results');

        const percentage = (this.score / this.questions.length) * 100;
        const grade = (1 + (this.score / this.questions.length) * 9).toFixed(2);

        document.getElementById('final-score-text').textContent = `${this.score} / ${this.questions.length}`;
        document.getElementById('final-grade-big').textContent = grade;

        // Circular Progress Animation
        const circle = document.getElementById('result-circle');
        let angle = 0;
        const targetAngle = (percentage / 100) * 360;
        const anim = setInterval(() => {
            angle += 5;
            if (angle >= targetAngle) {
                angle = targetAngle;
                clearInterval(anim);
            }
            circle.style.background = `conic-gradient(var(--primary) ${angle}deg, #ededed 0deg)`;
        }, 10);

        // Performance Message
        const msg = document.getElementById('performance-msg');
        if (grade >= 9) msg.textContent = "Excelent! Ești pregătit.";
        else if (grade >= 7) msg.textContent = "Bine! Mai repetă materia.";
        else if (grade >= 5) msg.textContent = "Satisfăcător. Ai nevoie de studiu.";
        else msg.textContent = "Insuficient. Reia capitolele.";

        // Format Time
        const mins = Math.floor(this.secs / 60).toString().padStart(2, '0');
        const secs = (this.secs % 60).toString().padStart(2, '0');
        document.getElementById('final-time').textContent = `${mins}:${secs}`;
    },

    review: function() {
        // Implementation for review mode (showing questions list with answers)
        // This could be a modal or a list in the results page.
        // For simplicity, let's create a dynamic list below the results.
        
        // However, the requested "Review Mode" usually implies re-rendering the quiz interface in read-only.
        // Let's implement a simple list view for review in a modal or appended to results.

        // Actually, user asked for "Review Mode" (Show Red/Green answers after the quiz ends).
        // Let's replace the results content or append.

        let reviewHtml = '<div class="review-list" style="margin-top: 2rem; text-align: left;"><h3>Revizuire Răspunsuri</h3>';
        this.userAnswers.forEach((ans, idx) => {
            const q = this.questions[ans.qIndex];
            const isCorrect = ans.choice === ans.correct;
            reviewHtml += `
                <div class="glass" style="padding: 1rem; margin-bottom: 1rem; border-left: 5px solid ${isCorrect ? '#4CAF50' : '#F44336'}">
                    <p><strong>${idx + 1}. ${q.q}</strong></p>
                    <p style="color: ${isCorrect ? 'green' : 'red'}">Răspunsul tău: ${q.o[ans.choice]}</p>
                    ${!isCorrect ? `<p style="color: green">Răspuns corect: ${q.o[ans.correct]}</p>` : ''}
                </div>
            `;
        });
        reviewHtml += '</div>';

        // Append to results container if not already there
        const container = document.querySelector('.results-main-card');
        const existingReview = container.querySelector('.review-list');
        if (existingReview) existingReview.remove();

        const reviewContainer = document.createElement('div');
        reviewContainer.innerHTML = reviewHtml;
        container.appendChild(reviewContainer);

        // Scroll to review
        reviewContainer.scrollIntoView({ behavior: 'smooth' });
    }
};

// Expose startQuiz globally
window.startQuiz = (type) => QuizManager.start(type);

// Initialize Data
async function initData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        lectiiCompleta = data.lectiiCompleta || [];
        bibliotecaCompleta = data.bibliotecaCompleta || [];
        unis = data.unis || [];
        masterBank = data.masterBank || [];

        renderHome();
    } catch (error) {
        console.error("Failed to load data", error);
        // Fallback or alert
    }
}

// Render Functions
function renderHome() {
    // Materials List
    const matList = document.getElementById('chapters-list');
    if (matList) {
        matList.innerHTML = lectiiCompleta.map((l, i) => `
            <div class='chapter-card glass' onclick='openLesson(${i})'>
                <div class='chapter-icon'>📘</div>
                <div class='chapter-info'>
                    <h4>${l.titlu}</h4>
                    <span>${l.type === 'ppt' ? 'Prezentare' : 'Lecție'}</span>
                </div>
            </div>
        `).join('');
    }

    // Library List
    const libList = document.getElementById('library-list');
    if (libList) {
        libList.innerHTML = bibliotecaCompleta.map((l, i) => `
            <div class='chapter-card glass' onclick='openLibraryItem(${i})'>
                <div class='chapter-icon'>📚</div>
                <div class='chapter-info'>
                    <h4>${l.titlu}</h4>
                    <span>${l.type.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    }

    // Unis Grid
    const uniGrid = document.getElementById('uni-grid');
    if (uniGrid) {
        uniGrid.innerHTML = unis.map(u => `
            <div class='uni-card glass' onclick='openUni(${u.id})'>
                <div class='uni-header'>
                    <span class='uni-grade'>Medie: ${u.m}</span>
                    <h3>${u.n}</h3>
                </div>
                <div class='uni-footer'>Vezi detalii &rarr;</div>
            </div>
        `).join('');
    }
}

// Navigation
window.showPage = function(id) {
    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }

    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Show target view
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Update active state in menu
    document.querySelectorAll('.menu-vertical a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`.menu-vertical a[href="#${id}"]`);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo(0, 0);
};

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
};

// Viewers
window.openLesson = function(index) {
    const l = lectiiCompleta[index];
    if (!l) return;

    document.getElementById('lesson-title').textContent = l.titlu;
    const body = document.getElementById('lesson-body');

    if (l.type === 'ppt' && l.file) {
        // Use Google Docs Viewer for PPT
        const url = `https://view.officeapps.live.com/op/embed.aspx?src=${window.location.origin}/${l.file}`;
        body.innerHTML = `<iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>`;
    } else {
        body.innerHTML = "<p>Conținut indisponibil momentan.</p>";
    }

    showPage('lectie-detaliu');
};

window.openLibraryItem = function(index) {
    const l = bibliotecaCompleta[index];
    if (!l) return;

    document.getElementById('library-title').textContent = l.titlu;
    const body = document.getElementById('library-body');

    // Simple PDF embedding
    body.innerHTML = `<iframe src="${l.file}" width="100%" height="100%" frameborder="0"></iframe>`;

    showPage('biblioteca-detaliu');
};

// University Modal
window.openUni = function(id) {
    const u = unis.find(x => x.id === id);
    if (!u) return;

    const modal = document.getElementById('uni-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <h2 class="section-title" style="font-size: 1.8rem; margin-bottom: 1rem;">${u.n}</h2>
        <div class="uni-grade" style="margin-bottom: 1.5rem;">Ultima Medie: ${u.m}</div>
        <div class="uni-details" style="line-height: 1.8; color: var(--text-main);">
            ${u.d}
        </div>
        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn-premium" onclick="closeModal()">Închide</button>
        </div>
    `;

    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
    const modal = document.getElementById('uni-modal');
    modal.classList.remove('visible');
    document.body.style.overflow = '';
};

// Add "View Answers" button logic
document.addEventListener('DOMContentLoaded', () => {
    initData();

    // Add listener for view answers button if it doesn't exist in HTML but we want to inject behavior
    // The HTML has a "Repetă Testul" and "Înapoi". I should add "Vezi Răspunsuri" dynamically or in HTML.
    // I'll add it in the finish() method or assume it's part of the UI update.

    // Let's add the "Vezi Răspunsuri" button to the results-actions div in finish() logic or ensure it's there.
    // For now, I'll modify finish() to append it if missing.
});

// Patch finish to add Review Button
const originalFinish = QuizManager.finish;
QuizManager.finish = function() {
    originalFinish.call(this);

    const actions = document.querySelector('.results-actions');
    // Remove old review button if any
    const oldBtn = document.getElementById('btn-review-answers');
    if (oldBtn) oldBtn.remove();
    
    const reviewBtn = document.createElement('button');
    reviewBtn.id = 'btn-review-answers';
    reviewBtn.className = 'btn-premium btn-outline';
    reviewBtn.textContent = '👁 Vezi Răspunsuri';
    reviewBtn.onclick = () => this.review();

    actions.insertBefore(reviewBtn, actions.firstChild);
};

// Slide Viewer (if needed for gallery, keeping basic structure)
window.closeSlideViewer = function() {
    document.getElementById('slide-viewer-modal').classList.add('hidden');
};
