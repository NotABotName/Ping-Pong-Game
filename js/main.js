const body = document.getElementById("body")
const canvas = document.getElementById("Canvas")
const playoptions = document.getElementById("play-options")
const offlinesetup = document.getElementById("play-offline-setup")
const onlinesetup = document.getElementById("play-online-setup")
const GOScreen = document.getElementById("gameover")
const replaybnt = document.getElementById("play-again")
var c = canvas.getContext("2d")

GOScreen.style.display = 'none'
offlinesetup.style.display = 'none'
onlinesetup.style.display = 'none'


var lastUpdate = Date.now();
var dt = 0;

canvas.height = canvas.getBoundingClientRect().height;
canvas.width = canvas.getBoundingClientRect().width;

var hasgamestarted = false;

var colorVariable = "white"

// Check if the browser supports CSS variables
if (CSS.supports('color', 'var(--color-4)')) {
    // Get the value of the CSS property using the CSS variable
    colorVariable = document.documentElement.style.getPropertyValue('--color-4');
}

function getURlParamater(ParamaterNmae) {
    const Paramaters = new URLSearchParams(window.location.search)
    return Paramaters.get(ParamaterNmae)
}

function addURLParamter(key, value) {
    const Paramaters = new URLSearchParams(window.location.search)
    Paramaters.set(key, value)
    const newRelativePath = window.location.pathname + "?" + Paramaters.toString()
    history.pushState(null, "", newRelativePath)

}

if( getURlParamater("t") == "offline") {
    playoptions.style.display = 'none'
    offlinesetup.style.display = 'grid'
}

if( getURlParamater("t") == "online") {
    playoptions.style.display = 'none'
    onlinesetup.style.display = 'grid'
}

let difficulty = .05;

function cheackfordificulty() {
    if( getURlParamater("play") == "easy") {
        difficulty = .05
        StartGame()
    }
    if( getURlParamater("play") == "medium") {
        difficulty = .1
        StartGame()
    }
    if( getURlParamater("play") == "hard") {
        difficulty = .25
        StartGame()
    }
}
cheackfordificulty()

//Pong Game !!

function StartGame() {
    playoptions.style.display = 'none'
    GOScreen.style.display = 'none'
    offlinesetup.style.display = 'none'
    onlinesetup.style.display = 'none'
    hasgamestarted = true;

    replaybnt.href = "?play="+getURlParamater("play")
}

function EndGame() {
    GOScreen.style.display = 'grid'
    hasgamestarted = false; 
}

let scoreOne = 0;
let scoreTwo = 0;

// Mouse Controller
let xM = 0
let yM = 0
window.addEventListener("mousemove", getmousePos, false);

function getmousePos(ev){
    var bnds = ev.target.getBoundingClientRect();
    xM = ev.clientX;
    yM = ev.clientY;
}

//Class
class Element {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.color = options.color;
        this.speed = options.speed || 2;
        this.velocity = options.velocity || { x: 1, y: 1 };
    }
}

//First Paddle / PlayerOne
const playerOne = new Element({
    x: 0,
    y: canvas.height / 2 - 40,
    width: canvas.width/40,
    height: canvas.height/5,
    color: colorVariable,
});
//Second Paddle / PlayerTwo
const playerTwo = new Element({
    x: canvas.width-20,
    y: canvas.height / 2 - 40,
    width: canvas.width/40,
    height: canvas.height/5,
    color: colorVariable,
});
//Ball
const ball = new Element({
    width: canvas.width/35,
    height: canvas.width/35,
    color: colorVariable,
    speed: 0.25,
    direction: { x: -1, y: 1 }
});

ResetBall(0, {x:-1, y:1})

function ResetBall(score, velocity = {x:1, y: 1}) {
    ball.x = canvas.width/2 - ball.width/2
    ball.y = canvas.height/2 - ball.height/2
    ball.speed = 0.25
    ball.velocity = velocity
    if(score == 1) {
        scoreOne += 1
    } else if(score == 2) {
        scoreTwo += 1
    }

    if(scoreOne >= 5 || scoreTwo >= 5) {
        EndGame();
    }
}

// Draw Scores
function displayScore(score, left) {
    let seize = canvas.width/30
    c.font = seize+"px Arial"
    c.fillStyle = colorVariable
    c.textAlign = "center"
    c.fillText(score, canvas.width/2 + canvas.width/4*left, seize+seize*1.05)
}

// ChatGPT Shadows
function drawShadows(lightPosition, objects) {
}

//draw Element
function drawElement(element) {
    c.fillStyle = element.color;
    c.fillRect(element.x, element.y, element.width, element.height)
}

