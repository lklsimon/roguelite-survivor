// ========== 遊戲配置 ==========
const CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,
    PLAYER_SIZE: 30,
    ENEMY_SIZE: 25,
    XP_SIZE: 10,
    XP_ORB_VALUE: 10
};

// ========== 設備檢測 ==========
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let joystickActive = false;
let joystickX = 0;
let joystickY = 0;

// iPad Pro 專用偵測
const isIPadPro = navigator.userAgent.includes('Mac OS X') && navigator.maxTouchPoints > 0;

// ========== 主動技能系統 ==========
// 每個角色的技能選項
const SKILL_OPTIONS = {
    warrior: {
        skill1: [
            { id: 'charge', name: '衝鋒擊', emoji: '🏃', description: '向前衝鋒200px造成傷害', cooldown: 15, damage: 30, range: 200, unlockAt: 3 },
            { id: 'shockwave', name: '破擊震盪', emoji: '💥', description: '原地釋放震盪造成傷害並眩暈2秒', cooldown: 20, damage: 25, range: 150, unlockAt: 3 }
        ],
        skill2: [
            { id: 'defensive', name: '防禦姿態', emoji: '🛡️', description: '3秒內減少50%受到傷害', cooldown: 12, duration: 3, unlockAt: 5 },
            { id: 'frenzy', name: '狂暴戰意', emoji: '😤', description: '5秒內增加100%傷害但減少移動', cooldown: 18, duration: 5, unlockAt: 5 }
        ]
    },
    archer: {
        skill1: [
            { id: 'multiShot', name: '多重射擊', emoji: '🎯', description: '一次性發射5發子彈', cooldown: 12, count: 5, unlockAt: 3 },
            { id: 'pierceArrow', name: '貫穿箭', emoji: '➡️', description: '發射貫穿箭可穿透多個敵人', cooldown: 10, pierce: true, unlockAt: 3 }
        ],
        skill2: [
            { id: 'frostArrow', name: '冰凍箭', emoji: '❄️', description: '發射冰凍箭減緩敵人50%速度3秒', cooldown: 15, slow: 0.5, duration: 3, unlockAt: 5 },
            { id: 'explosiveArrow', name: '爆炸箭', emoji: '💣', description: '發射爆炸箭命中後造成範圍傷害', cooldown: 18, aoeRadius: 80, unlockAt: 5 }
        ]
    },
    mage: {
        skill1: [
            { id: 'fireball', name: '火球術', emoji: '🔥', description: '發射火球造成額外火焰傷害', cooldown: 10, damage: 50, unlockAt: 3 },
            { id: 'freezeWave', name: '冰凍術', emoji: '🌊', description: '釋放冰凍波減緩範圍內敵人速度', cooldown: 14, aoeRadius: 120, slow: 0.2, duration: 3, unlockAt: 3 }
        ],
        skill2: [
            { id: 'lightning', name: '雷擊術', emoji: '⚡', description: '召喚雷擊對單體敵人造成大量傷害', cooldown: 20, damage: 80, unlockAt: 5 },
            { id: 'shield', name: '魔法護盾', emoji: '🔰', description: '創造護盾吸收100點傷害', cooldown: 25, shieldHP: 100, unlockAt: 5 }
        ]
    },
    assassin: {
        skill1: [
            { id: 'dodge', name: '閃避', emoji: '💨', description: '3秒內所有攻擊都閃避', cooldown: 15, duration: 3, unlockAt: 3 },
            { id: 'backstab', name: '背刺', emoji: '🗡️', description: '短距離衝刺造成雙倍傷害', cooldown: 12, damage: 50, range: 80, unlockAt: 3 }
        ],
        skill2: [
            { id: 'poisonBlade', name: '毒刃', emoji: '☠️', description: '10秒內攻擊附帶中毒每秒造成傷害', cooldown: 18, duration: 10, poisonDamage: 5, unlockAt: 5 },
            { id: 'shadowClone', name: '影分身', emoji: '👥', description: '創造分身分身也會自動攻擊', cooldown: 25, duration: 8, unlockAt: 5 }
        ]
    },
    paladin: {
        skill1: [
            { id: 'holyLight', name: '聖光術', emoji: '✨', description: '對前方錐形範圍造成神聖傷害', cooldown: 12, damage: 40, range: 200, unlockAt: 3 },
            { id: 'blessing', name: '祝福', emoji: '💚', description: '即時恢復50HP', cooldown: 10, healAmount: 50, unlockAt: 3 }
        ],
        skill2: [
            { id: 'holyShield', name: '神聖護盾', emoji: '🛡️', description: '創造吸收150點傷害的護盾', cooldown: 22, shieldHP: 150, unlockAt: 5 },
            { id: 'purify', name: '淨化', emoji: '🧹', description: '對範圍內敵人造成傷害', cooldown: 18, aoeRadius: 150, damage: 35, unlockAt: 5 }
        ]
    },
    necromancer: {
        skill1: [
            { id: 'summon', name: '亡者召喚', emoji: '💀', description: '立即召喚2個骷髏', cooldown: 15, summonCount: 2, unlockAt: 3 },
            { id: 'soulBurst', name: '靈魂爆發', emoji: '💥', description: '消耗所有骷髏造成範圍傷害', cooldown: 20, aoeRadius: 150, damage: 60, unlockAt: 3 }
        ],
        skill2: [
            { id: 'resurrect', name: '亡靈復甦', emoji: '✝️', description: '使已死亡的骷髏復活', cooldown: 20, resurrectCount: 3, unlockAt: 5 },
            { id: 'deathGaze', name: '死亡凝視', emoji: '👁️', description: '對前方錐形範圍內敵人造成傷害', cooldown: 18, damage: 45, range: 250, unlockAt: 5 }
        ]
    }
};

let playerSkills = {
    skill1: null,
    skill2: null
};

let skillCooldowns = {
    skill1: 0,
    skill2: 0
};

let activeEffects = [];

// ========== 角色定義 ==========
const CHARACTERS = [
    {
        id: 'warrior',
        name: '戰士',
        emoji: '⚔️',
        color: '#e94560',
        hp: 100,
        speed: 3,
        attackRange: 80,
        attackSpeed: 1,
        damage: 15,
        ability: '勇氣怒火 - 周圍敵人持續受到傷害',
        abilityType: 'passive',
        passiveDamage: 5,
        passiveRange: 120
    },
    {
        id: 'archer',
        name: '弓箭手',
        emoji: '🏹',
        color: '#0f3460',
        hp: 70,
        speed: 4,
        attackRange: 200,
        attackSpeed: 0.8,
        damage: 20,
        ability: '快速射擊 - 攻擊速度提升30%',
        abilityType: 'passive',
        attackSpeedBonus: 0.3
    },
    {
        id: 'mage',
        name: '法師',
        emoji: '🔮',
        color: '#9b59b6',
        hp: 60,
        speed: 3,
        attackRange: 250,
        attackSpeed: 0.6,
        damage: 35,
        ability: '能量爆發 - 每3秒向四周發射5發子彈',
        abilityType: 'passive',
        burstCooldown: 3000,
        burstCount: 5
    },
    {
        id: 'paladin',
        name: '聖騎士',
        emoji: '🛡️',
        color: '#f39c12',
        hp: 120,
        speed: 2.5,
        attackRange: 60,
        attackSpeed: 1.2,
        damage: 12,
        ability: '聖光治癒 - 殺敵時恢復生命',
        abilityType: 'passive',
        healOnKill: 5,
        unlockCondition: '達到等級 10',
        unlockCheck: (saveData) => saveData.maxLevel >= 10
    },
    {
        id: 'assassin',
        name: '刺客',
        emoji: '🗡️',
        color: '#1abc9c',
        hp: 80,
        speed: 5,
        attackRange: 70,
        attackSpeed: 1.5,
        damage: 25,
        ability: '致命一擊 - 20%機率造成雙倍傷害',
        abilityType: 'passive',
        critChance: 0.2,
        critMultiplier: 2,
        unlockCondition: '擊殺 500 隻敵人',
        unlockCheck: (saveData) => saveData.totalKills >= 500
    },
    {
        id: 'necromancer',
        name: '死靈法師',
        emoji: '💀',
        color: '#8e44ad',
        hp: 90,
        speed: 3.5,
        attackRange: 150,
        attackSpeed: 1,
        damage: 18,
        ability: '靈魂召喚 - 殺敵有機率召喚骷髏',
        abilityType: 'passive',
        summonChance: 0.1,
        unlockCondition: '存活 10 分鐘',
        unlockCheck: (saveData) => saveData.maxSurvivalTime >= 600
    }
];

// ========== 升級選項 ==========
const UPGRADES = [
    {
        id: 'damage',
        name: '攻擊力提升',
        icon: '💪',
        description: '增加 20% 傷害',
        apply: (player) => {
            player.damage *= 1.2;
            player.damageUpgraded = (player.damageUpgraded || 0) + 1;
        }
    },
    {
        id: 'attackSpeed',
        name: '攻擊速度提升',
        icon: '⚡',
        description: '增加 15% 攻擊速度',
        apply: (player) => {
            player.attackSpeed *= 1.15;
            player.attackSpeedUpgraded = (player.attackSpeedUpgraded || 0) + 1;
        }
    },
    {
        id: 'maxHP',
        name: '生命值提升',
        icon: '❤️',
        description: '增加 30 最大生命',
        apply: (player) => {
            player.maxHP += 30;
            player.hp = Math.min(player.hp + 30, player.maxHP);
            player.hpUpgraded = (player.hpUpgraded || 0) + 1;
        }
    },
    {
        id: 'speed',
        name: '移動速度提升',
        icon: '👟',
        description: '增加 10% 移動速度',
        apply: (player) => {
            player.speed *= 1.1;
            player.speedUpgraded = (player.speedUpgraded || 0) + 1;
        }
    },
    {
        id: 'attackRange',
        name: '攻擊範圍提升',
        icon: '🎯',
        description: '增加 20% 攻擊範圍',
        apply: (player) => {
            player.attackRange *= 1.2;
            player.attackRangeUpgraded = (player.attackRangeUpgraded || 0) + 1;
        }
    }
];

// ========== 敵人類型 ==========
const ENEMY_TYPES = [
    { name: '史萊姆', color: '#2ecc71', emoji: '🟢', hp: 20, speed: 1.5, damage: 5, xp: 10 },
    { name: '骷髏', color: '#ecf0f1', emoji: '💀', hp: 30, speed: 2, damage: 8, xp: 15 },
    { name: '蝙蝠', color: '#9b59b6', emoji: '🦇', hp: 15, speed: 3, damage: 4, xp: 8 },
    { name: '哥布林', color: '#e74c3c', emoji: '👹', hp: 40, speed: 2.5, damage: 10, xp: 20 },
    { name: '巨型史萊姆', color: '#27ae60', emoji: '🟣', hp: 60, speed: 1, damage: 15, xp: 30, size: 40 }
];

