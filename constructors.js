function Ball(x, y, radius, userID, color) {
    this.radius = radius;
    this.userID = userID;
    this.dx = randomDx();
    this.dy = randomDy();
    this.color = color
    // mass is that of a sphere as opposed to circle.
    // it *does* make a difference.
    this.mass = this.radius * this.radius * this.radius;
    this.x = x;
    this.y = (y>400) ? (y-150) : y;

    this.drawR = function() {
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.stroke();
        ctx.fill();
        ctx.font = "bold 10px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.userID, this.x - 9, this.y + 4);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.closePath();
    };

    // this.drawRec = function() {
    //     if(this.userID == 101){
    //         ctx.beginPath();
    //         ctx.rect(0, 470, 230, 30);
    //         ctx.rect(270, 470, 230, 30);
    //         ctx.fillStyle = "#BBC1C5";
    //         ctx.strokeStyle = "rgba(0,0,0,0.1)";
    //         ctx.stroke();
    //         ctx.fill();
    //         ctx.closePath();
    //     }
    // };

    this.speed = function() {
        // magnitude of velocity vector
        return Math.sqrt((this.dx * this.dx + this.dy * this.dy));
    };
    this.angle = function() {
        //angle of ball with the x axis
        return Math.atan2(this.dy , this.dx);
    };
    this.kineticEnergy = function () {
    // only for masturbation purposes, not rly used for computation.
        return (0.5 * this.mass * this.speed() * this.speed());
    };
    this.onGround = function() {
        return (this.y + this.radius >= canvas.height)
    };
}

function rect(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.dx = x;
    this.dy = y;
    this.drawR = function() {
        ctx.beginPath();
        ctx.rect(0, 450, this.width, this.height);
        ctx.rect(270, 450, this.width, this.height);
        ctx.fillStyle = "#0e3769";
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };
}