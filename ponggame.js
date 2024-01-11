const ball = document.querySelector('.ball');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');

let ballX = 300;
let ballY = 200;
let ballSpeedX = 5;
let ballSpeedY = 5;

let rightPaddleY = 160; // Initial position of the right paddle
const paddleSpeed = 10;
let score = 0;
let highScore = 0; // Initialize high score to 0
let lives = 5;

let gameRunning = false; // Variable to track the game state
let scoreIntervalCounter = 0;

function update() {
    moveLeftPaddle();
    moveRightPaddle();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check collision with top and bottom walls
    if (ballY <= 0 || ballY >= 600) {
        ballSpeedY = -ballSpeedY;
    }

    // Check collision with paddles
    if (
        (ballX <= 20 && ballY >= getPaddleTop(leftPaddle) && ballY <= getPaddleBottom(leftPaddle)) ||
        (ballX >= 785 && ballY >= getPaddleTop(rightPaddle) && ballY <= getPaddleBottom(rightPaddle))
    ) {
        ballSpeedX = -ballSpeedX;

        // Check if the ball hits the right paddle
        if (ballX >= 785) {
            // Increment the score
            score++;
            
            // Increment the counter for score intervals
            scoreIntervalCounter++;

            // Update the score display
            document.getElementById('score').innerText = score;

            // Update the high score if the current score is higher
            if (score > highScore) {
                highScore = score;
                document.getElementById('highScore').innerText = highScore;
            }

            /* Check if the score interval is reached (every 10 points)
            if (scoreIntervalCounter === 10) {
                // Generate a random score between 1 and 10
                const randomScore = Math.floor(Math.random() * 50) + 1;

                // Increment the score by the random score
                score += randomScore;

                // Reset the score interval counter
                scoreIntervalCounter = 0;
            }*/
        }
    }

    // Check if the ball is out of bounds (score) or if all lives are used up
    if (ballX <= 0 || ballX >= 791) {
        // Deduct one life
        lives--;

        // Check if there are remaining lives
        if (lives > 0) {
            // Reset ball position
            ballX = 300;
            ballY = 200;
            // Update the lives display
            document.getElementById('lives').innerText = lives;
        } else {
            // If no lives remaining, stop the game
            resetGame();
            return;
        }
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // leftPaddle.style.top = (ballY - leftPaddle.offsetHeight / 2) + 'px';


    rightPaddle.style.top = rightPaddleY + 'px';

    requestAnimationFrame(update);
}

function getPaddleTop(paddle) {
    return paddle.offsetTop;
}

function getPaddleBottom(paddle) {
    return paddle.offsetTop + paddle.offsetHeight;
}

function moveRightPaddle() {
    // Move right paddle up
    if (keyState.ArrowUp && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }

    // Move right paddle down
    if (keyState.ArrowDown && rightPaddleY < 520) {
        rightPaddleY += paddleSpeed;
    }
}

function moveLeftPaddle() {
    // Calculate the target Y position for the left paddle
    const targetY = Math.min(Math.max(ballY - leftPaddle.offsetHeight / 2, 0), 520);

    // Set a base speed and adjust based on the distance to the target
    const baseSpeed = 0.2; // Adjust the base speed here
    const distance = targetY - leftPaddle.offsetTop;
    const speed = Math.abs(distance) < 10 ? 1 : baseSpeed; // Adjust the threshold as needed

    // Calculate the distance to move based on the speed factor
    const distanceToMove = distance * speed;

    // Set the left paddle's top style
    leftPaddle.style.top = leftPaddle.offsetTop + distanceToMove + 'px';
}


/* function moveLeftPaddle() {

 
     // Move left paddle based on the ball's vertical position
     const targetY = ballY - leftPaddle.offsetHeight / 2;
     const distance = targetY - leftPaddle.offsetTop;

     // Adjust the speed for smoother movement
     const speed = 0.07; // Adjust the speed here

     leftPaddle.style.top = leftPaddle.offsetTop + distance * speed + 'px';
 }*/

// Keyboard input handling
const keyState = {};

window.addEventListener('keydown', (e) => {
    keyState[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keyState[e.key] = false;
});

function resetGame() {
    /* Reset game state
    ballX = 300;
    ballY = 200;
    rightPaddleY = 160;*/
    score = 0;
    lives = 3;
    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;

    // Show the start button
    document.getElementById('startButton').style.display = 'block';

    // Update game state
    gameRunning = false;
    cancelAnimationFrame(update); // Stop the game loop
}

function startGame() {
    if (!gameRunning) {
        // Reset game state
        ballX = 300;
        ballY = 200;
        ballSpeedX = 5; // set initial ball speed
        ballSpeedY = 5; // set initial ball speed
        rightPaddleY = 160;
        score = 0;
        document.getElementById('score').innerText = score;

        // Hide the start button
        document.getElementById('startButton').style.display = 'none';

        // Start the game loop
        update();

        // Update game state
        gameRunning = true;
    }
}