// ========== 成就系統 ==========
const ACHIEVEMENTS = [
    {
        id: 'first_blood',
        name: '初見血',
        icon: '🩸',
        description: '擊殺第一隻敵人',
        condition: (saveData) => saveData.totalKills >= 1
    },
    {
        id: 'killer_100',
        name: '殺手',
        icon: '🔪',
        description: '累積擊殺 100 隻敵人',
        condition: (saveData) => saveData.totalKills >= 100
    },
    {
        id: 'killer_500',
        name: '屠殺者',
        icon: '💀',
        description: '累積擊殺 500 隻敵人',
        condition: (saveData) => saveData.totalKills >= 500
    },
    {
        id: 'killer_1000',
        name: '傳奇殺手',
        icon: '👑',
        description: '累積擊殺 1000 隻敵人',
        condition: (saveData) => saveData.totalKills >= 1000
    },
    {
        id: 'level_5',
        name: '初級冒險者',
        icon: '⭐',
        description: '達到等級 5',
        condition: (saveData) => saveData.maxLevel >= 5
    },
    {
        id: 'level_10',
        name: '中級冒險者',
        icon: '⭐⭐',
        description: '達到等級 10',
        condition: (saveData) => saveData.maxLevel >= 10
    },
    {
        id: 'level_20',
        name: '高級冒險者',
        icon: '⭐⭐⭐',
        description: '達到等級 20',
        condition: (saveData) => saveData.maxLevel >= 20
    },
    {
        id: 'survivor_3min',
        name: '求生者',
        icon: '⏱️',
        description: '存活 3 分鐘',
        condition: (saveData) => saveData.maxSurvivalTime >= 180
    },
    {
        id: 'survivor_10min',
        name: '頑強',
        icon: '💪',
        description: '存活 10 分鐘',
        condition: (saveData) => saveData.maxSurvivalTime >= 600
    },
    {
        id: 'survivor_20min',
        name: '不死鳥',
        icon: '🔥',
        description: '存活 20 分鐘',
        condition: (saveData) => saveData.maxSurvivalTime >= 1200
    },
    {
        id: 'unlock_paladin',
        name: '聖騎士之友',
        icon: '🛡️',
        description: '解鎖聖騎士',
        condition: (saveData) => saveData.unlockedCharacters.includes('paladin')
    },
    {
        id: 'unlock_assassin',
        name: '刺客之盟',
        icon: '🗡️',
        description: '解鎖刺客',
        condition: (saveData) => saveData.unlockedCharacters.includes('assassin')
    },
    {
        id: 'unlock_necromancer',
        name: '死靈法師契約',
        icon: '💀',
        description: '解鎖死靈法師',
        condition: (saveData) => saveData.unlockedCharacters.includes('necromancer')
    }
];

// ========== 遊戲狀態 ==========
let canvas, ctx;
let gameState = 'menu'; // menu, playing, paused, gameover
let selectedCharacter = null;
let currentSaveSlot = null;
let saveSlots = [
    null,
    null,
    null
];

let player = {
    x: CONFIG.CANVAS_WIDTH / 2,
    y: CONFIG.CANVAS_HEIGHT / 2,
    hp: 100,
    maxHP: 100,
    speed: 3,
    damage: 15,
    attackRange: 80,
    attackSpeed: 1,
    xp: 0,
    level: 1,
    xpToNext: 100,
    buffs: {
        damage: null,
        speed: null,
        crit: null
    },
    rerollTokens: 0
};

let enemies = [];
let projectiles = [];
let xpOrbs = [];
let items = [];
let summons = [];
let damageNumbers = [];
let keys = {};
let gameLoop;
let lastTime = 0;
let gameTime = 0;
let killCount = 0;
let lastAttackTime = 0;
let lastBurstTime = 0;
let showDamageNumbers = true;

// ========== 掉落物類型 ==========
const ITEM_TYPES = [
    { id: 'smallPotion', name: '小回血藥', emoji: '🧪', duration: 10, effect: (player) => { player.hp = Math.min(player.hp + 20, player.maxHP); } },
    { id: 'largePotion', name: '大回血藥', emoji: '🍷', duration: 10, effect: (player) => { player.hp = Math.min(player.hp + 50, player.maxHP); } },
    { id: 'damageBuff', name: '攻擊符', emoji: '⚔️', duration: 10, effect: (player) => { player.buffs.damage = { multiplier: 1.5, endTime: gameTime + 10 }; } },
    { id: 'speedBuff', name: '攻速符', emoji: '⚡', duration: 10, effect: (player) => { player.buffs.speed = { multiplier: 1.3, endTime: gameTime + 10 }; } },
    { id: 'critBuff', name: '爆擊符', emoji: '💥', duration: 10, effect: (player) => { player.buffs.crit = { chance: 0.5, endTime: gameTime + 10 }; } },
    { id: 'reroll', name: '刷新符', emoji: '🔄', duration: 10, effect: (player) => { player.rerollTokens = (player.rerollTokens || 0) + 1; } }
];

// ========== 初始化 ==========
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;

    loadSettings();
    loadSaveSlots();
    initVirtualKeyboard();
    initVirtualJoystick();

    // 事件監聽
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        // P鍵暫停
        if (e.key.toLowerCase() === 'p' && gameState === 'playing') {
            pauseGame();
        }
        
        // N鍵發動技能一
        if (e.key.toLowerCase() === 'n' && gameState === 'playing') {
            useSkill(1);
        }
        
        // M鍵發動技能二
        if (e.key.toLowerCase() === 'm' && gameState === 'playing') {
            useSkill(2);
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}

// ========== 存檔系統 ==========
function loadSaveSlots() {
    const saved = localStorage.getItem('roguelite_save_slots');
    if (saved) {
        saveSlots = JSON.parse(saved);
    }
}

function saveAllSlots() {
    localStorage.setItem('roguelite_save_slots', JSON.stringify(saveSlots));
}

function loadSaveData(slotIndex) {
    return saveSlots[slotIndex];
}

function saveGameData() {
    if (currentSaveSlot !== null && currentSaveSlot < saveSlots.length) {
        const saveData = loadSaveData(currentSaveSlot);
        if (saveData) {
            saveData.totalKills += killCount;
            saveData.totalTime += Math.floor(gameTime);
            saveData.maxLevel = Math.max(saveData.maxLevel, player.level);
            saveData.maxSurvivalTime = Math.max(saveData.maxSurvivalTime, Math.floor(gameTime));
            saveData.unlockedCharacters = saveData.unlockedCharacters || [];
            
            // 檢查成就解鎖
            ACHIEVEMENTS.forEach(achievement => {
                if (!saveData.achievements.includes(achievement.id) && achievement.condition(saveData)) {
                    saveData.achievements.push(achievement.id);
                }
            });

            saveSlots[currentSaveSlot] = saveData;
            saveAllSlots();
        }
    }
}

// ========== 界面導航 ==========
function showMainMenu() {
    document.getElementById('save-slots-screen').classList.add('hidden');
    document.getElementById('name-input-screen').classList.add('hidden');
    document.getElementById('character-screen').classList.add('hidden');
    document.getElementById('achievements-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    gameState = 'menu';
}

function showSaveSlots() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('character-screen').classList.add('hidden');
    renderSaveSlots();
    document.getElementById('save-slots-screen').classList.remove('hidden');
}

function renderSaveSlots() {
    const grid = document.getElementById('save-grid');
    grid.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const slot = document.createElement('div');
        const saveData = saveSlots[i];

        if (saveData) {
            slot.className = 'save-slot';
            slot.innerHTML = `
                <div class="save-name">${saveData.name}</div>
                <div class="save-stats">
                    💀 總殺敵: ${saveData.totalKills}<br>
                    ⏱️ 總時長: ${formatTime(saveData.totalTime)}<br>
                    ⭐ 最高等級: ${saveData.maxLevel}<br>
                    🏆 成就: ${saveData.achievements.length}/${ACHIEVEMENTS.length}
                </div>
            `;
            slot.onclick = () => loadSlot(i);
        } else {
            slot.className = 'save-slot empty';
            slot.innerHTML = `
                <div class="save-name">空白存檔 ${i + 1}</div>
                <div class="save-stats">點擊創建新存檔</div>
            `;
            slot.onclick = () => showNameInput(i);
        }

        grid.appendChild(slot);
    }
}

function loadSlot(slotIndex) {
    currentSaveSlot = slotIndex;
    document.getElementById('save-slots-screen').classList.add('hidden');
    showCharacterScreen();
}

function showNameInput(slotIndex) {
    currentSaveSlot = slotIndex;
    document.getElementById('name-input').value = '';
    document.getElementById('save-slots-screen').classList.add('hidden');
    document.getElementById('name-input-screen').classList.remove('hidden');
}

function confirmName() {
    const name = document.getElementById('name-input').value.trim();
    if (!name) {
        alert('請輸入名字！');
        return;
    }

    // 創建新存檔
    saveSlots[currentSaveSlot] = {
        name: name,
        totalKills: 0,
        totalTime: 0,
        maxLevel: 0,
        maxSurvivalTime: 0,
        unlockedCharacters: ['warrior', 'archer', 'mage'],
        achievements: []
    };
    saveAllSlots();

    loadSlot(currentSaveSlot);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========== 虛擬鍵盤 ==========
function initVirtualKeyboard() {
    const keyboard = document.getElementById('virtual-keyboard');
    const keysLayout = [
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
        'Z', 'X', 'C', 'V', 'B', 'N', 'M'
    ];

    keyboard.innerHTML = '';

    keysLayout.forEach(key => {
        const keyBtn = document.createElement('div');
        keyBtn.className = 'keyboard-key';
        keyBtn.textContent = key;
        keyBtn.onclick = () => addKeyToInput(key);
        keyboard.appendChild(keyBtn);
    });

    // 添加特殊按鍵
    const spaceBtn = document.createElement('div');
    spaceBtn.className = 'keyboard-key special';
    spaceBtn.textContent = '空白';
    spaceBtn.style.gridColumn = 'span 5';
    spaceBtn.onclick = () => addKeyToInput(' ');
    keyboard.appendChild(spaceBtn);

    const backspaceBtn = document.createElement('div');
    backspaceBtn.className = 'keyboard-key special';
    backspaceBtn.textContent = '刪除';
    backspaceBtn.style.gridColumn = 'span 5';
    backspaceBtn.onclick = () => removeLastKey();
    keyboard.appendChild(backspaceBtn);
}

function addKeyToInput(key) {
    const input = document.getElementById('name-input');
    if (input.value.length < 12) {
        input.value += key;
    }
}

function removeLastKey() {
    const input = document.getElementById('name-input');
    input.value = input.value.slice(0, -1);
}

function initVirtualJoystick() {
    const joystick = document.getElementById('virtual-joystick');
    const joystickBase = document.getElementById('joystick-base');
    const joystickStick = document.getElementById('joystick-stick');

    // 確保在觸控設備上顯示（包括 iPad Pro）
    const isActuallyTouchDevice = isTouchDevice || isIPadPro;
    if (!isActuallyTouchDevice) {
        joystick.classList.add('hidden');
        return;
    }

    joystick.classList.remove('hidden');

    // iPad Pro 使用全局觸控事件
    let touchId = null;
    let joystickRect = null;
    const baseRadius = 60;
    const stickRadius = 25;

    const getJoystickCenter = () => {
        joystickRect = joystickBase.getBoundingClientRect();
        return {
            x: joystickRect.left + joystickRect.width / 2,
            y: joystickRect.top + joystickRect.height / 2
        };
    };

    // 使用全局 touchstart 事件監聽
    document.addEventListener('touchstart', (e) => {
        // 檢查是否有觸控點在 joystick 範圍內
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const rect = joystickBase.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(touch.clientX - centerX, 2) +
                Math.pow(touch.clientY - centerY, 2)
            );

            if (distance < baseRadius && touchId === null) {
                touchId = touch.identifier;
                joystickActive = true;
                e.preventDefault();
                break;
            }
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!joystickActive || touchId === null) return;

        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === touchId) {
                const touch = e.changedTouches[i];
                const rect = joystickBase.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                let deltaX = touch.clientX - centerX;
                let deltaY = touch.clientY - centerY;

                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = baseRadius - stickRadius;

                if (distance > maxDistance) {
                    const angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                joystickStick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

                // 歸一化輸出值 (-1 到 1)
                joystickX = deltaX / maxDistance;
                joystickY = deltaY / maxDistance;

                e.preventDefault();
                break;
            }
        }
    }, { passive: false });

    const endTouch = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === touchId) {
                touchId = null;
                joystickActive = false;
                joystickX = 0;
                joystickY = 0;
                joystickStick.style.transform = 'translate(0px, 0px)';
                break;
            }
        }
    };

    document.addEventListener('touchend', endTouch);
    document.addEventListener('touchcancel', endTouch);
}

