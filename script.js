// ===== Data =====

const QUESTIONS = [
    { id: 1,  text: '十分な睡眠がとれていないと感じる',                   category: 'physical'  },
    { id: 2,  text: '慢性的な疲れがなかなか抜けない',                     category: 'physical'  },
    { id: 3,  text: '頭痛・肩こり・胃の不調など体の不調が続いている',     category: 'physical'  },
    { id: 4,  text: '些細なことでイライラしてしまう',                     category: 'emotional' },
    { id: 5,  text: '気分が落ち込むことが多い',                           category: 'emotional' },
    { id: 6,  text: '将来への不安を感じることが多い',                     category: 'emotional' },
    { id: 7,  text: '悩みを相談できる人がいないと感じる',                 category: 'isolation' },
    { id: 8,  text: '子育てを一人で抱えていると感じる',                   category: 'isolation' },
    { id: 9,  text: '周囲に助けを求めにくい',                             category: 'isolation' },
    { id: 10, text: '子どもへの対応に自信が持てない',                     category: 'pressure'  },
    { id: 11, text: '「良い親でなければ」という焦りを感じる',             category: 'pressure'  },
    { id: 12, text: '子どもに強く当たってしまい後悔することがある',       category: 'pressure'  },
    { id: 13, text: '趣味や好きなことをする時間がない',                   category: 'selfcare'  },
    { id: 14, text: '自分のことは常に後回しになっている',                 category: 'selfcare'  },
    { id: 15, text: 'リフレッシュできる時間がとれていない',               category: 'selfcare'  },
];

const CATEGORIES = {
    physical:  { label: '身体的疲労',         maxScore: 9 },
    emotional: { label: '感情・気分の不安定さ', maxScore: 9 },
    isolation: { label: '孤立感・サポート不足', maxScore: 9 },
    pressure:  { label: '子育てプレッシャー',  maxScore: 9 },
    selfcare:  { label: '自己ケア不足',        maxScore: 9 },
};

const RESULT_TYPES = [
    {
        min: 0, max: 10,
        type: '安定状態',
        comment: 'ストレスは比較的低い状態です。\n今のペースを大切にしながら、自分を労わることも忘れずに。',
    },
    {
        min: 11, max: 22,
        type: 'やや蓄積中',
        comment: 'ストレスが少しずつ溜まってきているようです。\n小さな休息をこまめに取り入れることで、だいぶ楽になるかもしれません。',
    },
    {
        min: 23, max: 34,
        type: 'ストレス高め',
        comment: 'ストレスがかなり高まっています。\n一人で抱え込まず、誰かに頼ることを意識してみてください。',
    },
    {
        min: 35, max: 45,
        type: '要注意',
        comment: '心身ともに限界に近い可能性があります。\n完璧を目指さなくて大丈夫です。まず休むことを最優先にしましょう。',
    },
];

const CATEGORY_ADVICE = {
    physical: {
        label: '身体的疲労',
        advice: '睡眠と休息を最優先にしましょう。「少し横になる」だけでも体は回復します。家事や育児のハードルを下げることも大切です。',
    },
    emotional: {
        label: '感情・気分の不安定さ',
        advice: '感情を抱え込まず、書き出したり声に出して話す機会をつくりましょう。感情が揺れることは自然なことです。',
    },
    isolation: {
        label: '孤立感・サポート不足',
        advice: '一人で抱え込まずに相談しましょう。地域の子育て支援センターやオンラインの親コミュニティも活用できます。',
    },
    pressure: {
        label: '子育てプレッシャー',
        advice: '「完璧な親」は存在しません。失敗しても後から修復できます。「今日も一緒にいた」それだけで十分です。',
    },
    selfcare: {
        label: '自己ケア不足',
        advice: '1日5分でも自分のための時間をつくりましょう。親が整うことで、子どもへの関わりも自然と変わってきます。',
    },
};

const OPTIONS = [
    { value: 0, label: 'ほとんどない' },
    { value: 1, label: 'たまにある'   },
    { value: 2, label: 'よくある'     },
    { value: 3, label: 'かなりある'   },
];

// ===== State =====

const answers = {}; // { questionId: value }

// ===== Helpers =====

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getResultType(score) {
    return RESULT_TYPES.find(r => score >= r.min && score <= r.max);
}

