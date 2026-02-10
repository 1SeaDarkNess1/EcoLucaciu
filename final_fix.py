import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Update questionsAdmitere
# The previous update might have worked for this part?
# Let's just do it again to be sure.
new_questions = """const questionsAdmitere = [
    { q: "Costul de oportunitate al unei alegeri economice este egal cu:", o: ["Valoarea celei mai bune alternative sacrificate", "Suma tuturor alternativelor posibile", "Costul contabil al acțiunii", "Zero, dacă alegerea este rațională"], c: 0, e: "Este valoarea celei mai bune alternative la care se renunță." },
    { q: "O creștere a prețului unui bun, ceteris paribus, determină:", o: ["Scăderea cererii", "Scăderea cantității cerute", "Creșterea ofertei", "Deplasarea curbei cererii la dreapta"], c: 1, e: "Modificarea prețului determină mișcarea de-a lungul curbei cererii (modificarea cantității cerute), nu deplasarea curbei." },
    { q: "Dacă coeficientul de elasticitate a cererii la preț este 0.5, cererea este:", o: ["Elastică", "Inelastică", "Perfect elastică", "Unitară"], c: 1, e: "Kec < 1 indică o cerere inelastică." },
    { q: "Produsul Intern Brut (PIB) real diferă de PIB nominal prin:", o: ["Ajustarea cu rata inflației", "Includerea exporturilor", "Excluderea serviciilor", "Moneda de calcul"], c: 0, e: "PIB real elimină efectul inflației (este calculat în prețuri constante)." },
    { q: "În concurența perfectă, prețul pieței este:", o: ["Stabilit de cea mai mare firmă", "Un dat exogen pentru firmă (price taker)", "Negociat direct cu guvernul", "Mai mare decât costul marginal"], c: 1, e: "Firmele sunt 'primitoare de preț' (price takers) datorită atomicității." },
    { q: "Utilitatea marginală reprezintă:", o: ["Utilitatea totală împărțită la cantitate", "Satisfacția adusă de ultima unitate consumată", "Prețul bunului", "Costul de producție"], c: 1, e: "Sporul de utilitate totală generat de consumul unei unități suplimentare." },
    { q: "Salariul minim garantat în plată este o măsură de:", o: ["Politică monetară", "Protecție socială și reglare a pieței muncii", "Reducere a inflației", "Creștere a productivității"], c: 1, e: "Este stabilit de guvern pentru a asigura un nivel minim de trai." },
    { q: "Banii scripturali sunt:", o: ["Monede metalice", "Bancnote", "Disponibilități în conturi bancare", "Aur"], c: 2, e: "Banii de cont, utilizați prin instrumente precum carduri sau ordine de plată." },
    { q: "Dacă rata dobânzii crește, înclinația spre investiții a firmelor:", o: ["Crește", "Scade", "Rămâne constantă", "Nu este influențată"], c: 1, e: "Creditul devine mai scump, ceea ce descurajează investițiile." },
    { q: "Amortizarea capitalului fix se reflectă în:", o: ["Profitul net", "Costul de producție", "Impozite", "Dividende"], c: 1, e: "Este recuperarea treptată a valorii capitalului fix prin includerea în cost." }
];"""
content = re.sub(r'const questionsAdmitere = \[.*?\];', new_questions, content, flags=re.DOTALL)

# 2. Fix QuizManager.finish (and remove garbage)
# We look for `finish() {` and delete everything until `const ModalManager`.
# Then insert the correct function and closing brace for QuizManager.

new_finish = """finish() {
        this.initElements();
        clearInterval(this.timer);
        showPage('results');

        const finalScore = this.score;
        const totalQuestions = this.questions.length;
        const maxScore = totalQuestions * 5;

        let grade = 1;
        if (maxScore > 0) {
            grade = 1 + (finalScore / maxScore) * 9;
        }
        if (grade > 10) grade = 10;
        const gradeFixed = grade.toFixed(2);

        const scoreTextEl = document.getElementById('final-score-text');
        if(scoreTextEl) scoreTextEl.innerText = `${finalScore} / ${maxScore}`;

        const timeEl = document.getElementById('final-time');
        if(timeEl) timeEl.innerText = this.timerEl.innerText;

        const gradeBigEl = document.getElementById('final-grade-big');
        if(gradeBigEl) gradeBigEl.innerText = gradeFixed;

        const msgEl = document.getElementById('performance-msg');
        if(msgEl) {
            msgEl.style.fontWeight = "bold";
            if (grade >= 9) {
                msgEl.innerText = "Excelent! Ești pregătit pentru succes.";
                msgEl.style.color = "var(--success)";
            } else if (grade >= 7) {
                msgEl.innerText = "Bun! Ești pe drumul cel bun.";
                msgEl.style.color = "var(--success)";
            } else if (grade >= 5) {
                 msgEl.innerText = "Satisfăcător. Mai ai nevoie de puțin studiu.";
                 msgEl.style.color = "#d97706";
            } else {
                msgEl.innerText = "Insuficient. Recomandăm reluarea materiei.";
                msgEl.style.color = "var(--danger)";
            }
        }

        const circle = document.getElementById('result-circle');
        if(circle) {
            // Reset animation
            circle.style.transition = 'none';
            circle.style.background = `conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.2) 0deg)`;

            setTimeout(() => {
                const deg = (grade / 10) * 360;
                circle.style.transition = 'background 1.5s ease-out';
                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
            }, 100);
        }
    }
};"""

# Regex to match from finish() start to ModalManager start
# We use [\s\S]*? for non-greedy match across lines
regex_finish = r'finish\(\) \{[\s\S]*?const ModalManager'
replacement = new_finish + '\n\nconst ModalManager'

content = re.sub(regex_finish, replacement, content)

# 3. Fix Duplicated Mobile Nav in window.load
# I will replace the ENTIRE window.addEventListener('load', ...) block with the correct one.
# This ensures no duplication and correct placement.

new_load_listener = """window.addEventListener('load', async () => {
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

    // Mobile Nav Fix (Link Click)
    const sidebarLinks = document.querySelectorAll('.menu-vertical a');
    const sidebar = document.getElementById('sidebar');
    if (sidebarLinks && sidebar) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    const initialHash = window.location.hash.substring(1);
    const validSections = ['home', 'materiale', 'admitere', 'biblioteca', 'grila'];

    if (initialHash && validSections.includes(initialHash)) {
        showPage(initialHash, false);
        history.replaceState({ pageId: initialHash }, "", "#" + initialHash);
    } else {
        history.replaceState({ pageId: 'home' }, "", "#home");
    }
});"""

# Use regex to find the whole window.addEventListener('load', ...) block
# Start: window.addEventListener('load', async () => {
# End: }); (at the end of the file)
content = re.sub(r"window\.addEventListener\('load', async \(\) => \{[\s\S]*\}\);", new_load_listener, content)

with open('script.js', 'w') as f:
    f.write(content)