// ========== 角色選擇界面 ==========
function showCharacterScreen() {
    document.getElementById('name-input-screen').classList.add('hidden');
    document.getElementById('achievements-screen').classList.add('hidden');
    renderCharacterGrid();
    updateCharacterStatsDisplay();
    document.getElementById('character-screen').classList.remove('hidden');
}

function renderCharacterGrid() {
    const grid = document.getElementById('character-grid');
    grid.innerHTML = '';

    const saveData = loadSaveData(currentSaveSlot);

    CHARACTERS.forEach(char => {
        const isUnlocked = saveData.unlockedCharacters.includes(char.id);
        const card = document.createElement('div');
        card.className = `character-card ${isUnlocked ? '' : 'locked'}`;
        card.dataset.characterId = char.id;

        if (isUnlocked) {
            card.onclick = () => selectCharacter(char);
            card.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 10px;">${char.emoji}</div>
                <div class="character-name">${char.name}</div>
                <div class="character-ability">${char.ability}</div>
                <div class="character-stats">
                    ❤️ HP: ${char.hp}<br>
                    ⚡ 速度: ${char.speed}<br>
                    💪 傷害: ${char.damage}
                </div>
                <button class="skill-select-btn" onclick="event.stopPropagation(); showSkillSelection('${char.id}')">
                    🎯 選擇技能
                </button>
            `;
        } else {
            card.innerHTML = `
                <div class="lock-icon">🔒</div>
                <div class="character-name">${char.name}</div>
                <div class="unlock-condition">${char.unlockCondition}</div>
            `;
        }

        grid.appendChild(card);
    });
}

function updateCharacterStatsDisplay() {
    const saveData = loadSaveData(currentSaveSlot);
    document.getElementById('total-kills-display').textContent = saveData.totalKills;
    document.getElementById('total-time-display').textContent = formatTime(saveData.totalTime);
}

function selectCharacter(character) {
    selectedCharacter = character;
    document.querySelectorAll('.character-card').forEach(card => {
        card.style.borderColor = card.dataset.characterId === character.id ? '#e94560' : '#0f3460';
    });
}

// ========== 成就系統 ==========
function showAchievements() {
    document.getElementById('character-screen').classList.add('hidden');
    renderAchievements();
    document.getElementById('achievements-screen').classList.remove('hidden');
}

function hideAchievements() {
    document.getElementById('achievements-screen').classList.add('hidden');
    document.getElementById('character-screen').classList.remove('hidden');
}

function showSettings() {
    document.getElementById('character-screen').classList.add('hidden');
    document.getElementById('show-damage-numbers').checked = showDamageNumbers;
    document.getElementById('settings-screen').classList.remove('hidden');
}

function hideSettings() {
    document.getElementById('settings-screen').classList.add('hidden');
    document.getElementById('character-screen').classList.remove('hidden');
}

function saveSettings() {
    showDamageNumbers = document.getElementById('show-damage-numbers').checked;
    localStorage.setItem('roguelite_settings', JSON.stringify({
        showDamageNumbers: showDamageNumbers
    }));
}

function loadSettings() {
    const saved = localStorage.getItem('roguelite_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        showDamageNumbers = settings.showDamageNumbers !== undefined ? settings.showDamageNumbers : true;
    }
}

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    const saveData = loadSaveData(currentSaveSlot);

    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = saveData.achievements.includes(achievement.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;

        grid.appendChild(card);
    });
}

// ========== 遊戲開始 ==========
function startGame() {
    if (!selectedCharacter) {
        alert('請先選擇一個角色！');
        return;
    }

    // 初始化玩家 - 使用深拷贝避免修改原始角色数据
    player = {
        ...JSON.parse(JSON.stringify(selectedCharacter)),
        x: CONFIG.CANVAS_WIDTH / 2,
        y: CONFIG.CANVAS_HEIGHT / 2,
        xp: 0,
        level: 1,
        xpToNext: 100,
        maxHP: selectedCharacter.hp
    };

    // 重置遊戲狀態
    enemies = [];
    projectiles = [];
    xpOrbs = [];
    items = [];
    summons = [];
    gameTime = 0;
    killCount = 0;
    lastAttackTime = 0;
    lastBurstTime = 0;
    damageNumbers = [];
    activeEffects = [];
    player.buffs = {
        damage: null,
        speed: null,
        crit: null
    };
    player.rerollTokens = 0;

    // 加載角色技能
    loadCharacterSkills(selectedCharacter.id);

    // 隱藏升級選單（如果存在）
    const upgradeMenu = document.getElementById('upgrade-menu');
    if (upgradeMenu) {
        upgradeMenu.classList.add('hidden');
    }

    // 切換界面
    document.getElementById('character-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('hud').style.display = 'block';
    gameState = 'playing';

    // 初始化升級列表
    updateUpgradesList();

    // 更新技能按鈕
    updateSkillButtons();

    // 開始遊戲循環
    lastTime = performance.now();
    gameLoop = requestAnimationFrame(update);
}

// ========== 暫停功能 ==========
function pauseGame() {
    gameState = 'paused';
    document.getElementById('pause-menu').classList.remove('hidden');
}

function resumeGame() {
    document.getElementById('pause-menu').classList.add('hidden');
    gameState = 'playing';
    lastTime = performance.now();
}

function returnToCharacterScreen() {
    gameState = 'menu';
    cancelAnimationFrame(gameLoop);
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').style.display = 'none';
    showCharacterScreen();
}

// ========== 遊戲主循環 ==========
function update(currentTime) {
    // 如果遊戲暫停或結束，繼續請求下一幀但不更新遊戲邏輯
    if (gameState !== 'playing') {
        gameLoop = requestAnimationFrame(update);
        return;
    }

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    gameTime += deltaTime;

    // 更新遊戲邏輯
    updatePlayer(deltaTime);
    updateEnemies(deltaTime);
    updateProjectiles(deltaTime);
    updateXPOrbs();
    updateItems();
    updateSummons(deltaTime);
    updateDamageNumbers(deltaTime);
    updateSkillCooldowns(deltaTime);
    updateActiveEffects(deltaTime);
    updateSkillButtons();
    spawnEnemies();
    checkLevelUp();

    // 渲染
    render();

    // 更新 HUD
    updateHUD();

    gameLoop = requestAnimationFrame(update);
}

// ========== 玩家更新 ==========
function updatePlayer(deltaTime) {
    let dx = 0, dy = 0;

    // 鍵盤控制
    if (!joystickActive) {
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        // 正規化移動向量
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }
    } else {
        // Joystick 控制
        dx = joystickX;
        dy = joystickY;
    }

    // 狂暴戰意效果 - 減少移動速度
    let speedMultiplier = 1;
    const frenzyEffect = activeEffects.find(e => e.type === 'frenzy');
    if (frenzyEffect && frenzyEffect.endTime > gameTime) {
        speedMultiplier = frenzyEffect.speedMultiplier;
    }

    // 使用 deltaTime 以保持恒定速度
    player.x += dx * player.speed * speedMultiplier * deltaTime * 60;
    player.y += dy * player.speed * speedMultiplier * deltaTime * 60;

    // 邊界限制
    player.x = Math.max(CONFIG.PLAYER_SIZE, Math.min(CONFIG.CANVAS_WIDTH - CONFIG.PLAYER_SIZE, player.x));
    player.y = Math.max(CONFIG.PLAYER_SIZE, Math.min(CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_SIZE, player.y));

    // 自動攻擊
    let effectiveAttackSpeed = player.attackSpeed;

    // 弓箭手攻擊速度加成
    if (player.id === 'archer') {
        effectiveAttackSpeed *= (1 + (player.attackSpeedBonus || 0));
    }

    // 攻速符
    if (player.buffs.speed && player.buffs.speed.endTime > gameTime) {
        effectiveAttackSpeed *= player.buffs.speed.multiplier;
    }

    if (performance.now() - lastAttackTime > (1 / effectiveAttackSpeed) * 1000) {
        autoAttack();
        lastAttackTime = performance.now();
    }

    // 被動技能效果
    applyPassiveSkills();
}

function autoAttack() {
    // 尋找最近的敵人
    let nearestEnemy = null;
    let minDist = player.attackRange;

    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < minDist) {
            minDist = dist;
            nearestEnemy = enemy;
        }
    });

    if (nearestEnemy) {
        createProjectile(player, nearestEnemy);
    }
}

function createProjectile(from, to) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    let damage = player.damage;
    let isCrit = false;

    // 傷害符
    if (player.buffs.damage && player.buffs.damage.endTime > gameTime) {
        damage *= player.buffs.damage.multiplier;
    }

    // 狂暴戰意
    const frenzyEffect = activeEffects.find(e => e.type === 'frenzy');
    if (frenzyEffect && frenzyEffect.endTime > gameTime) {
        damage *= frenzyEffect.damageMultiplier;
    }

    // 刺客暴擊
    if (player.id === 'assassin' && Math.random() < (player.critChance || 0)) {
        damage *= (player.critMultiplier || 2);
        isCrit = true;
    }

    // 爆擊符
    if (player.buffs.crit && player.buffs.crit.endTime > gameTime && Math.random() < player.buffs.crit.chance) {
        damage *= 2;
        isCrit = true;
    }

    projectiles.push({
        x: from.x,
        y: from.y,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
        damage: damage,
        owner: 'player',
        crit: isCrit
    });
}

function applyPassiveSkills() {
    // 法師的能量爆發 - 每3秒向四周發射5發子彈
    if (player.id === 'mage') {
        const cooldown = player.burstCooldown || 3000;
        const burstCount = player.burstCount || 5;

        if (performance.now() - lastBurstTime > cooldown) {
            // 找到最近的敵人
            let nearestEnemy = null;
            let minDist = Infinity;

            enemies.forEach(enemy => {
                const dist = getDistance(player, enemy);
                if (dist < minDist && enemy.hp > 0) {
                    minDist = dist;
                    nearestEnemy = enemy;
                }
            });

            // 計算指向最近敵人的角度
            let baseAngle = 0;
            if (nearestEnemy) {
                baseAngle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
            }

            // 向四周發射子彈，其中一發指向最近敵人
            for (let i = 0; i < burstCount; i++) {
                const angle = baseAngle + (Math.PI * 2 / burstCount) * i;
                const damage = player.damage;

                projectiles.push({
                    x: player.x,
                    y: player.y,
                    vx: Math.cos(angle) * 6,
                    vy: Math.sin(angle) * 6,
                    damage: damage,
                    owner: 'player',
                    crit: false
                });
            }
            lastBurstTime = performance.now();
        }
    }

    // 戰士的勇氣怒火 - 周圍敵人持續受到傷害
    if (player.id === 'warrior') {
        const range = player.passiveRange || 120;
        const damagePerSecond = player.passiveDamage || 5;

        enemies.forEach(enemy => {
            const dist = getDistance(player, enemy);

            if (dist < range && enemy.hp > 0) {
                // 每幀造成的傷害 = 每秒傷害 / 60 (假設 60fps)
                enemy.hp -= damagePerSecond / 60;

                // 如果敵人死亡，立即掉落 XP 並標記為已處理
                if (enemy.hp <= 0 && !enemy.passiveKilled) {
                    enemy.passiveKilled = true;
                    xpOrbs.push({
                        x: enemy.x,
                        y: enemy.y,
                        value: enemy.xp
                    });
                    killCount++;

                    // 聖騎士治癒
                    if (player.id === 'paladin') {
                        player.hp = Math.min(player.hp + (player.healOnKill || 5), player.maxHP);
                    }

                    // 死靈法師召喚
                    if (player.id === 'necromancer' && Math.random() < (player.summonChance || 0)) {
                        createSummon(enemy.x, enemy.y, false);
                    }
                }
            }
        });
    }
}

// ========== 敵人系統 ==========
function spawnEnemies() {
    const spawnRate = Math.max(0.5, 2 - gameTime / 300);
    const maxEnemies = Math.min(100, 10 + Math.floor(gameTime / 20));

    if (enemies.length < maxEnemies && Math.random() < spawnRate * 0.016) {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        // 根據遊戲時間選擇敵人類型
        const typeIndex = Math.min(
            Math.floor(gameTime / 60),
            ENEMY_TYPES.length - 1
        );
        const type = ENEMY_TYPES[Math.floor(Math.random() * (typeIndex + 1))];
        const spawnSize = type.size || CONFIG.ENEMY_SIZE;

        switch (side) {
            case 0: x = Math.random() * CONFIG.CANVAS_WIDTH; y = -spawnSize; break;
            case 1: x = CONFIG.CANVAS_WIDTH + spawnSize; y = Math.random() * CONFIG.CANVAS_HEIGHT; break;
            case 2: x = Math.random() * CONFIG.CANVAS_WIDTH; y = CONFIG.CANVAS_HEIGHT + spawnSize; break;
            case 3: x = -spawnSize; y = Math.random() * CONFIG.CANVAS_HEIGHT; break;
        }

        enemies.push({
            x, y,
            hp: type.hp * (1 + gameTime / 600),
            maxHP: type.hp * (1 + gameTime / 600),
            speed: type.speed,
            damage: type.damage,
            color: type.color,
            name: type.name,
            emoji: type.emoji,
            xp: type.xp,
            size: type.size || CONFIG.ENEMY_SIZE
        });
    }
}

function updateEnemies(deltaTime) {
    enemies = enemies.filter(enemy => {
        // 移除已死亡的敵人（被動技能已經處理過的）
        if (enemy.hp <= 0) return false;

        // 檢查減速效果
        let speedMultiplier = 1;
        if (enemy.slowed && enemy.slowEndTime > gameTime) {
            speedMultiplier = enemy.slowMultiplier || 0.5;
        } else {
            enemy.slowed = false;
        }

        // 移動朝向玩家（使用 deltaTime 以保持恒定速度）
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed * speedMultiplier * deltaTime * 60;
        enemy.y += Math.sin(angle) * enemy.speed * speedMultiplier * deltaTime * 60;

        // 碰撞檢測 - 玩家
        const enemySize = enemy.size || CONFIG.ENEMY_SIZE;
        if (getDistance(enemy, player) < CONFIG.PLAYER_SIZE / 2 + enemySize / 2) {
            let damage = enemy.damage;
            
            // 檢查防禦姿態
            const defensiveEffect = activeEffects.find(e => e.type === 'defensive');
            if (defensiveEffect) {
                damage *= (1 - defensiveEffect.damageReduction);
            }
            
            // 檢查護盾
            if (player.shieldHP && player.shieldHP > 0) {
                if (player.shieldHP >= damage) {
                    player.shieldHP -= damage;
                    damage = 0;
                } else {
                    damage -= player.shieldHP;
                    player.shieldHP = 0;
                }
            }
            
            // 檢查閃避
            const dodgeEffect = activeEffects.find(e => e.type === 'dodge');
            if (dodgeEffect) {
                damage = 0;
                showDamageNumber(player.x, player.y - 30, '閃避!', false);
            }
            
            player.hp -= damage;
            if (player.hp <= 0) {
                gameOver();
            }
            // 碰撞後彈開
            const bounceAngle = angle + Math.PI;
            enemy.x += Math.cos(bounceAngle) * 30;
            enemy.y += Math.sin(bounceAngle) * 30;
        }

        // 碰撞檢測 - 召喚物
        let enemyKilledBySummon = false;
        summons.forEach(summon => {
            if (enemyKilledBySummon) return; // 如果敵人已經被殺，跳過後續召喚物
            const enemySize = enemy.size || CONFIG.ENEMY_SIZE;
            if (getDistance(enemy, summon) < 15 + enemySize / 2) {
                enemy.hp -= 10;

                // 顯示傷害數值
                showDamageNumber(enemy.x, enemy.y - 20, 10, false);

                // 檢查敵人是否被召喚物擊殺
                if (enemy.hp <= 0 && !enemy.passiveKilled) {
                    enemy.passiveKilled = true;
                    enemyKilledBySummon = true;
                    xpOrbs.push({
                        x: enemy.x,
                        y: enemy.y,
                        value: enemy.xp
                    });
                    killCount++;

                    // 聖騎士治癒
                    if (player.id === 'paladin') {
                        player.hp = Math.min(player.hp + (player.healOnKill || 5), player.maxHP);
                    }

                    // 死靈法師召喚（骷髏擊殺敵人後不觸發）
                    if (player.id === 'necromancer' && Math.random() < (player.summonChance || 0) && !summon.fromSummon) {
                        createSummon(enemy.x, enemy.y, true);
                    }
                }
            }
        });

        // 毒刃效果
        const poisonEffect = activeEffects.find(e => e.type === 'poisonBlade');
        if (poisonEffect) {
            enemy.hp -= poisonEffect.poisonDamage / 60;
            if (enemy.hp <= 0 && !enemy.passiveKilled) {
                enemy.passiveKilled = true;
                xpOrbs.push({
                    x: enemy.x,
                    y: enemy.y,
                    value: enemy.xp
                });
                killCount++;
            }
        }

        return true;
    });
}

// ========== 子彈系統 ==========
function updateProjectiles(deltaTime) {
    projectiles = projectiles.filter(proj => {
        // 使用 deltaTime 以保持恒定速度
        proj.x += proj.vx * deltaTime * 60;
        proj.y += proj.vy * deltaTime * 60;

        // 檢查是否超出邊界
        if (proj.x < 0 || proj.x > CONFIG.CANVAS_WIDTH ||
            proj.y < 0 || proj.y > CONFIG.CANVAS_HEIGHT) {
            return false;
        }

        // 碰撞檢測
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const enemySize = enemy.size || CONFIG.ENEMY_SIZE;
            if (getDistance(proj, enemy) < enemySize) {
                enemy.hp -= proj.damage;

                // 顯示傷害數值
                showDamageNumber(enemy.x, enemy.y - 20, proj.damage, proj.crit);

                // 冰凍箭效果
                if (proj.slow) {
                    enemy.slowed = true;
                    enemy.slowEndTime = gameTime + proj.slowDuration;
                    enemy.slowMultiplier = proj.slow; // 保存減速比例
                    // 添加結冰特效，並關聯到敵人
                    const frostEffect = {
                        type: 'frost',
                        enemy: enemy,
                        time: 0,
                        duration: 0.8
                    };
                    activeEffects.push(frostEffect);
                    enemy.frostEffect = frostEffect; // 保存特效引用
                }

                // 爆炸箭效果
                if (proj.explosive) {
                    const aoeRadius = proj.aoeRadius || 80;
                    // 添加爆炸特效
                    activeEffects.push({
                        type: 'explosion',
                        x: enemy.x,
                        y: enemy.y,
                        radius: 0,
                        maxRadius: aoeRadius,
                        time: 0,
                        duration: 0.5
                    });
                    enemies.forEach(e => {
                        if (e !== enemy && getDistance(enemy, e) < aoeRadius) {
                            e.hp -= proj.damage * 0.5;
                            showDamageNumber(e.x, e.y - 20, proj.damage * 0.5, false);
                            if (e.hp <= 0) {
                                killEnemy(enemies.indexOf(e));
                            }
                        }
                    });
                }

                // 火球效果
                if (proj.fireball) {
                    const aoeRadius = 60;
                    // 添加火球爆炸特效
                    activeEffects.push({
                        type: 'fireballExplosion',
                        x: enemy.x,
                        y: enemy.y,
                        radius: 0,
                        maxRadius: aoeRadius,
                        time: 0,
                        duration: 0.6
                    });
                    enemies.forEach(e => {
                        if (e !== enemy && getDistance(enemy, e) < aoeRadius) {
                            e.hp -= proj.damage * 0.3;
                            showDamageNumber(e.x, e.y - 20, proj.damage * 0.3, false);
                            if (e.hp <= 0) {
                                killEnemy(enemies.indexOf(e));
                            }
                        }
                    });
                }

                if (enemy.hp <= 0) {
                    killEnemy(i);
                }

                // 貫穿箭不消失
                if (proj.pierce) {
                    continue;
                }
                return false;
            }
        }

        return true;
    });
}

// ========== 召喚物系統 ==========
function updateSummons(deltaTime) {
    summons = summons.filter(summon => {
        const lifetime = 15000;
        const age = performance.now() - summon.spawnTime;

        if (age > lifetime) return false;

        // 尋找最近的敵人
        let nearestEnemy = null;
        let minDist = 200;

        enemies.forEach(enemy => {
            const dist = getDistance(summon, enemy);
            if (dist < minDist) {
                minDist = dist;
                nearestEnemy = enemy;
            }
        });

        if (nearestEnemy) {
            const angle = Math.atan2(nearestEnemy.y - summon.y, nearestEnemy.x - summon.x);
            // 使用 deltaTime 以保持恒定速度
            summon.x += Math.cos(angle) * 2 * deltaTime * 60;
            summon.y += Math.sin(angle) * 2 * deltaTime * 60;
        }

        return true;
    });
}

function createSummon(x, y, fromSummon = false) {
    summons.push({
        x, y,
        spawnTime: performance.now(),
        fromSummon: fromSummon
    });
}

// ========== 經驗值系統 ==========
function killEnemy(index) {
    const enemy = enemies[index];
    xpOrbs.push({
        x: enemy.x,
        y: enemy.y,
        value: enemy.xp
    });
    killCount++;

    // 聖騎士治癒
    if (player.id === 'paladin') {
        player.hp = Math.min(player.hp + (player.healOnKill || 5), player.maxHP);
    }

    // 死靈法師召喚
    if (player.id === 'necromancer' && Math.random() < (player.summonChance || 0)) {
        createSummon(enemy.x, enemy.y, false);
    }

    // 隨機掉落物品 (20% 機率)
    if (Math.random() < 0.2) {
        const randomIndex = Math.floor(Math.random() * ITEM_TYPES.length);
        const itemType = ITEM_TYPES[randomIndex];
        items.push({
            x: enemy.x,
            y: enemy.y,
            type: itemType,
            spawnTime: performance.now()
        });
    }
}

// 顯示傷害數值
function showDamageNumber(x, y, damage, isCrit) {
    if (!showDamageNumbers) return;
    damageNumbers.push({
        x,
        y,
        damage: typeof damage === 'number' ? Math.floor(damage) : damage,
        isCrit,
        opacity: 1,
        velocityY: -1
    });
}

// 更新傷害數值顯示
function updateDamageNumbers(deltaTime) {
    damageNumbers = damageNumbers.filter(d => {
        d.y += d.velocityY * deltaTime * 60;
        d.opacity -= deltaTime * 60 / 60;
        return d.opacity > 0;
    });
}

function updateXPOrbs() {
    xpOrbs = xpOrbs.filter(orb => {
        const dist = getDistance(player, orb);

        if (dist < 50) {
            const angle = Math.atan2(player.y - orb.y, player.x - orb.x);
            orb.x += Math.cos(angle) * 5;
            orb.y += Math.sin(angle) * 5;
        }

        if (dist < CONFIG.PLAYER_SIZE) {
            player.xp += orb.value;
            return false;
        }

        return true;
    });
}

function updateItems() {
    items = items.filter(item => {
        const age = (performance.now() - item.spawnTime) / 1000;

        // 超過6秒後消失
        if (age > 6) return false;

        const dist = getDistance(player, item);

        if (dist < 50) {
            const angle = Math.atan2(player.y - item.y, player.x - item.x);
            item.x += Math.cos(angle) * 5;
            item.y += Math.sin(angle) * 5;
        }

        if (dist < CONFIG.PLAYER_SIZE) {
            // 應用物品效果
            item.type.effect(player);
            showDamageNumber(item.x, item.y - 20, item.type.name, false);
            return false;
        }

        return true;
    });
}

function checkLevelUp() {
    if (player.xp >= player.xpToNext) {
        player.xp -= player.xpToNext;
        player.level++;
        player.xpToNext = Math.floor(player.xpToNext * 1.5);

        // 顯示升級選單
        showUpgradeMenu();
    }
}

// ========== 升級選單 ==========
function showUpgradeMenu() {
    // 確保遊戲狀態正確
    if (gameState !== 'playing') return;

    gameState = 'paused';
    const menu = document.getElementById('upgrade-menu');
    const options = document.getElementById('upgrade-options');
    const rerollButton = document.getElementById('reroll-button');
    const rerollCount = document.getElementById('reroll-count');

    // 清空選項容器
    options.innerHTML = '';

    // 隨機選擇 3 個升級選項
    const shuffled = [...UPGRADES].sort(() => Math.random() - 0.5);
    const choices = shuffled.slice(0, 3);

    const renderUpgrades = () => {
        options.innerHTML = '';
        choices.forEach(upgrade => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            const level = player[upgrade.id + 'Upgraded'] || 0;
            card.innerHTML = `
                <div class="upgrade-icon">${upgrade.icon}</div>
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-desc">${upgrade.description}</div>
                <div class="upgrade-level">等級: ${level}</div>
            `;
            card.onclick = () => {
                upgrade.apply(player);
                menu.classList.add('hidden');
                gameState = 'playing';
                lastTime = performance.now(); // 重置時間，避免 deltaTime 過大
                // 更新左側升級列表
                updateUpgradesList();
            };
            options.appendChild(card);
        });
    };

    renderUpgrades();

    // 更新刷新按鈕顯示
    rerollCount.textContent = player.rerollTokens || 0;
    if (player.rerollTokens > 0) {
        rerollButton.style.display = 'inline-block';
        rerollButton.onclick = () => {
            if (player.rerollTokens > 0) {
                player.rerollTokens--;
                rerollCount.textContent = player.rerollTokens;
                // 重新洗牌
                const newShuffled = [...UPGRADES].sort(() => Math.random() - 0.5);
                const newChoices = newShuffled.slice(0, 3);
                // 替換choices內容
                choices.length = 0;
                choices.push(...newChoices);
                renderUpgrades();
            }
        };
    } else {
        rerollButton.style.display = 'none';
    }

    // 顯示升級選單
    menu.classList.remove('hidden');
}

// ========== 更新升級列表 ==========
function updateUpgradesList() {
    const container = document.getElementById('upgrades-items');
    if (!container) return;

    container.innerHTML = '';

    // 獲取所有已升級的項目
    UPGRADES.forEach(upgrade => {
        // 根據 upgrade.id 獲取對應的升級次數
        let level = 0;
        switch (upgrade.id) {
            case 'maxHP':
                level = player.hpUpgraded || 0;
                break;
            case 'damage':
                level = player.damageUpgraded || 0;
                break;
            case 'attackSpeed':
                level = player.attackSpeedUpgraded || 0;
                break;
            case 'speed':
                level = player.speedUpgraded || 0;
                break;
            case 'attackRange':
                level = player.attackRangeUpgraded || 0;
                break;
            default:
                level = 0;
        }

        if (level > 0) {
            const item = document.createElement('div');
            item.className = 'upgrade-item';
            // 治療項目顯示次數，其他顯示LV
            const displayText = upgrade.id === 'healing' ? `${level}次` : `LV.${level}`;
            item.innerHTML = `
                <span class="upgrade-item-icon">${upgrade.icon}</span>
                <span class="upgrade-item-level">${displayText}</span>
            `;
            container.appendChild(item);
        }
    });

    // 如果沒有升級，顯示提示
    if (container.children.length === 0) {
        container.innerHTML = '<div style="color: #6a7b8a; font-size: 10px; text-align: center;">尚未升級</div>';
    }
}

// ========== 渲染 ==========
function render() {
    // 清空畫布
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // 繪製網格
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CONFIG.CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CONFIG.CANVAS_WIDTH, y);
        ctx.stroke();
    }

    // 繪製技能效果
    renderActiveEffects();

    // 繪製召喚物
    summons.forEach(summon => {
        ctx.fillStyle = '#8e44ad';
        ctx.beginPath();
        ctx.arc(summon.x, summon.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💀', summon.x, summon.y);
    });

    // 繪製 XP 球
    xpOrbs.forEach(orb => {
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, CONFIG.XP_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✨', orb.x, orb.y);
    });

    // 繪製掉落物
    items.forEach(item => {
        const age = (performance.now() - item.spawnTime) / 1000;
        const opacity = Math.max(0, 1 - age / 6);

        // 閃爍效果（剩餘時間少於2秒時）
        if (age > 4 && Math.floor(age * 4) % 2 === 0) {
            return;
        }

        ctx.globalAlpha = opacity;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.type.emoji, item.x, item.y);
        ctx.globalAlpha = 1;
    });

    // 繪製敵人
    enemies.forEach(enemy => {
        const enemySize = enemy.size || CONFIG.ENEMY_SIZE;
        // 血條
        const hpPercent = enemy.hp / enemy.maxHP;
        ctx.fillStyle = '#333';
        ctx.fillRect(enemy.x - 20, enemy.y - enemySize / 2 - 10, 40, 5);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(enemy.x - 20, enemy.y - enemySize / 2 - 10, 40 * hpPercent, 5);

        // 減速效果標示
        if (enemy.slowed && enemy.slowEndTime > gameTime) {
            ctx.fillStyle = 'rgba(173, 216, 230, 0.3)';
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemySize / 2 + 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 敵人emoji
        if (enemy.emoji) {
            const fontSize = Math.floor(enemySize * 0.96);
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(enemy.emoji, enemy.x, enemy.y);
        }
    });

    // 繪製子彈
    projectiles.forEach(proj => {
        ctx.fillStyle = proj.crit ? '#f39c12' : '#e94560';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // 戰士勇氣怒火範圍指示器（先繪製，避免遮蓋玩家）
    if (player.id === 'warrior') {
        const range = player.passiveRange || 120;
        // 繪製半透明圓形區域
        ctx.fillStyle = 'rgba(233, 69, 96, 0.1)';
        ctx.beginPath();
        ctx.arc(player.x, player.y, range, 0, Math.PI * 2);
        ctx.fill();

        // 繪製邊框
        ctx.strokeStyle = 'rgba(233, 69, 96, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(player.x, player.y, range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // 繪製玩家
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, CONFIG.PLAYER_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // 玩家頭像（居中對齊）
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedCharacter.emoji, player.x, player.y);

    // 防禦姿態效果
    const defensiveEffect = activeEffects.find(e => e.type === 'defensive');
    if (defensiveEffect) {
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, CONFIG.PLAYER_SIZE / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 閃避效果
    const dodgeEffect = activeEffects.find(e => e.type === 'dodge');
    if (dodgeEffect) {
        ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, CONFIG.PLAYER_SIZE / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 狂暴戰意效果
    const frenzyEffect = activeEffects.find(e => e.type === 'frenzy');
    if (frenzyEffect) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, CONFIG.PLAYER_SIZE / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 毒刃效果
    const poisonEffect = activeEffects.find(e => e.type === 'poisonBlade');
    if (poisonEffect) {
        ctx.strokeStyle = 'rgba(128, 0, 128, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, CONFIG.PLAYER_SIZE / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 重置文字對齊屬性
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // 繪製傷害數值
    damageNumbers.forEach(d => {
        ctx.globalAlpha = d.opacity;
        ctx.fillStyle = d.isCrit ? '#f39c12' : '#e74c3c';
        ctx.font = d.isCrit ? 'bold 24px Arial' : 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.damage, d.x, d.y);
    });
    ctx.globalAlpha = 1;
}

function renderActiveEffects() {
    activeEffects.forEach(effect => {
        if (effect.type === 'charge') {
            // 繪製衝鋒分身
            const currentX = effect.currentX || effect.x;
            const currentY = effect.currentY || effect.y;

            // 繪製分身
            ctx.fillStyle = 'rgba(233, 69, 96, 0.8)';
            ctx.beginPath();
            ctx.arc(currentX, currentY, 25, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#e94560';
            ctx.lineWidth = 3;
            ctx.stroke();

            // 繪製分身表情（使用玩家emoji）
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(effect.emoji, currentX, currentY);

            // 繪製衝鋒路徑
            ctx.strokeStyle = 'rgba(233, 69, 96, 0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            ctx.lineTo(effect.endX, effect.endY);
            ctx.stroke();
        }

        if (effect.type === 'shockwave') {
            // 繪製震盪波
            const currentRadius = effect.radius || 0;

            // 繪製多個圓形波紋
            for (let i = 0; i < 3; i++) {
                const waveRadius = currentRadius - (i * 20);
                if (waveRadius > 0) {
                    const alpha = 1 - (waveRadius / effect.maxRadius);
                    ctx.strokeStyle = `rgba(233, 69, 96, ${alpha * 0.8})`;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, waveRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }

        if (effect.type === 'lightning') {
            // 繪製閃電
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.9)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(effect.startX, effect.startY);
            
            // 閃電折線效果
            const segments = 5;
            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const x = effect.startX + (effect.endX - effect.startX) * t + (Math.random() - 0.5) * 20;
                const y = effect.startY + (effect.endY - effect.startY) * t + (Math.random() - 0.5) * 20;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        if (effect.type === 'shadowClone') {
            // 繪製影分身
            ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🗡️', effect.x, effect.y);
        }

        if (effect.type === 'frost') {
            // 繪製結冰特效
            const progress = effect.time / effect.duration;
            const alpha = 1 - progress;

            // 使用敵人當前位置（如果關聯了敵人）
            const x = effect.enemy ? effect.enemy.x : effect.x;
            const y = effect.enemy ? effect.enemy.y : effect.y;

            // 繪製冰晶六邊形
            ctx.strokeStyle = `rgba(135, 206, 250, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const hexX = x + Math.cos(angle) * 30;
                const hexY = y + Math.sin(angle) * 30;
                if (i === 0) {
                    ctx.moveTo(hexX, hexY);
                } else {
                    ctx.lineTo(hexX, hexY);
                }
            }
            ctx.closePath();
            ctx.stroke();

            // 繪製內部冰晶
            ctx.strokeStyle = `rgba(135, 206, 250, ${alpha * 0.6})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const hexX = x + Math.cos(angle) * 20;
                const hexY = y + Math.sin(angle) * 20;
                if (i === 0) {
                    ctx.moveTo(hexX, hexY);
                } else {
                    ctx.lineTo(hexX, hexY);
                }
            }
            ctx.closePath();
            ctx.stroke();

            // 繪製中心冰花
            ctx.fillStyle = `rgba(135, 206, 250, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        if (effect.type === 'explosion') {
            // 繪製爆炸特效
            const progress = effect.time / effect.duration;
            const currentRadius = effect.radius;
            const alpha = 1 - progress;

            // 繪製爆炸火球
            const gradient = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, currentRadius);
            gradient.addColorStop(0, `rgba(255, 165, 0, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 69, 0, ${alpha * 0.7})`);
            gradient.addColorStop(1, `rgba(255, 69, 0, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            // 繪製爆炸火花
            ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i;
                const sparkRadius = currentRadius * 0.8;
                const sparkX = effect.x + Math.cos(angle) * sparkRadius;
                const sparkY = effect.y + Math.sin(angle) * sparkRadius;
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (effect.type === 'fireballExplosion') {
            // 繪製火球爆炸特效
            const progress = effect.time / effect.duration;
            const currentRadius = effect.radius;
            const alpha = 1 - progress;

            // 繪製更大的火球爆炸
            const gradient = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, currentRadius);
            gradient.addColorStop(0, `rgba(255, 200, 0, ${alpha})`);
            gradient.addColorStop(0.3, `rgba(255, 100, 0, ${alpha * 0.8})`);
            gradient.addColorStop(0.7, `rgba(255, 50, 0, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            // 繪製火焰粒子
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI / 6) * i + (progress * Math.PI * 2);
                const particleRadius = currentRadius * (0.6 + Math.random() * 0.3);
                const particleX = effect.x + Math.cos(angle) * particleRadius;
                const particleY = effect.y + Math.sin(angle) * particleRadius;
                const particleSize = 5 + Math.random() * 5;

                const particleGradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, particleSize);
                particleGradient.addColorStop(0, `rgba(255, 255, 0, ${alpha})`);
                particleGradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
                ctx.fillStyle = particleGradient;
                ctx.beginPath();
                ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (effect.type === 'freezeWave') {
            // 繪製冰凍波特效
            const progress = effect.time / effect.duration;
            const currentRadius = effect.radius;
            const alpha = 1 - progress;

            // 繪製冰凍波
            for (let i = 0; i < 3; i++) {
                const waveRadius = currentRadius - (i * 20);
                if (waveRadius > 0) {
                    ctx.strokeStyle = `rgba(135, 206, 250, ${alpha * 0.6})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, waveRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            // 繪製冰晶
            const crystalCount = 6;
            for (let i = 0; i < crystalCount; i++) {
                const angle = (Math.PI * 2 / crystalCount) * i;
                const crystalDist = currentRadius * 0.8;
                const crystalX = effect.x + Math.cos(angle) * crystalDist;
                const crystalY = effect.y + Math.sin(angle) * crystalDist;

                ctx.fillStyle = `rgba(135, 206, 250, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(crystalX, crystalY - 10);
                ctx.lineTo(crystalX - 8, crystalY + 5);
                ctx.lineTo(crystalX + 8, crystalY + 5);
                ctx.closePath();
                ctx.fill();
            }
        }

        if (effect.type === 'shield') {
            // 繪製護盾特效
            const progress = effect.time / effect.duration;
            const alpha = 1 - progress;
            const shieldRadius = CONFIG.PLAYER_SIZE / 2 + 15;

            // 繪製護盾外圈
            ctx.strokeStyle = `rgba(100, 149, 237, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(player.x, player.y, shieldRadius, 0, Math.PI * 2);
            ctx.stroke();

            // 繪製護盾內圈
            ctx.strokeStyle = `rgba(100, 149, 237, ${alpha * 0.5})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(player.x, player.y, shieldRadius - 5, 0, Math.PI * 2);
            ctx.stroke();

            // 繪製護盾光效
            const shieldGlow = ctx.createRadialGradient(player.x, player.y, shieldRadius - 10, player.x, player.y, shieldRadius + 5);
            shieldGlow.addColorStop(0, `rgba(100, 149, 237, 0)`);
            shieldGlow.addColorStop(0.5, `rgba(100, 149, 237, ${alpha * 0.3})`);
            shieldGlow.addColorStop(1, `rgba(100, 149, 237, 0)`);
            ctx.fillStyle = shieldGlow;
            ctx.beginPath();
            ctx.arc(player.x, player.y, shieldRadius + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ========== HUD 更新 ==========
function updateHUD() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);
    document.getElementById('timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById('kill-count').textContent = killCount;
    document.getElementById('level').textContent = player.level;

    const xpPercent = (player.xp / player.xpToNext) * 100;
    document.getElementById('xp-bar').style.width = xpPercent + '%';
    document.getElementById('xp-text').textContent = `${Math.floor(player.xp)}/${player.xpToNext}`;

    // 更新血條
    const hpPercent = (player.hp / player.maxHP) * 100;
    document.getElementById('hp-bar').style.width = hpPercent + '%';
    document.getElementById('hp-text').textContent = `${Math.floor(player.hp)}/${player.maxHP}`;

    // 更新 buff 圖示
    updateBuffIcons();
}

function updateBuffIcons() {
    const buffIcons = document.getElementById('buff-icons');
    if (!buffIcons) return;

    buffIcons.innerHTML = '';

    const activeBuffs = [];

    // 檢查各種 buff
    if (player.buffs.damage && player.buffs.damage.endTime > gameTime) {
        const remaining = player.buffs.damage.endTime - gameTime;
        const totalDuration = 10;
        const progress = remaining / totalDuration;
        activeBuffs.push({
            icon: '⚔️',
            remaining: remaining,
            progress: progress
        });
    }

    if (player.buffs.speed && player.buffs.speed.endTime > gameTime) {
        const remaining = player.buffs.speed.endTime - gameTime;
        const totalDuration = 10;
        const progress = remaining / totalDuration;
        activeBuffs.push({
            icon: '⚡',
            remaining: remaining,
            progress: progress
        });
    }

    if (player.buffs.crit && player.buffs.crit.endTime > gameTime) {
        const remaining = player.buffs.crit.endTime - gameTime;
        const totalDuration = 10;
        const progress = remaining / totalDuration;
        activeBuffs.push({
            icon: '💥',
            remaining: remaining,
            progress: progress
        });
    }

    // 檢查 activeEffects 中的 buff
    activeEffects.forEach(effect => {
        if (effect.type === 'defensive' && effect.endTime > gameTime) {
            const remaining = effect.endTime - gameTime;
            const totalDuration = 3;
            const progress = remaining / totalDuration;
            activeBuffs.push({
                icon: '🛡️',
                remaining: remaining,
                progress: progress
            });
        }

        if (effect.type === 'frenzy' && effect.endTime > gameTime) {
            const remaining = effect.endTime - gameTime;
            const totalDuration = 5;
            const progress = remaining / totalDuration;
            activeBuffs.push({
                icon: '😤',
                remaining: remaining,
                progress: progress
            });
        }
    });

    // 繪製 buff 圖示
    activeBuffs.forEach(buff => {
        const buffElement = document.createElement('div');
        buffElement.className = 'buff-icon';

        const timerElement = document.createElement('div');
        timerElement.className = 'buff-timer';
        timerElement.style.background = `conic-gradient(#f39c12 ${buff.progress * 360}deg, transparent ${buff.progress * 360}deg)`;

        const iconElement = document.createElement('span');
        iconElement.textContent = buff.icon;

        buffElement.appendChild(timerElement);
        buffElement.appendChild(iconElement);
        buffIcons.appendChild(buffElement);
    });
}

// ========== 遊戲結束 ==========
function gameOver() {
    gameState = 'gameover';
    cancelAnimationFrame(gameLoop);

    // 更新存檔（只在此時累加）
    saveGameData();

    // 檢查是否有新解鎖
    checkUnlocks();

    // 顯示結束畫面
    const screen = document.getElementById('game-over-screen');
    const stats = document.getElementById('final-stats');

    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);

    stats.innerHTML = `
        存活時間: ${minutes} 分 ${seconds} 秒<br>
        達到等級: ${player.level}<br>
        擊殺敵人: ${killCount}<br>
        角色: ${selectedCharacter.name}
    `;

    document.getElementById('hud').style.display = 'none';
    screen.classList.remove('hidden');
}

function checkUnlocks() {
    const saveData = loadSaveData(currentSaveSlot);
    let newUnlock = false;

    CHARACTERS.forEach(char => {
        if (!saveData.unlockedCharacters.includes(char.id) && char.unlockCheck(saveData)) {
            saveData.unlockedCharacters.push(char.id);
            newUnlock = true;
        }
    });

    if (newUnlock) {
        saveSlots[currentSaveSlot] = saveData;
        saveAllSlots();
    }
}

// ========== 再玩一次 ==========
function playAgain() {
    // 重新開始遊戲（使用相同角色）
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').style.display = 'block';
    startGame();
}

// ========== 工具函數 ==========
function getDistance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ========== 技能選擇系統 ==========
let selectedCharacterForSkill = null;
let tempSkillSelection = {
    skill1: null,
    skill2: null
};

function showSkillSelection(characterId) {
    selectedCharacterForSkill = characterId;
    
    document.getElementById('character-screen').classList.add('hidden');
    document.getElementById('skill-menu').classList.remove('hidden');
    
    // 初始化選擇
    const saveData = loadSaveData(currentSaveSlot);
    const characterSkills = saveData.characterSkills || {};
    const currentSkills = characterSkills[characterId] || { skill1: null, skill2: null };
    
    tempSkillSelection = {
        skill1: currentSkills.skill1,
        skill2: currentSkills.skill2
    };
    
    renderSkillOptions(characterId);
}

function renderSkillOptions(characterId) {
    const skillOptions = SKILL_OPTIONS[characterId];
    const saveData = loadSaveData(currentSaveSlot);
    const maxLevel = saveData.maxLevel || 0;
    
    // 渲染技能一選項
    const skill1Options = document.getElementById('skill1-options');
    skill1Options.innerHTML = '';
    skillOptions.skill1.forEach(skill => {
        const isLocked = maxLevel < skill.unlockAt;
        const isSelected = tempSkillSelection.skill1 === skill.id;
        
        const option = document.createElement('div');
        option.className = `skill-option ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
        option.innerHTML = `
            <div class="skill-option-emoji">${skill.emoji}</div>
            <div class="skill-option-name">${skill.name}</div>
            <div class="skill-option-desc">${skill.description}</div>
            <div class="skill-option-cooldown">CD: ${skill.cooldown}秒</div>
            ${isLocked ? `<div class="skill-option-lock">LV${skill.unlockAt} 解鎖</div>` : ''}
        `;
        
        if (!isLocked) {
            option.onclick = () => {
                tempSkillSelection.skill1 = skill.id;
                renderSkillOptions(characterId);
            };
        }
        
        skill1Options.appendChild(option);
    });
    
    // 渲染技能二選項
    const skill2Options = document.getElementById('skill2-options');
    skill2Options.innerHTML = '';
    skillOptions.skill2.forEach(skill => {
        const isLocked = maxLevel < skill.unlockAt;
        const isSelected = tempSkillSelection.skill2 === skill.id;
        
        const option = document.createElement('div');
        option.className = `skill-option ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
        option.innerHTML = `
            <div class="skill-option-emoji">${skill.emoji}</div>
            <div class="skill-option-name">${skill.name}</div>
            <div class="skill-option-desc">${skill.description}</div>
            <div class="skill-option-cooldown">CD: ${skill.cooldown}秒</div>
            ${isLocked ? `<div class="skill-option-lock">LV${skill.unlockAt} 解鎖</div>` : ''}
        `;
        
        if (!isLocked) {
            option.onclick = () => {
                tempSkillSelection.skill2 = skill.id;
                renderSkillOptions(characterId);
            };
        }
        
        skill2Options.appendChild(option);
    });
}

function confirmSkillSelection() {
    if (!selectedCharacterForSkill) return;
    
    const saveData = loadSaveData(currentSaveSlot);
    saveData.characterSkills = saveData.characterSkills || {};
    saveData.characterSkills[selectedCharacterForSkill] = {
        skill1: tempSkillSelection.skill1,
        skill2: tempSkillSelection.skill2
    };
    
    saveSlots[currentSaveSlot] = saveData;
    saveAllSlots();
    
    hideSkillSelection();
}

function hideSkillSelection() {
    selectedCharacterForSkill = null;
    document.getElementById('skill-menu').classList.add('hidden');
    document.getElementById('character-screen').classList.remove('hidden');
}

// ========== 技能發動系統 ==========
let playerLevel = 1;

function loadCharacterSkills(characterId) {
    const saveData = loadSaveData(currentSaveSlot);
    const characterSkills = saveData.characterSkills || {};
    const skills = characterSkills[characterId] || { skill1: null, skill2: null };
    
    playerSkills = {
        skill1: skills.skill1,
        skill2: skills.skill2
    };
    
    skillCooldowns = {
        skill1: 0,
        skill2: 0
    };
}

function useSkill(skillNum) {
    if (gameState !== 'playing') return;
    
    const skillKey = `skill${skillNum}`;
    const skillId = playerSkills[skillKey];
    
    if (!skillId) return;
    
    // 檢查等級要求
    const skillOptions = SKILL_OPTIONS[selectedCharacter.id];
    const skillList = skillOptions[skillKey];
    const skill = skillList.find(s => s.id === skillId);
    
    if (player.level < skill.unlockAt) return;
    
    // 檢查CD
    if (skillCooldowns[skillKey] > 0) return;
    
    // 施放技能
    executeSkill(skill);
    
    // 設置CD
    skillCooldowns[skillKey] = skill.cooldown;
}

function executeSkill(skill) {
    switch(skill.id) {
        // 戰士技能
        case 'charge':
            executeCharge(skill);
            break;
        case 'shockwave':
            executeShockwave(skill);
            break;
        case 'defensive':
            executeDefensive(skill);
            break;
        case 'frenzy':
            executeFrenzy(skill);
            break;
        // 弓箭手技能
        case 'multiShot':
            executeMultiShot(skill);
            break;
        case 'pierceArrow':
            executePierceArrow(skill);
            break;
        case 'frostArrow':
            executeFrostArrow(skill);
            break;
        case 'explosiveArrow':
            executeExplosiveArrow(skill);
            break;
        // 法師技能
        case 'fireball':
            executeFireball(skill);
            break;
        case 'freezeWave':
            executeFreezeWave(skill);
            break;
        case 'lightning':
            executeLightning(skill);
            break;
        case 'shield':
            executeShield(skill);
            break;
        // 刺客技能
        case 'dodge':
            executeDodge(skill);
            break;
        case 'backstab':
            executeBackstab(skill);
            break;
        case 'poisonBlade':
            executePoisonBlade(skill);
            break;
        case 'shadowClone':
            executeShadowClone(skill);
            break;
        // 聖騎士技能
        case 'holyLight':
            executeHolyLight(skill);
            break;
        case 'blessing':
            executeBlessing(skill);
            break;
        case 'holyShield':
            executeHolyShield(skill);
            break;
        case 'purify':
            executePurify(skill);
            break;
        // 死靈法師技能
        case 'summon':
            executeSummon(skill);
            break;
        case 'soulBurst':
            executeSoulBurst(skill);
            break;
        case 'resurrect':
            executeResurrect(skill);
            break;
        case 'deathGaze':
            executeDeathGaze(skill);
            break;
    }
}

// 戰士技能實現
function executeCharge(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;

    const angle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
    const endX = player.x + Math.cos(angle) * skill.range;
    const endY = player.y + Math.sin(angle) * skill.range;

    // 創建分身衝鋒效果
    activeEffects.push({
        type: 'charge',
        x: player.x,
        y: player.y,
        endX: endX,
        endY: endY,
        angle: angle,
        time: 0,
        duration: 0.3,
        emoji: player.emoji
    });

    // 0.3秒後對路徑上的敵人造成傷害
    setTimeout(() => {
        enemies.forEach(enemy => {
            const distToPath = distanceToLine(enemy.x, enemy.y, player.x, player.y, endX, endY);
            if (distToPath < 40) {
                enemy.hp -= skill.damage;
                showDamageNumber(enemy.x, enemy.y, skill.damage, false);
                if (enemy.hp <= 0) {
                    killEnemy(enemies.indexOf(enemy));
                }
            }
        });
    }, 300);
}

function executeShockwave(skill) {
    // 創建震盪波特效
    activeEffects.push({
        type: 'shockwave',
        x: player.x,
        y: player.y,
        radius: 0,
        maxRadius: skill.range,
        time: 0,
        duration: 0.5
    });

    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < skill.range) {
            enemy.hp -= skill.damage;
            enemy.slowed = true;
            enemy.slowEndTime = gameTime + 2;
            showDamageNumber(enemy.x, enemy.y, skill.damage, false);
            if (enemy.hp <= 0) {
                killEnemy(enemies.indexOf(enemy));
            }
        }
    });
}

function executeDefensive(skill) {
    activeEffects.push({
        type: 'defensive',
        damageReduction: 0.5,
        endTime: gameTime + skill.duration
    });
}

function executeFrenzy(skill) {
    activeEffects.push({
        type: 'frenzy',
        damageMultiplier: 2,
        speedMultiplier: 0.5,
        endTime: gameTime + skill.duration
    });
}

// 弓箭手技能實現
function executeMultiShot(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    const baseAngle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
    const spreadAngle = 0.3;
    
    for (let i = 0; i < skill.count; i++) {
        const angle = baseAngle + (i - Math.floor(skill.count / 2)) * spreadAngle;
        projectiles.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * 10,
            vy: Math.sin(angle) * 10,
            damage: player.damage * 0.8,
            owner: 'player',
            crit: false,
            pierce: false
        });
    }
}

function executePierceArrow(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    const angle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
    projectiles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 10,
        vy: Math.sin(angle) * 10,
        damage: player.damage * 1.5,
        owner: 'player',
        crit: false,
        pierce: true
    });
}

