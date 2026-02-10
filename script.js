const lectiiCompleta = []; const bibliotecaCompleta = []; const testeAntrenament = []; const unis = [];
const questionsGeneral = [
    { q: "Care dintre următoarele reprezintă trăsătura fundamentală a resurselor economice?", o: ["Sunt nelimitate", "Sunt rare și limitate", "Sunt gratuite", "Se regenerează complet"], c: 1, e: "Raritatea este caracteristica fundamentală a resurselor în raport cu nevoile nelimitate." },
    { q: "Costul de oportunitate reprezintă:", o: ["Cheltuielile totale de producție", "Valoarea celei mai bune alternative la care se renunță", "Profitul obținut", "Prețul de vânzare"], c: 1, e: "Este costul alegerii, măsurat prin valoarea alternativei sacrificate." },
    { q: "Nevoile umane sunt:", o: ["Limitate", "Nelimitate și dinamice", "Fixe în timp", "Identice pentru toți indivizii"], c: 1, e: "Nevoile se multiplică și se diversifică continuu." },
    { q: "Care dintre următorii este un agent economic?", o: ["Menajele", "Firmele", "Statul", "Toate cele de mai sus"], c: 3, e: "Menajele, firmele, statul și băncile sunt principalii agenți economici." },
    { q: "Banii îndeplinesc funcția de:", o: ["Mijloc de schimb", "Etalon al valorii", "Mijloc de rezervă", "Toate variantele"], c: 3, e: "Banii au funcții multiple: schimb, evaluare, rezervă." },
    { q: "Raționalitatea economică presupune:", o: ["Maximizarea rezultatelor cu resurse date", "Minimizarea consumului", "Eliminarea riscurilor", "Creșterea prețurilor"], c: 0, e: "Principiul maximului: maximizarea efectelor cu eforturi date." },
    { q: "Ce reprezintă utilitatea marginală?", o: ["Satisfacția totală", "Satisfacția adusă de ultima unitate consumată", "Prețul bunului", "Costul de producție"], c: 1, e: "Umg este sporul de utilitate obținut prin creșterea consumului cu o unitate." },
    { q: "Legea cererii exprimă o relație:", o: ["Directă între preț și cantitate", "Inversă între preț și cantitate", "De egalitate", "Aleatoare"], c: 1, e: "Când prețul crește, cererea scade (ceteris paribus)." },
    { q: "Bunurile complementare sunt acelea care:", o: ["Se înlocuiesc reciproc", "Se consumă împreună", "Nu au legătură", "Au prețuri identice"], c: 1, e: "Ex: autoturismul și combustibilul." },
    { q: "Piața cu concurență perfectă presupune:", o: ["Atomicitatea ofertei", "Produse omogene", "Transparență perfectă", "Toate variantele"], c: 3, e: "Concurența perfectă este un model teoretic ideal." },
    { q: "Ce este inflația?", o: ["Creșterea producției", "Creșterea generalizată a prețurilor", "Scăderea șomajului", "Creșterea dobânzilor"], c: 1, e: "Inflația este un dezechilibru macroeconomic marcat de creșterea prețurilor și scăderea puterii de cumpărare." },
    { q: "Produsul Intern Brut (PIB) măsoară:", o: ["Valoarea bunurilor finale produse într-o țară", "Averea populației", "Exporturile nete", "Cheltuielile statului"], c: 0, e: "PIB este indicatorul macroeconomic de bază pentru producția internă." },
    { q: "Salariul reprezintă:", o: ["Venitul capitalului", "Prețul muncii", "Profitul firmei", "Dobânda bancară"], c: 1, e: "Salariul este remunerația factorului de producție muncă." },
    { q: "Capitalul fix se caracterizează prin:", o: ["Se consumă într-un singur ciclu", "Se uzează treptat", "Nu participă la producție", "Este lichiditate"], c: 1, e: "Capitalul fix participă la mai multe cicluri și se amortizează." },
    { q: "Dobânda este:", o: ["Prețul banilor", "Venitul pământului", "Taxa pe valoare adăugată", "Profitul brut"], c: 0, e: "Dobânda este suma plătită pentru dreptul de folosință a capitalului împrumutat." },
    { q: "Productivitatea muncii se calculează ca raport între:", o: ["Producție și numărul de salariați", "Costuri și profit", "Preț și cantitate", "Capital și natură"], c: 0, e: "W = Q / L." },
    { q: "Oferta inelastică înseamnă că:", o: ["Cantitatea nu se modifică la preț", "Cantitatea se modifică puțin la o variație mare a prețului", "Oferta este infinită", "Prețul este fix"], c: 1, e: "Coeficientul de elasticitate este subunitar." },
    { q: "Ce reprezintă dividendele?", o: ["Dobânzi bancare", "Cota parte din profitul acționarilor", "Salariile managerilor", "Taxe către stat"], c: 1, e: "Dividendele se plătesc acționarilor din profitul net." },
    { q: "Impozitele directe vizează:", o: ["Veniturile și averea", "Consumul (TVA)", "Importurile", "Cifra de afaceri"], c: 0, e: "Impozitul pe venit sau profit este direct." },
    { q: "Bursa de valori este o piață:", o: ["De bunuri de consum", "De capitaluri (titluri de valoare)", "A forței de muncă", "Imobiliară"], c: 1, e: "Pe bursa de valori se tranzacționează acțiuni și obligațiuni." }
];

