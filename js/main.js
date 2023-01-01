import {getURlParamater, removeURlParamater, addURLParamter} from './modules/URLParams.js';

function playAudio(path) {
    // let audio = new Audio(path)
    // audio.play()
}


// HTML Variables
const canvas = document.getElementById("Canvas")
const replaybnt = document.getElementById("play-again")
var c = canvas.getContext("2d")

canvas.height = canvas.getBoundingClientRect().height;
canvas.width = canvas.getBoundingClientRect().width;

const GOScreen = document.getElementById("gameover")
const playoptions = document.getElementById("play-options")
const offlinesetup = document.getElementById("play-offline-setup")
const onlinesetup = document.getElementById("play-online-setup")
const lobbyhost = document.getElementById("lobby-host")
const lobbyclient = document.getElementById("lobby-client")
const watchaisetup = document.getElementById("watch-ai-setup")

const interfaces = document.getElementsByClassName("interface")

// Game Variables
var hasgamestarted = false;

let difficulty = .05;

let prvvelocity = 1

let scoreOne = 0;
let scoreTwo = 0;

let MaxScore = 5;

var lastUpdate = Date.now();
var dt = 0;

let mode = getURlParamater("m");

// Networking
import {initialize, ready, join, send} from './modules/ClientPeer.js'
const createroombnt = document.getElementById('CreateRoom')
const connectionstatus = document.getElementById('onlinestatus')
const onlineplaybtn = document.getElementById('OnlinePlayBtn')

var PeerPosition = 0;

createroombnt.addEventListener('click', function() {
    initialize(
        function(peer) {
            // On peer Created
            addURLParamter("id", peer.id)
            switchinterface(lobbyhost)
        }, 
        function(conn) {
            // On Connection 
            onlineplaybtn.disabled = false
            ready(function(data) {
                console.log("recived: "+data)

                if(data[0].position != undefined) {
                    PeerPosition = data[0].position.y
                    console.log(PeerPosition)
                }
            })
        },
        function(status) {
            connectionstatus.innerHTML = status
        }
    )
})

const id = getURlParamater("id");
if (id != null) {
    initialize(
        function(peer) {
            // On peer Created join url id
            join(id, function(data) {
                if(data == 'start') {
                    mode = "pvp"
                    StartGame()
                }
                console.log("recived: "+data)
                send([{"position": {x: 5, y: 50}}])
            }, function(status) {
                if(status == "Connected to: " + id) {
                    switchinterface(lobbyclient)
                }
            }
            );
        }
    )
}

onlineplaybtn.addEventListener('click', function() {
    mode = "pvp"
    send('start')
    StartGame()
})

// Mouse Controller
let xM = 0
let yM = 0
window.addEventListener("mousemove", getmousePos, false);

function getmousePos(ev){
    xM = ev.clientX;
    yM = ev.clientY;
    //send([{"position": {x: xM, y: yM}}])
}


// CSS Variables
function switchinterface(ininterface) {
    for (let i = 0; i < interfaces.length; i++) {
        if(interfaces[i] == ininterface) {
            interfaces[i].style.display = 'grid'
        } else {
            interfaces[i].style.display = 'none'
        }
    }
}
switchinterface(playoptions)

var colorVariable = "white"

if (CSS.supports('color', 'var(--color-4)')) {
    colorVariable = document.documentElement.style.getPropertyValue('--color-4');
}

// URL
if( getURlParamater("t") == "offline") {
    switchinterface(offlinesetup)
}

if( getURlParamater("t") == "online") {
    switchinterface(onlinesetup)
}

if( getURlParamater("t") == "watchai") {
    switchinterface(watchaisetup)
}

function cheackfordificulty() {
    if( getURlParamater("d") == "easy") {
        difficulty = .0075
        StartGame()
    }
    if( getURlParamater("d") == "medium") {
        difficulty = .01
        StartGame()
    }
    if( getURlParamater("d") == "hard") {
        difficulty = .015
        StartGame()
    }
}
cheackfordificulty()

replaybnt.addEventListener('click', function() {
    scoreOne = 0
    scoreTwo = 0
    switchinterface()
    hasgamestarted = true;
})

//Pong Game !!
function StartGame() {
    scoreOne = 0
    scoreTwo = 0
    switchinterface()
    hasgamestarted = true;
    init()
}

function EndGame() {
    switchinterface(GOScreen)
    hasgamestarted = false; 
}

// Visualization

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

// Draw Background 
function drawBackground() {
}

// Draw Element
function drawElement(element) {
    c.fillStyle = element.color;
    c.fillRect(element.x, element.y, element.width, element.height)
}

// Draw Net
function drawnet(){
    c.fillStyle = "rgba(255, 255, 255 ,.75)";
    c.fillRect(canvas.width/2 -2.5,0,5,canvas.height)
}