function executeFrostArrow(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    const angle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
    projectiles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 10,
        vy: Math.sin(angle) * 10,
        damage: player.damage,
        owner: 'player',
        crit: false,
        pierce: false,
        slow: skill.slow,
        slowDuration: skill.duration
    });
}

function executeExplosiveArrow(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    const angle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
    projectiles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 10,
        vy: Math.sin(angle) * 10,
        damage: player.damage,
        owner: 'player',
        crit: false,
        pierce: false,
        explosive: true,
        aoeRadius: skill.aoeRadius
    });
}

// 法師技能實現
function executeFireball(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    const angle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
    projectiles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
        damage: skill.damage,
        owner: 'player',
        crit: false,
        pierce: false,
        fireball: true
    });
}

function executeFreezeWave(skill) {
    // 添加冰凍特效
    activeEffects.push({
        type: 'freezeWave',
        x: player.x,
        y: player.y,
        radius: 0,
        maxRadius: skill.aoeRadius,
        time: 0,
        duration: 0.8
    });

    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < skill.aoeRadius) {
            enemy.slowed = true;
            enemy.slowEndTime = gameTime + skill.duration;
            enemy.slowMultiplier = skill.slow; // 保存減速比例
            // 为每个被凍住的敵人添加結冰特效，並關聯到敵人
            const frostEffect = {
                type: 'frost',
                enemy: enemy,
                time: 0,
                duration: 0.8
            };
            activeEffects.push(frostEffect);
            enemy.frostEffect = frostEffect; // 保存特效引用
        }
    });
}

