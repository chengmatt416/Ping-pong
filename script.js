const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;

// Player paddle (left)
const player = {
    x: 0,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#0ff'
};

// AI paddle (right)
const ai = {
    x: canvas.width - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#f0f'
};

// Ball
const ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speed: 6,
    dx: 6,
    dy: 6,
    color: '#fff'
};

// Draw paddle
function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall(ball) {
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

// Draw net
function drawNet() {
    ctx.strokeStyle = '#666';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Game loop
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top & bottom)
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }

    // Paddle collision (player)
    if (
        ball.x <= player.x + player.width &&
        ball.y + ball.size >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.dx *= -1;
        // Add randomness to ball dy
        ball.dy += (Math.random() - 0.5) * 2;
        ball.x = player.x + player.width; // Prevent sticking
    }

    // Paddle collision (AI)
    if (
        ball.x + ball.size >= ai.x &&
        ball.y + ball.size >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.dx *= -1;
        ball.dy += (Math.random() - 0.5) * 2;
        ball.x = ai.x - ball.size; // Prevent sticking
    }

    // Ball out of bounds (left or right)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // AI movement: follow the ball, but not perfectly
    let aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y + ball.size / 2 - 10) {
        ai.y += 5;
    } else if (aiCenter > ball.y + ball.size / 2 + 10) {
        ai.y -= 5;
    }
    // Prevent AI from going out of bounds
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Prevent paddle from going out of bounds
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawPaddle(player);
    drawPaddle(ai);
    drawBall(ball);
}

// Main loop
function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

// Start game
resetBall();
loop();