function init() {
    // Class
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
    // First Paddle / PlayerOne
    const playerOne = new Element({
        x: 0,
        y: canvas.height / 2 - 40,
        width: canvas.width/40,
        height: canvas.height/5,
        color: colorVariable,
    });
    // Second Paddle / PlayerTwo
    const playerTwo = new Element({
        x: canvas.width-20,
        y: canvas.height / 2 - 40,
        width: canvas.width/40,
        height: canvas.height/5,
        color: colorVariable,
    });
    // Ball
    const ball = new Element({
        width: canvas.width/35,
        height: canvas.width/35,
        color: colorVariable,
        speed: 0.25,
        direction: { x: -1, y: 1 }
    });

    function ResetBall(score) {
        prvvelocity *= -1;
        ball.speed = 0;
        ball.velocity = {x: prvvelocity*-1, y: 1};
    
        if(score == 1) {
            scoreOne += 1
        } else if(score == 2) {
            scoreTwo += 1
        }
    
        ball.x = canvas.width/2 - ball.width/2
        ball.y = canvas.height/2 - ball.height/2
        ball.speed = 0.25
    
        if(scoreOne >= MaxScore || scoreTwo >= MaxScore) {
            EndGame();
        }
    }
    ResetBall(0)
    
    // Draw Scene
    function draw() {
        c.clearRect(0,0,canvas.width,canvas.height)
        drawBackground();
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

    // Game Loop
    function Loop(){
        var now = Date.now();
        dt = now - lastUpdate;
        lastUpdate = now;
    
        if(hasgamestarted == true) {
            BallCollisions();
            moveP1()
            moveP2(difficulty)
            draw();
        }
        window.requestAnimationFrame(Loop);
    }
    Loop();
    
    // Game Logic
    
    // Move Ball 
    function MoveBall() {
        //Speed Up Ball
        ball.speed += .000025 * dt
    
        //Move Ball in Direction
        ball.x += ball.speed * ball.velocity.x * dt
        ball.y += ball.speed * ball.velocity.y * dt
    }
    
    function BallCollisions() {
    
        // Vertical Wall
        if(ball.y + ball.height >= canvas.height) {
            // Bounce
            ball.velocity.y = -1;
            playAudio("../sounds/peep.wav")
        }
        if(ball.y <= 0) {
            // Bounce
            ball.velocity.y = 1;
            playAudio("../sounds/peep.wav")
        }
    
        // Horizontal Walls
        if(ball.x + ball.width >= canvas.width) {
            //Update Scrore
            ResetBall(1)
            playAudio("../sounds/explosion.wav")
        }
        if(ball.x <= 0) {
            //Update Scrore
            ResetBall(2)
            playAudio("../sounds/explosion.wav")
        }
    
        // Paddle Collision
        if(isRectangleCollision(playerOne, ball)) {
            ball.velocity.x = 1;
            playAudio("../sounds/peep.wav")
        }
    
        if(isRectangleCollision(playerTwo, ball)) {
            ball.velocity.x = -1;
            playAudio("../sounds/peep.wav")
        }
    
        MoveBall()
    }
    
    // Collision Testing
    
    // ChatGPT Solution
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
    
    function GetMousePaddlePos(paddle) {
        let Ypos = yM-playerOne.height/2    
        return Ypos - canvas.getBoundingClientRect().top
    }
    
    function getAiPosition(paddle) {
            // Get the ball's position
            const ballX = ball.x + ball.width / 2;
            const ballY = ball.y + ball.height / 2;
          
            // Calculate the distance between the ball and the paddle
            // const distanceX = ballX - (paddle.x + paddle.width / 2);
            const distanceY = ballY - (paddle.y + paddle.height / 2);
          
            // Move the paddle towards the ball
            // paddle.x += distanceX * difficulty * dt;
            // paddle.y += distanceY * difficulty * dt;
    
            return paddle.y + distanceY * difficulty * dt;
    }
    
    function moveP1() {
        if(mode == "pvai") {
            playerOne.y = GetMousePaddlePos(playerOne)
        } else if(mode == "aivai") {
            playerOne.y = getAiPosition(playerOne)
        } else if(mode == "pvp") {
            playerOne.y = 0
        }
    
        // Keep the paddle within the boundaries of the canvas
        if (playerOne.x < 0) {
            playerOne.x = 0;
        } else if (playerOne.x + playerOne.width > canvas.width) {
            playerOne.x = canvas.width - playerOne.width;
        }
        if (playerOne.y < 0) {
            playerOne.y = 0;
        } else if (playerOne.y + playerOne.height > canvas.height) {
            playerOne.y = canvas.height - playerOne.height;
        }
    }
    
    function moveP2( difficulty = 0.1) {
        if(mode == "pvai" || mode == "aivai") {
            playerTwo.y = getAiPosition(playerTwo)
        } else if(mode == "pvp") {
            playerTwo.y = PeerPosition
        }
      
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
}