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
    physical:  { label: '身体的疲労',          maxScore: 9, positive: '体の疲れをある程度コントロールできています。' },
    emotional: { label: '感情・気分の不安定さ', maxScore: 9, positive: '感情の揺れを自分で受け止められています。' },
    isolation: { label: '孤立感・サポート不足', maxScore: 9, positive: 'つながりや支えを感じられている部分があります。' },
    pressure:  { label: '子育てプレッシャー',  maxScore: 9, positive: '子育てに対してバランスよく向き合えています。' },
    selfcare:  { label: '自己ケア不足',        maxScore: 9, positive: '自分のための時間や余白をある程度確保できています。' },
};

const RESULT_TYPES = [
    {
        min: 0, max: 10,
        type: '安定状態',
        praise: '自分を整える力が育っています。',
        comments: [
            'ストレスが比較的低い状態です。今の自分のペースをそのまま大切にしてください。',
            '心身のバランスが取れている状態です。小さな心がけが続いている証拠です。',
            'よく自分を保てています。今しているケアを意識して続けることが大切です。',
        ],
    },
    {
        min: 11, max: 22,
        type: 'やや蓄積中',
        praise: '多くのことを一生懸命こなせています。',
        comments: [
            'ストレスが少しずつ溜まり始めているようです。今のうちに小さな休息を意識的に取り入れましょう。',
            '頑張りすぎているサインかもしれません。「休むこと」も子育ての大切な一部です。',
            '疲れが見えてきているかもしれません。一人で全部やろうとしなくて大丈夫です。',
        ],
    },
    {
        min: 23, max: 34,
        type: 'ストレス高め',
        praise: 'この状態でも向き合い続けていることに価値があります。',
        comments: [
            'ストレスがかなり高まっています。完璧を目指さず、誰かに頼ることを意識してみてください。',
            '心身の疲れが積み重なっています。「助けを求めること」は弱さではありません。',
            '限界に近いサインが出ているかもしれません。今日、一つだけ手を抜けることを見つけてみましょう。',
        ],
    },
    {
        min: 35, max: 45,
        type: '要注意',
        praise: 'この診断に向き合えた勇気を、まず自分に認めてあげてください。',
        comments: [
            '心身ともに限界に近い可能性があります。まず休むことを最優先にしてください。あなたが整うことが、子どもにとっても一番大切です。',
            '今のあなたはとても頑張っています。でも頑張りすぎは限界を超えます。誰かに話すだけでも楽になれます。',
            '完璧でなくて大丈夫です。今日一日、子どもと同じ空間にいられた。それだけで十分です。',
        ],
    },
];

const CATEGORY_ADVICE = {
    physical: {
        label: '身体的疲労',
        advice: '「今日は早く寝る」だけを決めてみましょう。家事は明日に回せます。横になるだけでも体は回復します。',
        steps: [
            '今夜、就寝を30分早める',
            '「やらなくていい家事」を一つ決める',
            '食事は「手抜きOK」の日を週2回作る',
        ],
    },
    emotional: {
        label: '感情・気分の不安定さ',
        advice: '感情は抑え込まず、紙に書き出すだけで楽になります。「今日イライラした出来事」を寝る前に3行書いてみてください。',
        steps: [
            '今日感じた感情を紙に1行書く',
            '「イライラした→〇〇だったから」と理由を探す',
            '信頼できる人に「最近しんどい」と一言伝える',
        ],
    },
    isolation: {
        label: '孤立感・サポート不足',
        advice: '一人で抱え込まなくて大丈夫です。「話を聞いてもらうだけ」でも気持ちはだいぶ変わります。',
        steps: [
            '市区町村の子育て支援センターをWebで調べる',
            'SNSで共感できる子育てアカウントをフォローする',
            'パートナーや家族に「今日しんどかった」と伝える',
        ],
    },
    pressure: {
        label: '子育てプレッシャー',
        advice: '「完璧な親」は存在しません。叱ってしまっても「さっきはごめんね」と言えれば、関係は修復できます。',
        steps: [
            '「今日もなんとかやった」と寝る前に声に出す',
            '「子どもに謝る」を弱さでなく強さと捉え直す',
            '自分の「良い親の基準」を一つだけ下げてみる',
        ],
    },
    selfcare: {
        label: '自己ケア不足',
        advice: '1日5分で十分です。コーヒーを一人でゆっくり飲む、好きな音楽をかける、それだけでも立派なセルフケアです。',
        steps: [
            '子どもが寝た後に「自分だけの5分」を確保する',
            '好きな飲み物を用意してスマホを置いて飲む',
            '「何もしない」時間を週1回自分に許可する',
        ],
    },
};

