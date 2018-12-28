var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var winnerID = "";


var user_count = 50;
var objArray = [];

var paused = true;
setTimeout(function () {
    paused = false
} , 3000);

var totalKineticEnergy = 0;
var bumped = false;
var leftHeld = false;
var upHeld = false;
var rightHeld = false;
var downHeld = false;

var beep = new Audio('beep');
beep.volume = 0.002

var gravityOn = false;
var dragOn = true;
var soundOn = true;

var clearCanv = true;

var bigBalls = false;

// Comment this twi line if you want disable key shortcuts :
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDownHandler(event) {
    if (event.keyCode == 67) { // c
        objArray[objArray.length] = new Ball(randomX(), randomY(), 12,"not");
    } else if (event.keyCode == 80) { // p
        paused = !paused;
    } else if (event.keyCode == 71) { // g
        gravityOn = !gravityOn;
        dragOn = !dragOn;
    } else if (event.keyCode == 77) { // m
        soundOn = !soundOn;
    } else if (event.keyCode == 65) { // A
        leftHeld = true;
    } else if (event.keyCode == 87) { // W
        upHeld = true;
    } else if (event.keyCode == 68) { // D
        rightHeld = true;
    } else if (event.keyCode == 83) { // S
        downHeld = true;
    } else if (event.keyCode == 82) { // r
        objArray = [];
    } else if (event.keyCode == 75) { // k
        clearCanv = !clearCanv;
    } else if (event.keyCode == 88) { // x
        bigBalls = !bigBalls;
    }
}

function keyUpHandler(event) {
    if (event.keyCode == 65) { // A
        leftHeld = false;
    } else if (event.keyCode == 87) { // W
        upHeld = false;
    } else if (event.keyCode == 68) { // D
        rightHeld = false;
    } else if (event.keyCode == 83) { // S
        downHeld = false;
    }
}

function arrowControls() {
    if (leftHeld) { // left arrow
        for (var obj in objArray) {
            objArray[obj].dx -= 0.3;
        }
    } if (upHeld) { // up arrow
        for (var obj in objArray) {
            objArray[obj].dy -= 0.3;
        }
    } if (rightHeld) { // right arrow
        for (var obj in objArray) {
            objArray[obj].dx += 0.3;
        }
    } if (downHeld) { // down arrow
        for (var obj in objArray) {
            objArray[obj].dy += 0.3;
        }
    }
}

// Canvas Backgroun Color :
function canvasBackground() {
    canvas.style.backgroundColor = "rgb(227, 231, 224)"
    canvas.style.border = "none";
}

function wallCollision(ball) {
    if (ball.x - ball.radius + ball.dx < 0 ||
        ((ball.x - ball.radius + ball.dx < 220) && ((ball.y + 12) > 450)) ||
        ((ball.x + ball.radius + ball.dx > 280) && ((ball.y + 12) > 450)) ||
        ball.x + ball.radius + ball.dx > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius + ball.dy < 0 ||
        ((ball.y + ball.radius + ball.dy > canvas.height - 100) && (ball.x - 12 < 220)) ||
        ((ball.y + ball.radius + ball.dy > canvas.height - 100) && (ball.x + 12 > 280)) ||
        (ball.y + ball.radius + ball.dy > canvas.height) && ball.x > 220) {
        ball.dy *= -1;
    }
    if(ball.y - ball.radius + ball.dy > 500){
        paused = true;
        winnerID = ball.userID;
        show_winner();
        ball.y -= (12 * 2);
    //    redirect here
    //     window.location.href = "./show-winner.php";
        show_winner();
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
    }
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
    }
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
    }
}

function show_winner() {
    alert(winnerID)
    // $.ajax({
    //     type: 'post',
    //     url: 'show-winner.php',
    //     data: {
    //         source1: winnerID
    //     }
    // });
    window.location.href = "./show-winner.php";
}

function ballCollision() {
    for (var obj1 in objArray) {
        for (var obj2 in objArray) {
            if (obj1 !== obj2 && distanceNextFrame(objArray[obj1], objArray[obj2]) <= 0) {
                var theta1 = objArray[obj1].angle();
                var theta2 = objArray[obj2].angle();
                var phi = Math.atan2(objArray[obj2].y - objArray[obj1].y, objArray[obj2].x - objArray[obj1].x);
                var m1 = objArray[obj1].mass;
                var m2 = objArray[obj2].mass;
                var v1 = objArray[obj1].speed();
                var v2 = objArray[obj2].speed();

                var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                objArray[obj1].dx = dx1F;
                objArray[obj1].dy = dy1F;
                objArray[obj2].dx = dx2F;
                objArray[obj2].dy = dy2F;

                // if (soundOn)
                    // beep.play();
            }
        }
        wallCollision(objArray[obj1]);
    }
}

function staticCollision() {
    for (var obj1 in objArray) {
        for (var obj2 in objArray) {
            if (obj1 !== obj2 &&
                distance(objArray[obj1], objArray[obj2]) < objArray[obj1].radius + objArray[obj2].radius)
            {
                var theta = Math.atan2((objArray[obj1].y - objArray[obj2].y), (objArray[obj1].x - objArray[obj2].x));
                var overlap = objArray[obj1].radius + objArray[obj2].radius - distance (objArray[obj1], objArray[obj2]);
                var smallerObject = objArray[obj1].radius < objArray[obj2].radius ? obj1 : obj2
                objArray[smallerObject].x -= overlap * Math.cos(theta);
                objArray[smallerObject].y -= overlap * Math.sin(theta);
            }
        }
    }
}

function applyGravity() {
    for (var obj in objArray) {
        if (objArray[obj].onGround() == false) {
            objArray[obj].dy += 0.29;
        }   
    }
}

function applyDrag() {
    for (var obj in objArray) {
        objArray[obj].dx *= 0.99
        objArray[obj].dy *= 0.99
    }
}

function moveObjects() {
    for (var obj in objArray) {
        objArray[obj].x += objArray[obj].dx;
        objArray[obj].y += objArray[obj].dy;
    }    
}

function drawObjects() {
    for (var obj in objArray) {
        objArray[obj].drawR();
    }
}
console.log(objArray);
function draw() {

    if(clearCanv) clearCanvas();
    canvasBackground();

    if (!paused) {
        arrowControls();
        if (gravityOn) {
            applyGravity();
            applyDrag();
        }
        moveObjects();
    }

    drawObjects();
    staticCollision();
    ballCollision();
    //logger();
    requestAnimationFrame(draw);
}

function logger() {
    //log some stuff
}

// Ball Number :
// spawn the initial small thingies.
for (i = 100; i<100+user_count; i++) {
    objArray[objArray.length] = new Ball(randomX(), randomY(), 12, i+1);
    // objArray[11] = new Ball(randomX(), randomY(), 40, "Test")
    objArray[11] = new rect(0, 450, 220,100);
    // objArray[11] = new Ball(100,100,30,"Test");
}

bigBalls = false;

// manually spawn the few large ones that
// start with no velocity. because i'm lazy.
// for (i = 0; i<7; i++) {
//     var temp = new Ball(randomX(), randomY(), randomRadius());
//     temp.dx = 0;
//     temp.dy = 0;
//     objArray[objArray.length] = temp;
// }

// and manually spawn one large ball WITH initial velocity.
// just to impart some more initial energy in the system.


draw();