//Draw Scene
function draw() {
    c.clearRect(0,0,canvas.width,canvas.height)
    drawnet()
    drawShadows(
        {x: ball.x - ball.width/2, y: ball.y - ball.height/2},
        [playerOne, playerTwo]
    )
    drawElement(playerOne)
    drawElement(playerTwo)
    drawElement(ball)
    displayScore(scoreTwo, 1)
    displayScore(scoreOne, -1)
}
function drawnet(){
    c.fillStyle = "rgba(255, 255, 255 ,.75)";
    c.fillRect(canvas.width/2 -2.5,0,5,canvas.height)
}


//loop
function loop(){
    var now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;

    if(hasgamestarted == true) {
        BallCollisions();
        moveP1()
        moveP2(difficulty)
        draw();
        window.requestAnimationFrame(loop);
    }
}
loop();

// Ball 
function MoveBall() {
    //Speed Up Ball
    ball.speed += .00025

    //Move Ball in Direction
    ball.x += ball.speed * ball.velocity.x * dt
    ball.y += ball.speed * ball.velocity.y * dt
}

function BallCollisions() {

    // Vertical Wall
    if(ball.y + ball.height >= canvas.height || ball.y <= 0) {
        // Bounce
        ball.velocity.y *= -1;
    }

    // Horizontal Walls
    if(ball.x + ball.width >= canvas.width) {
        //Update Scrore
        ResetBall(1, {x:1, y:1})
    }
    if(ball.x <= 0) {
        //Update Scrore
        ResetBall(2, {x:-1, y:1})
    }

    // Paddle Collision
    if(isRectangleCollision(playerOne, ball)) {
        ball.velocity.x *= -1;
    }

    if(isRectangleCollision(playerTwo, ball)) {
        ball.velocity.x *= -1;
    }

    MoveBall()
}

//Collision Testing

//My Solution
function IsCollision(rect1, rect2) {
    return (
        // left | right
        rect1.x <= rect2.x + rect2.width &&
        // right | left
        rect1.x + rect1.width >= rect2.x &&
        // top | bottom
        rect1.y <= rect2.y + rect2.height &&
        // bottom | top
        rect1.y + rect1.height >= rect2.y
    )
}

//ChatGPT Solution
function isRectangleCollision(rect1, rect2) {
    // Get the center points of each rectangle
    const rect1Center = {
      x: rect1.x + rect1.width / 2,
      y: rect1.y + rect1.height / 2
    };
    const rect2Center = {
      x: rect2.x + rect2.width / 2,
      y: rect2.y + rect2.height / 2
    };
  
    // Calculate the half-widths and half-heights of each rectangle
    const rect1HalfWidth = rect1.width / 2;
    const rect1HalfHeight = rect1.height / 2;
    const rect2HalfWidth = rect2.width / 2;
    const rect2HalfHeight = rect2.height / 2;
  
    // Calculate the distance between the center points of each rectangle
    const distanceX = rect1Center.x - rect2Center.x;
    const distanceY = rect1Center.y - rect2Center.y;
  
    // Check if the distance between the rectangles is less than the sum of their half-widths and half-heights
    const overlapX = rect1HalfWidth + rect2HalfWidth - Math.abs(distanceX);
    const overlapY = rect1HalfHeight + rect2HalfHeight - Math.abs(distanceY);
  
    if (overlapX > 0 && overlapY > 0) {
      // Collision has occurred
      return true;
    } else {
      // No collision
      return false;
    }
}

//Move Paddles

function moveP1() {
    let Ypos 
    Ypos = yM-playerOne.height/2    
    if(Ypos > canvas.getBoundingClientRect().top){  
        playerOne.y = Ypos - canvas.getBoundingClientRect().top
    }else{ playerOne.y = 0}
    if(Ypos > canvas.getBoundingClientRect().top+canvas.height-playerOne.height){  
        playerOne.y = canvas.height-playerOne.height
    }
}

function moveP2( difficulty = 0.1) {
    // Get the ball's position
    const ballX = ball.x + ball.width / 2;
    const ballY = ball.y + ball.height / 2;
  
    // Calculate the distance between the ball and the paddle
    const distanceX = ballX - (playerTwo.x + playerTwo.width / 2);
    const distanceY = ballY - (playerTwo.y + playerTwo.height / 2);
  
    // Move the paddle towards the ball
    //playerTwo.x += distanceX * difficulty;
    playerTwo.y += distanceY * difficulty;
  
    // Keep the paddle within the boundaries of the canvas
    if (playerTwo.x < 0) {
        playerTwo.x = 0;
    } else if (playerTwo.x + playerTwo.width > canvas.width) {
        playerTwo.x = canvas.width - playerTwo.width;
    }
    if (playerTwo.y < 0) {
        playerTwo.y = 0;
    } else if (playerTwo.y + playerTwo.height > canvas.height) {
        playerTwo.y = canvas.height - playerTwo.height;
    }
}