function executeLightning(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    nearestEnemy.hp -= skill.damage;
    showDamageNumber(nearestEnemy.x, nearestEnemy.y, skill.damage, true);
    if (nearestEnemy.hp <= 0) {
        killEnemy(enemies.indexOf(nearestEnemy));
    }
    
    // 閃電效果
    activeEffects.push({
        type: 'lightning',
        startX: player.x,
        startY: player.y,
        endX: nearestEnemy.x,
        endY: nearestEnemy.y,
        time: 0,
        duration: 0.2
    });
}

function executeShield(skill) {
    if (!player.shieldHP) {
        player.shieldHP = 0;
    }
    player.shieldHP += skill.shieldHP;

    // 添加護盾特效
    activeEffects.push({
        type: 'shield',
        time: 0,
        duration: 1
    });

    showDamageNumber(player.x, player.y - 30, `+${skill.shieldHP} 護盾`, false);
}

// 刺客技能實現
function executeDodge(skill) {
    activeEffects.push({
        type: 'dodge',
        endTime: gameTime + skill.duration
    });
}

function executeBackstab(skill) {
    const nearestEnemy = findNearestEnemy();
    if (!nearestEnemy) return;
    
    const dist = getDistance(player, nearestEnemy);
    if (dist > skill.range) return;
    
    nearestEnemy.hp -= skill.damage;
    showDamageNumber(nearestEnemy.x, nearestEnemy.y, skill.damage, true);
    if (nearestEnemy.hp <= 0) {
        killEnemy(enemies.indexOf(nearestEnemy));
    }
}

