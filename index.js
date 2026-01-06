// script.js

// 取得畫布與繪圖環境
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// --- 參數設定區 (想改顏色或速度調這裡) ---
const config = {
    startLen: 130,        // 初始樹幹長度
    branchWidth: 12,      // 初始樹幹粗細
    colorTrunk: '#8B4513',// 樹幹顏色 (咖啡色)
    colorHeart: '#FF69B4',// 愛心顏色 (熱粉紅)
    growSpeed: 50,        // 生長速度 (毫秒)，數字越小越快
    lengthRatio: 0.75,    // 樹枝變短的比例
    angleVar: 0.4         // 分叉角度的隨機變化量
};

// 初始化畫布大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas(); // 一開始先執行一次

// --- 畫愛心的函數 ---
function drawHeart(x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI/2); // 調整角度
    ctx.fillStyle = config.colorHeart;
    ctx.beginPath();
    
    // 使用貝茲曲線畫愛心
    let topCurveHeight = size * 0.3;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, 0);
    
    ctx.fill();
    ctx.restore();
}

// --- 遞迴畫樹的函數 (核心) ---
function drawBranch(startX, startY, len, angle, width) {
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // 計算樹枝終點
    const endX = startX + len * Math.cos(angle);
    const endY = startY + len * Math.sin(angle);
    
    ctx.lineCap = 'round'; // 圓頭線條
    ctx.lineWidth = width;
    ctx.strokeStyle = config.colorTrunk;
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // 終止條件：如果樹枝太短，就畫愛心並結束
    if (len < 10) {
        drawHeart(endX, endY, 12, angle);
        return;
    }

    // 動畫延遲效果
    setTimeout(() => {
        // 隨機角度變化，讓樹比較自然
        const randomAngle = (Math.random() - 0.5) * config.angleVar; 
        
        // 畫右邊分叉
        drawBranch(
            endX, endY, 
            len * config.lengthRatio, 
            angle + 0.5 + randomAngle, 
            width * 0.7
        );
        
        // 畫左邊分叉
        drawBranch(
            endX, endY, 
            len * config.lengthRatio, 
            angle - 0.5 + randomAngle, 
            width * 0.7
        );
        
    }, config.growSpeed);
}

// --- 開始執行 ---
// 從畫面下方正中間開始畫
// 角度 -Math.PI / 2 代表垂直向上
drawBranch(canvas.width / 2, canvas.height, config.startLen, -Math.PI / 2, config.branchWidth);

// 監聽視窗大小改變 (可選，防止改變視窗大小時畫布變形)
window.addEventListener('resize', resizeCanvas);