function calcScores() {
    let total = 0;
    const catScores = Object.fromEntries(Object.keys(CATEGORIES).map(k => [k, 0]));

    QUESTIONS.forEach(q => {
        const val = answers[q.id] ?? 0;
        total += val;
        catScores[q.category] += val;
    });

    return { total, catScores };
}

// ===== Render Questions =====

function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = QUESTIONS.map(q => `
        <div class="question-card" id="card-${q.id}">
            <p class="question-num">Q${q.id} / 15</p>
            <p class="question-text">${q.text}</p>
            <div class="options">
                ${OPTIONS.map(opt => `
                    <label class="option-label" data-qid="${q.id}" data-val="${opt.value}">
                        <input type="radio" name="q${q.id}" value="${opt.value}">
                        <span class="radio-dot"></span>
                        ${opt.label}
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Attach click handlers
    container.querySelectorAll('.option-label').forEach(label => {
        label.addEventListener('click', () => {
            const qid = Number(label.dataset.qid);
            const val = Number(label.dataset.val);
            selectOption(qid, val, label);
        });
    });
}

function selectOption(qid, val, clickedLabel) {
    // Update visual state
    document.querySelectorAll(`.option-label[data-qid="${qid}"]`).forEach(l => {
        l.classList.remove('selected');
    });
    clickedLabel.classList.add('selected');

    // Mark card as answered
    const card = document.getElementById(`card-${qid}`);
    card.classList.add('answered');

    answers[qid] = val;
    updateProgress();
}

function updateProgress() {
    const answered = Object.keys(answers).length;
    const pct = (answered / QUESTIONS.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${answered} / 15 回答済み`;
    document.getElementById('btn-submit').disabled = answered < QUESTIONS.length;
}

// ===== Render Result =====

function renderResult() {
    const { total, catScores } = calcScores();
    const result = getResultType(total);

    const content = document.getElementById('result-content');
    content.innerHTML = `
        <!-- Score Summary -->
        <div class="score-card">
            <div class="score-number">${total}</div>
            <div class="score-denom">/ 45点</div>
            <div class="score-type">${result.type}</div>
            <p class="score-comment">${result.comment.replace(/\n/g, '<br>')}</p>
        </div>

        <!-- Category Bars -->
        <div class="section-card">
            <h3>ストレスの傾向（カテゴリ別）</h3>
            ${Object.entries(CATEGORIES).map(([key, cat]) => `
                <div class="cat-item">
                    <div class="cat-label-row">
                        <span>${cat.label}</span>
                        <span class="cat-score-text">${catScores[key]} / ${cat.maxScore}</span>
                    </div>
                    <div class="cat-bar">
                        <div class="cat-fill ${getCatClass(catScores[key], cat.maxScore)}"
                             id="bar-${key}"></div>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Advice -->
        <div class="section-card">
            <h3>ストレスをやわらげるヒント</h3>
            ${renderAdvice(catScores)}
        </div>
    `;

    // Animate bars on next frame
    requestAnimationFrame(() => {
        Object.entries(CATEGORIES).forEach(([key, cat]) => {
            const bar = document.getElementById(`bar-${key}`);
            if (bar) {
                const pct = (catScores[key] / cat.maxScore) * 100;
                bar.style.width = pct + '%';
            }
        });
    });
}

function getCatClass(score, max) {
    return score / max >= 0.7 ? 'high' : '';
}

function renderAdvice(catScores) {
    const sorted = Object.entries(catScores)
        .filter(([, score]) => score > 0)
        .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        return '<p class="advice-all-clear">ストレスはほとんど感じていないようです。このペースを大切に続けましょう。</p>';
    }

    return sorted.map(([key]) => {
        const info = CATEGORY_ADVICE[key];
        return `
            <div class="advice-item">
                <span class="advice-marker"></span>
                <div class="advice-body">
                    <span class="advice-cat-name">${info.label}</span>
                    ${info.advice}
                </div>
            </div>
        `;
    }).join('');
}

// ===== Event Wiring =====

function resetQuiz() {
    Object.keys(answers).forEach(k => delete answers[k]);
    renderQuestions();
    updateProgress();
}

document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();

    document.getElementById('btn-start').addEventListener('click', () => {
        showScreen('screen-quiz');
    });

    document.getElementById('btn-submit').addEventListener('click', () => {
        renderResult();
        showScreen('screen-result');
    });

    document.getElementById('btn-retry').addEventListener('click', () => {
        resetQuiz();
        showScreen('screen-top');
    });
});
