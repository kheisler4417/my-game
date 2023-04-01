const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const paddleHeight = 10;
const paddleWidth = 75;
const paddleSpeed = 5;

const lastModifiedElement = document.getElementById('lastModified');
lastModifiedElement.textContent = 'Last modified: ' + document.lastModified;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 1;
let dy = -1;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = (canvas.height - paddleHeight) / 2;
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') moveUp = true;
    if (key === 'arrowdown' || key === 's') moveDown = true;
    if (key === 'arrowleft' || key === 'a') moveLeft = true;
    if (key === 'arrowright' || key === 'd') moveRight = true;
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') moveUp = false;
    if (key === 'arrowdown' || key === 's') moveDown = false;
    if (key === 'arrowleft' || key === 'a') moveLeft = false;
    if (key === 'arrowright' || key === 'd') moveRight = false;
});


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.rect(paddleX, paddleY + paddleHeight, paddleHeight, paddleWidth);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function detectCollision(ballX, ballY, rectX, rectY, rectWidth, rectHeight) {
    const ballLeft = ballX - 10;
    const ballRight = ballX + 10;
    const ballTop = ballY - 10;
    const ballBottom = ballY + 10;

    const rectLeft = rectX;
    const rectRight = rectX + rectWidth;
    const rectTop = rectY;
    const rectBottom = rectY + rectHeight;

    if (
        ballRight > rectLeft && ballLeft < rectRight &&
        ballBottom > rectTop && ballTop < rectBottom
    ) {
        const leftEdgeDist = Math.abs(ballRight - rectLeft);
        const rightEdgeDist = Math.abs(ballLeft - rectRight);
        const topEdgeDist = Math.abs(ballBottom - rectTop);
        const bottomEdgeDist = Math.abs(ballTop - rectBottom);

        const minDist = Math.min(leftEdgeDist, rightEdgeDist, topEdgeDist, bottomEdgeDist);

        if (minDist === leftEdgeDist || minDist === rightEdgeDist) {
            dx = -dx;
        }
        if (minDist === topEdgeDist || minDist === bottomEdgeDist) {
            dy = -dy;
        }

        return true;
    }

    return false;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if (x + dx > canvas.width - 10 || x + dx < 10) {
        dx = -dx;
    }

    if (y + dy < 10 || y + dy > canvas.height - 10) {
        dy = -dy;
    }

    // Check for collision with the horizontal part of the paddle
    if (detectCollision(x, y, paddleX, paddleY, paddleWidth, paddleHeight)) {
        if (x < paddleX + paddleHeight) {
            dx = -Math.abs(dx);
        } else if (x > paddleX + paddleWidth - paddleHeight) {
            dx = Math.abs(dx);
        }
        dy = -dy;
    }

    // Check for collision with the vertical part of the paddle
    if (detectCollision(x, y, paddleX, paddleY + paddleHeight, paddleHeight, paddleWidth)) {
        dx = -dx;
    }

    if (moveUp && paddleY > 0) paddleY -= paddleSpeed;
    if (moveDown && paddleY + paddleWidth + paddleHeight < canvas.height) paddleY += paddleSpeed;
    if (moveLeft && paddleX > 0) paddleX -= paddleSpeed;
    if (moveRight && paddleX + paddleWidth < canvas.width) paddleX += paddleSpeed;

    x += dx;
    y += dy;
}

setInterval(draw, 10);
