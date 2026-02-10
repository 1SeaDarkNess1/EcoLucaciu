import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Update questionsAdmitere
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

# 2. Update QuizManager.finish
# Using regex to find the finish method inside QuizManager object
# Assuming indentation pattern
finish_pattern = r'finish\(\)\s*\{[\s\S]*?^\s+\},'
# This simple regex might fail if braces are nested. Let's use string replacement if we can identify unique start/end.
# Or better, just replace the whole function body if we can match it.
# The previous read of script.js shows:
# finish() {
#    ...
# }
# inside QuizManager.

new_finish_body = """finish() {
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
            const deg = (grade / 10) * 360;
            circle.style.background = `conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.2) 0deg)`;
            setTimeout(() => {
                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
            }, 100);
        }
    }"""

# We'll use a specific string replacement for the start of the function and try to match the end or just replace the block if unique enough.
# The original code:
# finish() {
#        this.initElements();
#        clearInterval(this.timer);
#        showPage('results');
# ...
#        const circle = document.getElementById('result-circle');
#        if(circle) {
#            const deg = (grade / 10) * 360;
#            circle.style.background = `conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.2) 0deg)`;
#            setTimeout(() => {
#                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
#            }, 100);
#        }
#    }

# Regex to match the function:
content = re.sub(r'finish\(\) \{[\s\S]*?^\s{4}\}', new_finish_body, content, flags=re.MULTILINE)

# 3. Add Mobile Nav Logic
nav_logic = """
    // Mobile Nav Fix
    const sidebarLinks = document.querySelectorAll('.menu-vertical a');
    const sidebar = document.getElementById('sidebar');
    if (sidebarLinks && sidebar) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                // If on mobile (or generally if sidebar is open overlay mode)
                // The issue description says "on mobile".
                // We check window width or just remove 'open' class safely.
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }
"""

content = content.replace('const initialHash = window.location.hash.substring(1);', nav_logic + '\n    const initialHash = window.location.hash.substring(1);')

# 4. Cleanup console.log
content = re.sub(r'console\.log\(.*?\);', '', content)

with open('script.js', 'w') as f:
    f.write(content)
