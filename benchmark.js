const el = { innerText: '' };
const document = {
    getElementById: (id) => el
};

const ITERATIONS = 100000000; // Increased iterations

console.log('Starting benchmark...');

// Baseline: No caching
const start1 = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
    const target = document.getElementById('timer');
    target.innerText = i.toString();
}
const end1 = Date.now();
console.log(`No caching: ${end1 - start1}ms`);

// Optimized: With caching
const start2 = Date.now();
const timerEl = document.getElementById('timer');
for (let i = 0; i < ITERATIONS; i++) {
    timerEl.innerText = i.toString();
}
const end2 = Date.now();
console.log(`With caching: ${end2 - start2}ms`);

console.log(`Improvement: ${((end1 - start1) - (end2 - start2)) / (end1 - start1) * 100}%`);