const questionsMicro = [
    { q: "Dacă prețul unui bun crește cu 10%, iar cantitatea cerută scade cu 20%, cererea este:", o: ["Inelastică", "Elastică", "Unitară", "Perfect inelastică"], c: 1, e: "Kec = 20%/10% = 2 (>1), deci elastică." },
    { q: "Costul marginal reprezintă:", o: ["Costul total mediu", "Sporul de cost total la o unitate adițională de producție", "Costul fix", "Profitul marginal"], c: 1, e: "Cmg = ΔCT / ΔQ." },
    { q: "Punctul de echilibru al pieței se formează unde:", o: ["Cererea este maximă", "Oferta este minimă", "Cererea este egală cu oferta", "Profitul este nul"], c: 2, e: "Intersecția curbei cererii cu oferta." },
    { q: "În concurență monopolistică:", o: ["Există un singur vânzător", "Produsele sunt diferențiate", "Barierele de intrare sunt mari", "Prețul este unic"], c: 1, e: "Multe firme vând produse similare, dar nu identice." },
    { q: "Pragul de rentabilitate este nivelul producției la care:", o: ["Profitul este maxim", "Veniturile totale sunt egale cu Costurile totale", "Costurile sunt minime", "Prețul este maxim"], c: 1, e: "Profitul este zero." },
    { q: "Legea randamentelor neproporționale se manifestă:", o: ["Pe termen lung", "Pe termen scurt", "Doar în agricultură", "La nivel macroeconomic"], c: 1, e: "Când un factor este variabil și ceilalți ficși." },
    { q: "Costul fix mediu (CFM) atunci când producția crește:", o: ["Crește", "Rămâne constant", "Scade continuu", "Devine zero"], c: 2, e: "CFM = CF / Q. Dacă Q crește, CFM scade." },
    { q: "Dacă un bun are mulți substituenți, cererea sa este:", o: ["Elastică", "Inelastică", "Rigidă", "Nulă"], c: 0, e: "Consumatorii pot trece ușor la alt produs." },
    { q: "Profitul brut se calculează:", o: ["Venituri - Costuri + Taxe", "Venituri - Cheltuieli totale", "Cifra de afaceri - Salarii", "Doar din vânzări"], c: 1, e: "Pr = Vt - Ct." },
    { q: "Oligopolul se caracterizează prin:", o: ["O singură firmă", "Număr mic de firme mari", "Multe firme mici", "Produse identice obligatoriu"], c: 1, e: "Interdependența dintre concurenți este cheia oligopolului." },
    { q: "Curba de indiferență reprezintă:", o: ["Combinații de bunuri cu aceeași utilitate", "Combinații cu același preț", "Bugetul consumatorului", "Oferta pieței"], c: 0, e: "Consumatorul este indiferent între orice punct de pe curbă." },
    { q: "Rata marginală de substituție măsoară:", o: ["Prețul relativ", "Cu cât se renunță la un bun pentru a obține o unitate din altul", "Costul de producție", "Venitul marginal"], c: 1, e: "Panta curbei de indiferență." },
    { q: "Constrângerea bugetară depinde de:", o: ["Preferințe", "Venit și prețurile bunurilor", "Utilitate", "Tehnologie"], c: 1, e: "Linia bugetului: V = xPx + yPy." },
    { q: "Echilibrul consumatorului se atinge când:", o: ["Umg/P sunt egale pentru toate bunurile", "Cheltuiește cel mai puțin", "Cumpără doar bunuri ieftine", "Utilitatea totală este zero"], c: 0, e: "Legea a II-a a lui Gossen." },
    { q: "Bunurile Giffen sunt o excepție de la:", o: ["Legea ofertei", "Legea cererii", "Legea utilității", "Legea concurenței"], c: 1, e: "Cererea crește când prețul crește (bunuri inferioare)." }
];