const GUIDE_TIPS = {
    physical: [
        '夜21時以降のスマホをやめて、眠りの質を上げる',
        '「今週やらなくていい家事」を1つ決めて、省エネモードに入る',
        '昼間に10分だけ横になる「プチ休憩」を取り入れる',
        '食事は「栄養より手間なく食べられること」を優先してよい',
        'お風呂はシャワーのみにして、就寝を30分早める',
    ],
    emotional: [
        '「怒り日記」：イライラした場面を夜に3行だけ書き出す',
        '「今日のしんどさ」を10点満点で数値化する習慣をつける',
        '気持ちが落ちたとき、15分だけ外の空気を吸いに出る',
        '感情に名前をつける：「これは疲れからくる不安だ」と声に出す',
        '「今日もなんとかやれた」を寝る前に1つ見つけて声に出す',
    ],
    isolation: [
        '自治体の子育て支援センター・ひろばを一度訪問してみる',
        'パートナーや家族に「今週しんどかった」と1文だけ送る',
        '同じ年齢の子を持つ親のSNSアカウントをフォローして共感を得る',
        '週に1回、大人と話す機会を意識的につくる',
        '断られてもいい。「頼む練習」と思って誰かに一度声をかける',
    ],
    pressure: [
        '「今日の自分の良かったところ」を毎晩1つだけ書く',
        '「子どもと同じ空間にいられた」だけで合格点にしてよい',
        '叱ってしまった後は「さっきはごめんね」の一言で十分',
        '子育て情報を見る時間を1日30分に意識的に制限する',
        '「〇〇すべき」が浮かんだら「できなくても大丈夫」に言い換える',
    ],
    selfcare: [
        '毎朝・毎晩、1分だけ「自分の気持ち」を確認する時間をつくる',
        '好きな香り・音・飲み物で「自分だけの5分間」を演出する',
        '子どもが寝た後の15分を「触れてはいけない自分時間」にする',
        '月に1度、ひとりで出かける予定を手帳に書き込む',
        '「今日もよく頑張った」と自分に声をかけてから眠る',
    ],
};

const OPTIONS = [
    { value: 0, label: 'ほとんどない' },
    { value: 1, label: 'たまにある'   },
    { value: 2, label: 'よくある'     },
    { value: 3, label: 'かなりある'   },
];

// ===== State =====

let currentIndex = 0;
let answers = new Array(QUESTIONS.length).fill(null);

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

    QUESTIONS.forEach((q, i) => {
        const val = answers[i] ?? 0;
        total += val;
        catScores[q.category] += val;
    });

    return { total, catScores };
}

// ===== Render Question (1問ずつ) =====