function executePoisonBlade(skill) {
    activeEffects.push({
        type: 'poisonBlade',
        poisonDamage: skill.poisonDamage,
        endTime: gameTime + skill.duration
    });
}

function executeShadowClone(skill) {
    // 創建3個分身
    for (let i = 0; i < 3; i++) {
        const offsetAngle = (Math.PI * 2 / 3) * i;
        const offsetX = Math.cos(offsetAngle) * 50;
        const offsetY = Math.sin(offsetAngle) * 50;
        
        activeEffects.push({
            type: 'shadowClone',
            x: player.x + offsetX,
            y: player.y + offsetY,
            spawnTime: performance.now(),
            endTime: gameTime + skill.duration,
            owner: 'player'
        });
    }
}

// 聖騎士技能實現
function executeHolyLight(skill) {
    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < skill.range) {
            const enemyAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
            const forwardAngle = Math.atan2(player.y - 300, player.x - 400);
            const angleDiff = Math.abs(normalizeAngle(enemyAngle - forwardAngle));

            if (angleDiff < Math.PI / 3) {
                enemy.hp -= skill.damage;
                showDamageNumber(enemy.x, enemy.y, skill.damage, false);
                if (enemy.hp <= 0) {
                    killEnemy(enemies.indexOf(enemy));
                }
            }
        }
    });
}

