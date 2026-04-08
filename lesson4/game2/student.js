/* ========================================
   TeeTalkEnglish - Nail Salon Talk Game
   JavaScript Game Logic
   ======================================== */

// ========== GAME DATA ==========
const gameData = {
    rounds: [
        {
            // Round 1: Fill in the blank
            type: 'fill-blank',
            roundNum: 1,
            title: '✏️ Fill in the Blank',
            instruction: 'Choose the correct word to complete what the Nail Tech says.',
            sentence: 'Hello! Do you have an ___?',
            answer: 'appointment',
            choices: ['appointment', 'service', 'pedicure', 'chair'],
            chatBefore: [],
            chatAfter: [
                { speaker: 'tech', text: 'Hello! Do you have an appointment?' }
            ],
            wordHelp: {
                word: 'appointment',
                pronunciation: '/əˈpɔɪntmənt/',
                hint: '(lịch hẹn) — When a client calls before they come in, they make an appointment.'
            }
        },
        {
            // Round 2: Multiple choice response
            type: 'multiple-choice',
            roundNum: 2,
            title: '💬 Choose the Best Response',
            instruction: 'The client says: "No, I don\'t. Can I walk in?" — What should you say?',
            question: 'The client has no appointment and wants to walk in. What do you say?',
            answer: 'Yes, of course! Which service would you like?',
            choices: [
                'Sorry, we are closed.',
                'Yes, of course! Which service would you like?',
                'No, you need an appointment.',
                'Please come back tomorrow.'
            ],
            chatBefore: [
                { speaker: 'client', text: 'No, I don\'t. Can I walk in?' }
            ],
            chatAfter: [
                { speaker: 'client', text: 'No, I don\'t. Can I walk in?' },
                { speaker: 'tech', text: 'Yes, of course! Which service would you like?' }
            ],
            wordHelp: {
                word: 'walk in',
                pronunciation: '/wɑːk ɪn/',
                hint: '(đến không cần hẹn) — A "walk-in" client comes without calling first.'
            }
        },
        {
            // Round 3: Unscramble
            type: 'unscramble',
            roundNum: 3,
            title: '🔀 Unscramble the Sentence',
            instruction: 'The client asks about your services. Put the words in the correct order.',
            words: ['What', 'do', 'you', 'have', '?'],
            answer: 'What do you have ?',
            chatBefore: [],
            chatAfter: [
                { speaker: 'client', text: 'What do you have?' }
            ],
            wordHelp: {
                word: 'What do you have?',
                pronunciation: '',
                hint: 'This is a common question clients ask. It means: "Tell me your options / services."'
            }
        },
        {
            // Round 4: Matching
            type: 'matching',
            roundNum: 4,
            title: '🔗 Match the Service to the Time',
            instruction: 'You need to explain your services. Match each pedicure type to its time.',
            pairs: [
                { left: 'Basic Pedicure', right: '30 minutes' },
                { left: 'Spa Pedicure', right: '40 minutes' },
                { left: 'Deluxe Pedicure', right: '50 minutes' }
            ],
            chatBefore: [],
            chatAfter: [
                { speaker: 'tech', text: 'We have a basic pedicure for 30 minutes, a spa pedicure for 40 minutes, and a deluxe pedicure for 50 minutes.' }
            ],
            wordHelp: {
                word: 'deluxe',
                pronunciation: '/dɪˈlʌks/',
                hint: '(cao cấp) — "Deluxe" means the best / most expensive option.'
            }
        },
        {
            // Round 5: Fill in the blank
            type: 'fill-blank',
            roundNum: 5,
            title: '✏️ Fill in the Blank',
            instruction: 'The client chooses a service. Choose the correct word.',
            sentence: 'I would like the ___ pedicure, please.',
            answer: 'spa',
            choices: ['basic', 'spa', 'deluxe', 'quick'],
            chatBefore: [],
            chatAfter: [
                { speaker: 'client', text: 'I would like the spa pedicure, please.' }
            ],
            wordHelp: {
                word: 'I would like',
                pronunciation: '/aɪ wʊd laɪk/',
                hint: 'A polite way to say "I want." Clients often say: "I would like..." or "I\'d like..."'
            }
        },
        {
            // Round 6: Unscramble
            type: 'unscramble',
            roundNum: 6,
            title: '🔀 Build Your Response',
            instruction: 'Now direct the client to her chair! Put the words in order.',
            words: ['Perfect!', 'Please', 'go', 'to', 'chair', 'number', '2.'],
            answer: 'Perfect! Please go to chair number 2.',
            chatBefore: [],
            chatAfter: [
                { speaker: 'tech', text: 'Perfect! Please go to chair number 2.' }
            ],
            wordHelp: {
                word: 'Perfect!',
                pronunciation: '/ˈpɜːrfɪkt/',
                hint: 'A friendly word to say when something is good. You can use it a lot with clients!'
            }
        }
    ],
    fullDialog: [
        { speaker: 'tech', label: 'Nail Tech', text: 'Hello! Do you have an appointment?' },
        { speaker: 'client', label: 'Client', text: "No, I don't. Can I walk in?" },
        { speaker: 'tech', label: 'Nail Tech', text: 'Yes, of course! Which service would you like?' },
        { speaker: 'client', label: 'Client', text: 'What do you have?' },
        { speaker: 'tech', label: 'Nail Tech', text: 'We have a basic pedicure for 30 minutes, a spa pedicure for 40 minutes, and a deluxe pedicure for 50 minutes.' },
        { speaker: 'client', label: 'Client', text: 'I would like the spa pedicure, please.' },
        { speaker: 'tech', label: 'Nail Tech', text: 'Perfect! Please go to chair number 2.' }
    ]
};