const questionsMacro = [
    { q: "Șomajul structural apare din cauza:", o: ["Scăderii cererii agregate", "Neconcordanței între calificare și cererea de muncă", "Sezonului", "Alegerii voluntare"], c: 1, e: "Este legat de schimbările tehnologice și structurale." },
    { q: "Deflatorul PIB se calculează ca raport între:", o: ["PIB nominal și PIB real", "PIB real și PIB nominal", "PIB și PNB", "Venit și Consum"], c: 0, e: "Măsoară modificarea prețurilor." },
    { q: "Politica fiscală restrictivă presupune:", o: ["Scăderea impozitelor", "Creșterea impozitelor sau scăderea cheltuielilor", "Creșterea masei monetare", "Scăderea dobânzii"], c: 1, e: "Are ca scop reducerea inflației sau a deficitului." },
    { q: "Cursul valutar reprezintă:", o: ["Prețul unei monede exprimat în alta", "Dobânda la credite externe", "Rata inflației", "Deficitul comercial"], c: 0, e: "Raportul de schimb între două monede." },
    { q: "Cererea de bani pentru speculație depinde invers proporțional de:", o: ["Venit", "Rata dobânzii", "Prețuri", "Cursul valutar"], c: 1, e: "Când dobânda e mare, cererea de bani lichizi scade (oamenii investesc)." },
    { q: "Venitul Național (VN) este egal cu:", o: ["PNN în prețurile factorilor", "PIB la prețul pieței", "Consum + Investiții", "Exporturi nete"], c: 0, e: "Produsul Național Net la costul factorilor." },
    { q: "Multiplicatorul investițiilor (Keynes) arată:", o: ["Relația dintre investiții și venit", "Relația dintre șomaj și inflație", "Relația dintre bani și prețuri", "Relația dintre dobândă și economii"], c: 0, e: "k = 1 / (1 - c'). Arată cu cât crește venitul la creșterea investițiilor." },
    { q: "Curba Phillips ilustrează relația inversă dintre:", o: ["Preț și Cantitate", "Rata șomajului și Rata inflației", "Venit și Consum", "Investiții și Dobândă"], c: 1, e: "Compromisul pe termen scurt între inflație și șomaj." },
    { q: "Balanța comercială înregistrează:", o: ["Doar serviciile", "Exporturile și importurile de bunuri", "Mișcările de capital", "Turismul"], c: 1, e: "Diferența dintre exporturi și importuri." },
    { q: "O taxă vamală de protecție:", o: ["Stimulează importurile", "Scumpeste importurile pentru a proteja producția internă", "Este interzisă", "Scade prețurile interne"], c: 1, e: "Protecționism comercial." },
    { q: "Masa monetară (M) este controlată de:", o: ["Guvern", "Banca Centrală", "Firme", "Populație"], c: 1, e: "BNR în România." },
    { q: "Ciclul economic are fazele:", o: ["Expansiune, Boom, Recesiune, Depresie", "Doar creștere", "Doar scădere", "Stagnare permanentă"], c: 0, e: "Fluctuațiile activității economice." },
    { q: "Impozitul progresiv înseamnă:", o: ["Cotă fixă pentru toți", "Cotă procentuală crescătoare pe măsură ce venitul crește", "Cotă descrescătoare", "Taxă pe consum"], c: 1, e: "Principiul echității verticale." },
    { q: "Datoria publică reprezintă:", o: ["Datoriile firmelor", "Totalitatea împrumuturilor statului nerambursate", "Deficitul anual", "Datoriile populației"], c: 1, e: "Acumularea deficitelor bugetare din trecut." },
    { q: "Externalitățile negative apar când:", o: ["Costul social este mai mare decât costul privat", "Beneficiul social este mare", "Nu există poluare", "Piața este perfectă"], c: 0, e: "Ex: poluarea. Piața eșuează în alocarea optimă." }
];