function executeBlessing(skill) {
    player.hp = Math.min(player.hp + skill.healAmount, player.maxHP);
    showDamageNumber(player.x, player.y - 30, `+${skill.healAmount}`, false);
}

function executeHolyShield(skill) {
    if (!player.shieldHP) {
        player.shieldHP = 0;
    }
    player.shieldHP += skill.shieldHP;
    
    showDamageNumber(player.x, player.y - 30, `+${skill.shieldHP} 神聖護盾`, false);
}

function executePurify(skill) {
    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < skill.aoeRadius) {
            enemy.hp -= skill.damage;
            showDamageNumber(enemy.x, enemy.y, skill.damage, false);
            if (enemy.hp <= 0) {
                killEnemy(enemies.indexOf(enemy));
            }
        }
    });
}

// 死靈法師技能實現
function executeSummon(skill) {
    for (let i = 0; i < skill.summonCount; i++) {
        const offsetAngle = (Math.PI * 2 / skill.summonCount) * i;
        const offsetX = Math.cos(offsetAngle) * 40;
        const offsetY = Math.sin(offsetAngle) * 40;
        
        createSummon(player.x + offsetX, player.y + offsetY, false);
    }
}

function executeSoulBurst(skill) {
    summons.forEach(summon => {
        enemies.forEach(enemy => {
            const dist = getDistance(summon, enemy);
            if (dist < skill.aoeRadius) {
                enemy.hp -= skill.damage;
                showDamageNumber(enemy.x, enemy.y, skill.damage, true);
                if (enemy.hp <= 0) {
                    killEnemy(enemies.indexOf(enemy));
                }
            }
        });
    });
    
    // 消耗所有召喚物
    summons = [];
}

