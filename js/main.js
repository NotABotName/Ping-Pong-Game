const body = document.getElementById("body")
const canvas = document.getElementById("CanvasMain")
var c = canvas.getContext("2d")

var lastUpdate = Date.now();
var dt = 0;

canvas.height = 400;
canvas.width = 650;

var cw = canvas.width;
var ch = canvas.height;

var hasgamestarted = false;

//Pong Game !!

let scoreOne = 0;
let scoreTwo = 0;

// key movement 
window.addEventListener("keydown", doKeyDown, false);

function doKeyDown(e) {
    //start game 
    const key = e.key;
    console.log(key)
    //playerOne
    //playerTwo
    if(key == "i"){
    }
}

let xM = 0
let yM = 0
window.addEventListener("mousemove", getmousePos, false);

function getmousePos(ev){
    var bnds = ev.target.getBoundingClientRect();
    xM = ev.clientX;
    yM = ev.clientY;
}


class Element {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.color = options.color;
        this.speed = options.speed || 2;
        this.gravity = options.gravity;
    }
}

//first paddle
const playerOne = new Element({
    x: 0,
    y: ch / 2 - 40,
    width: 15,
    height: 80,
    color: "white",
    gravity: 2,
});
//second paddle
const playerTwo = new Element({
    x: cw-15,
    //y: ch / 2 - 40,
    y: 0,
    width: 20,
    height: ch,
    color: "white",
    gravity: 2,
});
//ball
const ball = new Element({
    x: cw / 2 -7.5,
    y: ch / 2 -7.5,
    width: 15,
    height: 15,
    color: "lightblue",
    speed: -1,
    gravity: 1,
});

// start game Promt
function PromtStart() {
    //background
    var bh = 50;
    var bw = 300;
    c.fillStyle = "white";
    c.fillRect(cw/2-bw/2, ch/2-bh/2, bw, bh)
    //text
    c.font = "20px Arial"
    c.fillStyle = "black"
    c.textAlign = "center"
    c.fillText("Press any button to start", cw/2, ch/2+10)
}

//draw Element
function drawElement(element) {
    c.fillStyle = element.color;
    c.fillRect(element.x, element.y, element.width, element.height)
}
//draw Elements
function drawElements() {
    c.clearRect(0,0,canvas.width,canvas.height)
    drawnet()
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

// Player score text
function displayScore(score, left) {
    c.font = "20px Arial"
    c.fillStyle = "white"
    c.textAlign = "center"
    c.fillText(score, canvas.width/2 + canvas.width/4*left, 30)
}

//loop
function loop(){
    var now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;

    ballmove();
    moveP1()
    ballbounce();    
    drawElements();
    window.requestAnimationFrame(loop);
}
loop()

function ballmove(){
    ball.x += ball.speed * dt *.25
    ball.y += ball.gravity * dt *.25
}

// ball bounce

function ballbounce(){
    // reset match and give points
    if(ball.x < 0) {
        ball.x = cw / 2 -7.5
        ball.y = ch / 2 -7.5
        ball.speed = -1;
        ball.gravity = 1;
        scoreTwo += 1;
    }
    if(ball.x > canvas.width-ball.width) {
        ball.x = cw / 2 -7.5
        ball.y = ch / 2 -7.5
        ball.speed = 1;
        ball.gravity = 1;
        scoreOne += 1;
    }

    //paddels
    if(ball.x > playerTwo.x - playerTwo.width && (ball.y - ball.height >= playerTwo.y && ball.y - ball.height <= playerTwo.y + playerTwo.height)) {
        ball.speed *= -1;
    }

    if((ball.x < playerOne.x + playerOne.width)  && (ball.y + ball.height >= playerOne.y && ball.y - ball.height <= playerOne.y + playerOne.height)) {
        ball.speed *= -1;
    }
    
    // walls
    if(ball.y < 0 || ball.y > canvas.height-ball.width) {
        ball.gravity *= -1;
    }
}

function moveP1() {
    let Ypos 
    Ypos = yM-playerOne.height/2    
    if(Ypos > canvas.getBoundingClientRect().top){  
        playerOne.y = Ypos - canvas.getBoundingClientRect().top
    }else{ playerOne.y = 0}
    if(Ypos > canvas.getBoundingClientRect().top+ch-playerOne.height){  
        playerOne.y = ch-playerOne.height
    }
}