const questionsAdmitere = [
    { q: "Calculați costul total dacă CF=1000 și CV=20Q pentru Q=50.", o: ["2000", "1500", "3000", "1000"], c: 0, e: "CT = CF + CV = 1000 + 20*50 = 1000 + 1000 = 2000." },
    { q: "Dacă masa monetară crește cu 10% și viteza de rotație scade cu 10%, PIB nominal:", o: ["Rămâne aproximativ constant", "Crește cu 20%", "Scade cu 20%", "Se dublează"], c: 0, e: "MxV = PxQ. 1.1 * 0.9 = 0.99 (aprox 1)." },
    { q: "Coeficientul de elasticitate a cererii la preț este 2. O creștere a prețului cu 5% determină:", o: ["Scăderea cantității cu 10%", "Creșterea cantității cu 10%", "Scăderea cantității cu 2.5%", "Nicio modificare"], c: 0, e: "%ΔQ = -Kec * %ΔP = -2 * 5% = -10%." },
    { q: "Un agent economic depune la bancă 1000 lei cu dobândă 10%. Peste 2 ani va avea:", o: ["1200", "1210", "1100", "1000"], c: 1, e: "Dobândă compusă: 1000 * (1.1)^2 = 1000 * 1.21 = 1210." },
    { q: "Care nu este atribut al proprietății?", o: ["Posesia", "Folosința", "Uzufructul", "Insolvența"], c: 3, e: "Insolvența este o stare juridică, nu un atribut (usus, fructus, abusus)." },
    { q: "În piața de monopol, firma:", o: ["Este `price taker`", "Este `price maker`", "Nu are putere de piață", "Vinde la prețul concurenței"], c: 1, e: "Monopolul stabilește prețul." },
    { q: "Salariul real crește dacă:", o: ["Salariul nominal crește mai repede decât prețurile", "Prețurile cresc mai repede decât salariul nominal", "Salariul nominal scade", "Inflația este galopantă"], c: 0, e: "Sr = Sn / IPC." },
    { q: "Amortizarea se include în:", o: ["Costul variabil", "Costul fix", "Profit", "Impozite"], c: 1, e: "Este o cheltuială care nu depinde direct de volumul producției pe termen scurt." },
    { q: "Cererea este perfect elastică atunci când:", o: ["Curba este verticală", "Curba este orizontală", "Panta este 1", "Panta este -1"], c: 1, e: "La un anumit preț, cantitatea cerută este infinită (teoretic)." },
    { q: "Bunurile publice sunt caracterizate prin:", o: ["Rivalitate și excluziune", "Non-rivalitate și non-excluziune", "Doar rivalitate", "Sunt produse doar de firme private"], c: 1, e: "Ex: iluminatul stradal, apărarea națională." },
    { q: "Care flux face parte din fluxul real?", o: ["Plata salariilor", "Fluxul de bunuri și servicii", "Plata impozitelor", "Fluxul monetar"], c: 1, e: "Fluxul real vizează factorii de producție și bunurile." },
    { q: "Dacă UmgA / PA > UmgB / PB, consumatorul rațional va:", o: ["Cumpăra mai mult A", "Cumpăra mai mult B", "Nu va face nimic", "Va renunța la A"], c: 0, e: "Pentru a egaliza utilitățile marginale pe unitatea monetară." },
    { q: "Rata șomajului se calculează raportând numărul șomerilor la:", o: ["Populația totală", "Populația activă", "Populația ocupată", "Populația inactivă"], c: 1, e: "Rș = (Șomeri / Pop. Activă) * 100." },
    { q: "Dacă rata rezervelor obligatorii crește, masa monetară:", o: ["Scade", "Crește", "Rămâne la fel", "Nu este influențată"], c: 0, e: "Băncile pot acorda mai puține credite (multiplicatorul monetar scade)." },
    { q: "Protecționismul vamal favorizează:", o: ["Consumatorii interni", "Producătorii interni", "Importatorii", "Turiștii"], c: 1, e: "Reduce concurența externă." },
    { q: "Costul de oportunitate este nul când:", o: ["Resursele sunt nelimitate", "Alegerea este dificilă", "Resursele sunt rare", "Există alternative"], c: 0, e: "Dacă resursele ar fi nelimitate, nu ar exista sacrificiu." },
    { q: "Indicele Dezvoltării Umane (IDU) include:", o: ["Doar PIB", "PIB/loc, Speranța de viață, Educație", "Doar Șomaj", "Doar Inflație"], c: 1, e: "Este un indicator compozit al calității vieții." },
    { q: "Cartelul este o formă de:", o: ["Concurență perfectă", "Monopol", "Oligopol cooperant", "Monopson"], c: 2, e: "O înțelegere între firme pentru a fixa prețurile sau cotele." },
    { q: "Dacă V = 5000 și C = 4000, înclinația medie spre economisire este:", o: ["0.2", "0.8", "1", "0"], c: 0, e: "S = V - C = 1000. s = S/V = 1000/5000 = 0.2." },
    { q: "Inflația prin cerere apare când:", o: ["Cererea agregată depășește oferta agregată", "Costurile cresc", "Salariile scad", "Exporturile scad"], c: 0, e: "Prea mulți bani pentru prea puține bunuri." },
    { q: "Piața neagră apare de obicei când:", o: ["Statul impune un preț maxim sub cel de echilibru", "Piața este liberă", "Prețurile sunt mari", "Există surplus"], c: 0, e: "Excesul de cerere duce la tranzacții ilegale." },
    { q: "Care este o barieră de intrare pe piață?", o: ["Profitul mic", "Licențele și brevetele", "Numărul mare de firme", "Cererea mică"], c: 1, e: "Împiedică intrarea noilor concurenți." },
    { q: "Legea ofertei este încălcată:", o: ["Pe piața muncii (curba întoarsă)", "Pe piața bunurilor normale", "Niciodată", "În concurență perfectă"], c: 0, e: "La salarii foarte mari, oferta de muncă poate scădea (efectul de venit domină)." },
    { q: "Coeficientul Gini măsoară:", o: ["Inflația", "Inegalitatea veniturilor", "Șomajul", "Creșterea economică"], c: 1, e: "0 = egalitate perfectă, 1 = inegalitate totală." },
    { q: "Când exporturile > importurile, balanța comercială este:", o: ["Deficitară", "Excedentară", "Echilibrată", "Nulă"], c: 1, e: "Intrări nete de valută." },
    { q: "Ce instituție emite monedă în România?", o: ["Guvernul", "BNR", "BCR", "Parlamentul"], c: 1, e: "Banca Națională a României." },
    { q: "Dumping-ul reprezintă:", o: ["Vânzarea sub costul de producție pe piața externă", "Poluare", "Taxe mari", "Importuri ilegale"], c: 0, e: "Practică neloială." },
    { q: "Dacă rata dobânzii scade, investițiile:", o: ["Cresc", "Scad", "Rămân constante", "Nu au legătură"], c: 0, e: "Costul creditului este mai mic." },
    { q: "Funcția de consum este C = 100 + 0.8V. La V=1000, C este:", o: ["800", "900", "1000", "100"], c: 1, e: "C = 100 + 800 = 900." },
    { q: "Paradoxul apei și diamantului se explică prin:", o: ["Utilitatea totală vs Utilitatea marginală", "Costuri de producție", "Raritate absolută", "Eroare de piață"], c: 0, e: "Apa are Ut mare dar Umg mică; diamantul invers." }
];

const masterBank = [...questionsGeneral, ...questionsMicro, ...questionsMacro, ...questionsAdmitere];

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

        let bank = [];
        let limit = 20;

        if (typeof questionsGeneral !== 'undefined') {
            switch(type) {
                case 'general':
                    bank = [...questionsGeneral];
                    limit = 20;
                    break;
                case 'micro':
                    bank = [...questionsMicro];
                    limit = 15;
                    break;
                case 'macro':
                    bank = [...questionsMacro];
                    limit = 15;
                    break;
                case 'admitere':
                    bank = [...questionsAdmitere];
                    limit = 30;
                    break;
                default:
                    bank = [...(typeof masterBank !== 'undefined' ? masterBank : [])];
                    limit = 20;
            }
        } else {
             bank = [...(typeof masterBank !== 'undefined' ? masterBank : [])];
        }

        // Shuffle
        for (let i = bank.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bank[i], bank[j]] = [bank[j], bank[i]];
        }

        this.questions = bank.slice(0, limit);

        // Reset state
        this.index = 0; this.score = 0; this.secs = 0; this.correct = 0; this.wrong = 0;
        if(this.correctEl) this.correctEl.innerText = 0;
        if(this.wrongEl) this.wrongEl.innerText = 0;
        if(this.timerEl) this.timerEl.innerText = "00:00";

        showPage('quiz');

        // Timer
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.secs++;
            const min = Math.floor(this.secs / 60);
            const sec = this.secs % 60;
            if(this.timerEl) this.timerEl.innerText = `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
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

        const finalScore = this.score;
        const totalQuestions = this.questions.length;
        const maxScore = totalQuestions * 5;
        // Grade calculation: scale 1 to 10
        // If max score (e.g. 100) -> 10. If 0 -> 1.
        // formula: 1 + (score / maxScore) * 9
        const grade = totalQuestions > 0 ? 1 + (finalScore / maxScore) * 9 : 1;
        const gradeFixed = grade.toFixed(2);

        const scoreTextEl = document.getElementById('final-score-text');
        if(scoreTextEl) scoreTextEl.innerText = `${finalScore} / ${maxScore}`;

        const timeEl = document.getElementById('final-time');
        if(timeEl) timeEl.innerText = this.timerEl.innerText;

        const gradeBigEl = document.getElementById('final-grade-big');
        if(gradeBigEl) gradeBigEl.innerText = gradeFixed;

        const msgEl = document.getElementById('performance-msg');
        if(msgEl) {
            if (grade >= 9) {
                msgEl.innerText = "Excelent! Ești pregătit pentru succes.";
                msgEl.style.color = "var(--success)";
            } else if (grade >= 7) {
                msgEl.innerText = "Bun! Mai ai nevoie de puțină recapitulare.";
                msgEl.style.color = "var(--accent)";
            } else if (grade >= 5) {
                 msgEl.innerText = "Satisfăcător. Recomandăm parcurgerea materiei din nou.";
                 msgEl.style.color = "#d97706";
            } else {
                msgEl.innerText = "Insuficient. Te rugăm să reiei cursurile.";
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