function executeResurrect(skill) {
    // 從死亡敵人的位置召喚
    const enemiesNearby = enemies.filter(enemy => {
        const dist = getDistance(player, enemy);
        return dist < 200;
    });
    
    const resurrectCount = Math.min(skill.resurrectCount, enemiesNearby.length);
    for (let i = 0; i < resurrectCount; i++) {
        const enemy = enemiesNearby[i];
        createSummon(enemy.x, enemy.y, true);
    }
}

function executeDeathGaze(skill) {
    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < skill.range) {
            const angle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
            const forwardAngle = Math.atan2(player.y - 300, player.x - 400);
            const angleDiff = Math.abs(normalizeAngle(angle - forwardAngle));
            
            if (angleDiff < Math.PI / 4) {
                enemy.hp -= skill.damage;
                showDamageNumber(enemy.x, enemy.y, skill.damage, false);
                if (enemy.hp <= 0) {
                    killEnemy(enemies.indexOf(enemy));
                }
            }
        }
    });
}

// 輔助函數
function findNearestEnemy() {
    let nearest = null;
    let minDist = Infinity;
    
    enemies.forEach(enemy => {
        const dist = getDistance(player, enemy);
        if (dist < minDist) {
            minDist = dist;
            nearest = enemy;
        }
    });
    
    return nearest;
}

function distanceToLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
        param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
}

function normalizeAngle(angle) {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
}

function updateSkillCooldowns(deltaTime) {
    if (skillCooldowns.skill1 > 0) {
        skillCooldowns.skill1 -= deltaTime;
        if (skillCooldowns.skill1 < 0) skillCooldowns.skill1 = 0;
    }
    
    if (skillCooldowns.skill2 > 0) {
        skillCooldowns.skill2 -= deltaTime;
        if (skillCooldowns.skill2 < 0) skillCooldowns.skill2 = 0;
    }
}

function updateActiveEffects(deltaTime) {
    activeEffects = activeEffects.filter(effect => {
        if (effect.endTime && gameTime >= effect.endTime) {
            return false;
        }

        if (effect.duration) {
            effect.time += deltaTime;
            if (effect.time >= effect.duration) {
                return false;
            }
        }

        // 更新冲锋效果位置
        if (effect.type === 'charge') {
            const progress = effect.time / effect.duration;
            effect.currentX = effect.x + (effect.endX - effect.x) * progress;
            effect.currentY = effect.y + (effect.endY - effect.y) * progress;
        }

        // 更新震盪波半径
        if (effect.type === 'shockwave') {
            const progress = effect.time / effect.duration;
            effect.radius = progress * effect.maxRadius;
        }

        // 更新爆炸半径
        if (effect.type === 'explosion') {
            const progress = effect.time / effect.duration;
            effect.radius = progress * effect.maxRadius;
        }

        // 更新火球爆炸半径
        if (effect.type === 'fireballExplosion') {
            const progress = effect.time / effect.duration;
            effect.radius = progress * effect.maxRadius;
        }

        // 更新冰凍波半径
        if (effect.type === 'freezeWave') {
            const progress = effect.time / effect.duration;
            effect.radius = progress * effect.maxRadius;
        }

        return true;
    });
}

function updateSkillButtons() {
    const skill1Btn = document.getElementById('skill1-btn');
    const skill2Btn = document.getElementById('skill2-btn');
    const skill1Icon = document.getElementById('skill1-icon');
    const skill2Icon = document.getElementById('skill2-icon');
    const skill1Label = document.getElementById('skill1-label');
    const skill2Label = document.getElementById('skill2-label');

    if (!playerSkills.skill1 || !playerSkills.skill2) return;

    const skillOptions = SKILL_OPTIONS[selectedCharacter.id];
    const skill1 = skillOptions.skill1.find(s => s.id === playerSkills.skill1);
    const skill2 = skillOptions.skill2.find(s => s.id === playerSkills.skill2);

    // 更新技能一按鈕
    if (skill1) {
        skill1Icon.textContent = skill1.emoji;
        skill1Label.textContent = `${skill1.name}`;

        if (player.level >= skill1.unlockAt) {
            skill1Btn.classList.add('ready');
            skill1Icon.style.filter = 'none';

            // 更新CD覆蓋層 - 透明部分是已經過的CD時間
            const cdPercent = skillCooldowns.skill1 / skill1.cooldown;
            const cdOverlay = document.getElementById('skill1-cd');
            if (cdPercent > 0) {
                cdOverlay.style.background = `conic-gradient(rgba(0, 0, 0, 0.7) 0deg ${cdPercent * 360}deg, transparent ${cdPercent * 360}deg 360deg)`;
            } else {
                cdOverlay.style.background = 'transparent';
            }
        } else {
            skill1Btn.classList.remove('ready');
            skill1Icon.style.filter = 'grayscale(100%)';
        }
    }

    // 更新技能二按鈕
    if (skill2) {
        skill2Icon.textContent = skill2.emoji;
        skill2Label.textContent = `${skill2.name}`;

        if (player.level >= skill2.unlockAt) {
            skill2Btn.classList.add('ready');
            skill2Icon.style.filter = 'none';

            // 更新CD覆蓋層 - 透明部分是已經過的CD時間
            const cdPercent = skillCooldowns.skill2 / skill2.cooldown;
            const cdOverlay = document.getElementById('skill2-cd');
            if (cdPercent > 0) {
                cdOverlay.style.background = `conic-gradient(rgba(0, 0, 0, 0.7) 0deg ${cdPercent * 360}deg, transparent ${cdPercent * 360}deg 360deg)`;
            } else {
                cdOverlay.style.background = 'transparent';
            }
        } else {
            skill2Btn.classList.remove('ready');
            skill2Icon.style.filter = 'grayscale(100%)';
        }
    }
}

// 啟動遊戲
window.onload = init;