function renderQuestion(immediate) {
    const q = QUESTIONS[currentIndex];
    const card = document.getElementById('question-card');

    if (!immediate) card.style.opacity = '0';

    document.getElementById('q-number').textContent = `Q${q.id} / ${QUESTIONS.length}`;
    document.getElementById('q-text').textContent = q.text;

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    OPTIONS.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn' + (answers[currentIndex] === opt.value ? ' selected' : '');
        btn.textContent = opt.label;
        btn.addEventListener('click', () => handleAnswer(opt.value, btn));
        container.appendChild(btn);
    });

    const pct = (currentIndex / QUESTIONS.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${currentIndex + 1} / ${QUESTIONS.length}`;

    document.getElementById('btn-back').style.visibility = currentIndex === 0 ? 'hidden' : 'visible';

    card.classList.remove('animate');
    void card.offsetWidth;
    card.classList.add('animate');
    if (!immediate) card.style.opacity = '';
}

function handleAnswer(val, selectedBtn) {
    document.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('selected');
        b.disabled = true;
    });
    selectedBtn.classList.add('selected');
    answers[currentIndex] = val;

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < QUESTIONS.length) {
            renderQuestion(false);
        } else {
            renderResult();
            showScreen('screen-result');
        }
    }, 320);
}

// ===== Render Result =====

function renderResult() {
    const { total, catScores } = calcScores();
    const result = getResultType(total);

    const comment = result.comments[Math.floor(Math.random() * result.comments.length)];

    const content = document.getElementById('result-content');
    content.innerHTML = `
        <!-- Score Summary -->
        <div class="score-card">
            <div class="score-number">${total}</div>
            <div class="score-denom">/ 45点</div>
            <div class="score-type">${result.type}</div>
            <p class="score-praise">${result.praise}</p>
            <p class="score-comment">${comment}</p>
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

        <!-- Guide -->
        <div class="section-card guide-section">
            <h3>📚 カテゴリ別セルフケアガイド</h3>
            <p class="guide-section-sub">あなたのストレス傾向に合わせた、今日からできるケアのヒント集</p>
            ${renderGuide(catScores)}
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
    const allZero = Object.values(catScores).every(s => s === 0);
    if (allZero) {
        return '<p class="advice-all-clear">ストレスはほとんど感じていないようです。このペースを大切に続けましょう。</p>';
    }

    const threshold = 0.34;
    const sorted = Object.entries(catScores).sort((a, b) => b[1] - a[1]);
    const doingWell = sorted.filter(([key, score]) => score / CATEGORIES[key].maxScore < threshold);
    const needsCare = sorted.filter(([key, score]) => score / CATEGORIES[key].maxScore >= threshold);

    // Always show at least one positive item
    const praiseItems = doingWell.length > 0 ? doingWell : [sorted[sorted.length - 1]];

    let html = '';

    html += '<p class="advice-section-label advice-section-ok">できていること</p>';
    praiseItems.forEach(([key]) => {
        html += `
            <div class="advice-item advice-item-ok">
                <span class="advice-marker advice-marker-ok"></span>
                <div class="advice-body">
                    <span class="advice-cat-name advice-cat-ok">${CATEGORIES[key].label}</span>
                    ${CATEGORIES[key].positive}
                </div>
            </div>
        `;
    });

    if (needsCare.length > 0) {
        html += '<p class="advice-section-label">ケアポイント</p>';
        needsCare.forEach(([key, score]) => {
            const info = CATEGORY_ADVICE[key];
            const isHigh = score / CATEGORIES[key].maxScore >= 0.67;
            html += `
                <div class="advice-item${isHigh ? ' advice-item-high' : ''}">
                    <span class="advice-marker${isHigh ? ' advice-marker-high' : ''}"></span>
                    <div class="advice-body">
                        <span class="advice-cat-name${isHigh ? ' advice-cat-high' : ''}">${info.label}</span>
                        ${info.advice}
                        <ul class="advice-steps">
                            ${info.steps.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
    }

    return html;
}

function renderGuide(catScores) {
    const sorted = Object.entries(CATEGORIES).sort(([aKey], [bKey]) =>
        (catScores[bKey] / CATEGORIES[bKey].maxScore) - (catScores[aKey] / CATEGORIES[aKey].maxScore)
    );

    return sorted.map(([key, cat]) => {
        const pct = catScores[key] / cat.maxScore;
        let levelClass, levelLabel;
        if (pct >= 0.67) {
            levelClass = 'guide-level-high';
            levelLabel = '注意';
        } else if (pct >= 0.34) {
            levelClass = 'guide-level-mid';
            levelLabel = 'やや高め';
        } else {
            levelClass = 'guide-level-low';
            levelLabel = '良好';
        }
        return `
            <div class="guide-cat-block">
                <div class="guide-cat-header">
                    <span class="guide-level-badge ${levelClass}">${levelLabel}</span>
                    <span class="guide-cat-name">${cat.label}</span>
                </div>
                <ul class="guide-tips-list">
                    ${GUIDE_TIPS[key].map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }).join('');
}

// ===== Event Wiring =====

function resetQuiz() {
    currentIndex = 0;
    answers.fill(null);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-start').addEventListener('click', () => {
        resetQuiz();
        renderQuestion(true);
        showScreen('screen-quiz');
    });

    document.getElementById('btn-back').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderQuestion(false);
        }
    });

    document.getElementById('btn-retry').addEventListener('click', () => {
        showScreen('screen-top');
    });
});