// ========== GAME STATE ==========
let state = {
    currentRound: 0,
    score: 0,
    totalRounds: gameData.rounds.length,
    chatHistory: [],
    matchState: {
        selectedLeft: null,
        selectedRight: null,
        matchedPairs: 0,
        totalPairs: 0
    },
    scrambleState: {
        selectedWords: [],
        availableWords: []
    }
};

// ========== INITIALIZATION ==========
function startGame(role) {
    if (role === 'student') {
        window.location.href = 'student.html';
    }
}

// Auto-initialize if on student page
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('game-area')) {
        initGame();
    }
});

function initGame() {
    state.currentRound = 0;
    state.score = 0;
    state.chatHistory = [];
    updateScore();
    loadRound();
}

// ========== ROUND LOADING ==========
function loadRound() {
    const round = gameData.rounds[state.currentRound];

    // Update progress
    updateProgress();

    // Hide feedback and completion
    hideFeedback();
    document.getElementById('completion-screen').style.display = 'none';

    // Show chat history so far
    if (round.chatBefore.length > 0) {
        round.chatBefore.forEach(msg => {
            if (!state.chatHistory.find(m => m.text === msg.text)) {
                state.chatHistory.push(msg);
            }
        });
    }
    renderChat();

    // Show word help
    showWordHelp(round.wordHelp);

    // Load round by type
    const gameArea = document.getElementById('game-area');

    switch (round.type) {
        case 'fill-blank':
            renderFillBlank(round, gameArea);
            break;
        case 'multiple-choice':
            renderMultipleChoice(round, gameArea);
            break;
        case 'unscramble':
            renderUnscramble(round, gameArea);
            break;
        case 'matching':
            renderMatching(round, gameArea);
            break;
    }
}

// ========== RENDER FUNCTIONS ==========

// --- Fill in the Blank ---
function renderFillBlank(round, container) {
    const parts = round.sentence.split('___');
    container.innerHTML = `
        <div class="round-title">${round.title}</div>
        <div class="round-instruction">${round.instruction}</div>
        <div class="blank-sentence">
            ${parts[0]}<span class="blank" id="blank-slot">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>${parts[1] || ''}
        </div>
        <div class="word-choices" id="word-choices">
            ${round.choices.map(word => `
                <div class="word-choice" onclick="selectFillBlank('${word}', '${round.answer}')">${word}</div>
            `).join('')}
        </div>
        <div class="next-btn-area" id="next-btn-area" style="display:none;">
            <button class="btn btn-primary" onclick="nextRound()">Next →</button>
        </div>
    `;
}

function selectFillBlank(selected, answer) {
    const choices = document.querySelectorAll('.word-choice');
    const blankSlot = document.getElementById('blank-slot');
    const isCorrect = selected.toLowerCase() === answer.toLowerCase();

    choices.forEach(c => {
        c.classList.add('disabled');
        if (c.textContent === answer) {
            c.classList.add('correct');
        }
        if (c.textContent === selected && !isCorrect) {
            c.classList.add('wrong');
        }
    });

    blankSlot.textContent = answer;
    blankSlot.style.borderBottomStyle = 'solid';
    blankSlot.style.borderBottomColor = isCorrect ? '#4caf50' : '#ef5350';

    if (isCorrect) {
        state.score++;
        updateScore();
        showFeedback(true, '');
    } else {
        showFeedback(false, `The correct word is: <strong>${answer}</strong>`);
    }

    addRoundChatMessages();
    document.getElementById('next-btn-area').style.display = 'block';
}

// --- Multiple Choice ---
function renderMultipleChoice(round, container) {
    container.innerHTML = `
        <div class="round-title">${round.title}</div>
        <div class="round-instruction">${round.instruction}</div>
        <div class="choice-options" id="choice-options">
            ${round.choices.map((choice, i) => `
                <div class="choice-option" onclick="selectChoice(this, ${i}, '${encodeURIComponent(round.answer)}')">${choice}</div>
            `).join('')}
        </div>
        <div class="next-btn-area" id="next-btn-area" style="display:none;">
            <button class="btn btn-primary" onclick="nextRound()">Next →</button>
        </div>
    `;
}

function selectChoice(element, index, encodedAnswer) {
    const answer = decodeURIComponent(encodedAnswer);
    const options = document.querySelectorAll('.choice-option');
    const isCorrect = element.textContent === answer;

    options.forEach(opt => {
        opt.classList.add('disabled');
        if (opt.textContent === answer) {
            opt.classList.add('correct');
        }
    });

    if (!isCorrect) {
        element.classList.add('wrong');
    }

    if (isCorrect) {
        state.score++;
        updateScore();
        showFeedback(true, '');
    } else {
        showFeedback(false, `The best response is: <strong>"${answer}"</strong>`);
    }

    addRoundChatMessages();
    document.getElementById('next-btn-area').style.display = 'block';
}

// --- Unscramble ---
function renderUnscramble(round, container) {
    // Shuffle words
    let shuffled = [...round.words];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuff