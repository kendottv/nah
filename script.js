// script.js

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const config = {
    startLen: 130,
    branchWidth: 10,
    colorTrunk: '#8B4513',
    colorHeart: '#FF69B4',
    growSpeed: 40,      // 稍微調快一點點
    lengthRatio: 0.75,
    angleVar: 0.4
};

// 用來追蹤是否還在生長
let animatingTasks = 0; 

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

function drawHeart(x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI/2);
    ctx.fillStyle = config.colorHeart;
    ctx.beginPath();
    let topCurveHeight = size * 0.3;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, 0);
    ctx.fill();
    ctx.restore();
}

// 顯示文字的函數
function showTitle() {
    const textDiv = document.getElementById('card-text');
    textDiv.classList.add('show-text'); // 加入 CSS class 觸發淡入效果
}

function drawBranch(startX, startY, len, angle, width) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    const endX = startX + len * Math.cos(angle);
    const endY = startY + len * Math.sin(angle);
    
    ctx.lineCap = 'round';
    ctx.lineWidth = width;
    ctx.strokeStyle = config.colorTrunk;
    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (len < 10) {
        drawHeart(endX, endY, 12, angle);
        return;
    }

    // --- 關鍵修改：計數器邏輯 ---
    animatingTasks++; // 增加一個生長任務

    setTimeout(() => {
        const randomAngle = (Math.random() - 0.5) * config.angleVar; 
        
        drawBranch(endX, endY, len * config.lengthRatio, angle + 0.5 + randomAngle, width * 0.7);
        drawBranch(endX, endY, len * config.lengthRatio, angle - 0.5 + randomAngle, width * 0.7);
        
        animatingTasks--; // 任務完成
        
        // 如果任務歸零，代表樹長完了
        if (animatingTasks === 0) {
            showTitle();
        }

    }, config.growSpeed);
}

// 開始
drawBranch(canvas.width / 2, canvas.height, config.startLen, -Math.PI / 2, config.branchWidth);
window.addEventListener('resize', resizeCanvas);