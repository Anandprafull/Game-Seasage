const canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "./Assets/Bg/Background.png"; // Replace with the path to your background image
backgroundImage.onload = function() {
    main(); // Start the game loop only after the image has loaded
};

//#region [Classes]
class Draw {
    static drawRotatedRectangle(x, y, width, height, theta, color, flip, wired) {
        c.save();
        if (wired) {
            c.strokeStyle = color;
        } else {
            c.fillStyle = color;
        }
        c.translate(x + width / 2, y + height / 2);
        if (flip) {
            c.rotate((Math.PI / 2 - theta) + (3 * Math.PI / 2));
            c.scale(-1, 1);
        } else {
            c.rotate(theta);
        }
        if (wired) {
            c.strokeRect(-width / 2, -height / 2, width, height);
        } else {
            c.fillRect(-width / 2, -height / 2, width, height);
        }
        c.restore();
    }

    static drawRotatedImageCropped(img, sourceWidth, sourceHeight, x, y, finalWidth = sourceWidth, finalHeight = sourceHeight, theta = 0, flip = 0, sourceX = 0, sourceY = 0) {
        c.save();
        c.translate(x + finalWidth / 2, y + finalHeight / 2);
        if (flip) {
            c.rotate((Math.PI / 2 - theta) + (3 * Math.PI / 2));
            c.scale(-1, 1);
        } else {
            c.rotate(theta);
        }
        c.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
        c.restore();
    }
}

class Entity {
    constructor(x, y, width, height, imgX, imgY, imgwidth, imgheight) {
        this.x = x;
        this.y = y;
        this.imgX = imgX;
        this.imgY = imgY;
        this.imgwidth = imgwidth;
        this.imgheight = imgheight;
        this.width = width;
        this.height = height;
    }

    drawGizmo() {
        Draw.drawRotatedRectangle(this.x, this.y, this.width, this.height, 0, "black", 0, 1);
    }

    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.imgX += dx;
        this.imgY += dy;
    }
}

class Player extends Entity {
    constructor(x, y, width, height, imgX, imgY, imgwidth, imgheight, src, noOfFrames, speedFactor, scaleFactor) {
        super(x, y, width, height, imgX, imgY, imgwidth, imgheight);
        this.img = new Image();
        this.img.src = src;
        this.scaleFactor = scaleFactor;
        this.noOfFrames = noOfFrames;
        this.speedFactor = speedFactor;
        this.idleAnimCounterI = 1;
        this.idleAnimCounterJ = 1;
        this.AnimController = { up: false, down: false, right: false, left: false };
        this.restDirection = false;
    }

    idle(restDirection) {
        this.idleAnimCounterJ++;
        if (this.idleAnimCounterJ == this.speedFactor) {
            this.idleAnimCounterJ = 0;
            this.idleAnimCounterI++;
        }
        if (this.idleAnimCounterI == this.noOfFrames) {
            this.idleAnimCounterI = 0;
        }
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, 0, restDirection, this.idleAnimCounterI * 100, 0);
    }

    up(restDirection) {
        this.idleAnimCounterJ++;
        if (this.idleAnimCounterJ == this.speedFactor) {
            this.idleAnimCounterJ = 0;
            this.idleAnimCounterI++;
        }
        if (this.idleAnimCounterI == this.noOfFrames) {
            this.idleAnimCounterI = 0;
        }
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, -Math.PI / 6, restDirection, this.idleAnimCounterI * 100, 0);
    }

    down(restDirection) {
        this.idleAnimCounterJ++;
        if (this.idleAnimCounterJ == this.speedFactor) {
            this.idleAnimCounterJ = 0;
            this.idleAnimCounterI++;
        }
        if (this.idleAnimCounterI == this.noOfFrames) {
            this.idleAnimCounterI = 0;
        }
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, Math.PI / 6, restDirection, this.idleAnimCounterI * 100, 0);
    }
}

class Garbage extends Entity {
    constructor(x, y, width, height, imgX, imgY, imgwidth, imgheight, src, scaleFactor, theta, name) {
        super(x, y, width, height, imgX, imgY, imgwidth, imgheight);
        this.img = new Image();
        this.img.src = src;
        this.scaleFactor = scaleFactor;
        this.theta = theta;
        this.name = name;
    }

    draw() {
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, this.theta);
    }
}
//#endregion

//#region [Input setup]
const movementInput = {
    up: { down: false },
    right: { down: false },
    down: { down: false },
    left: { down: false }
};

window.addEventListener("keydown", (e) => {
    if (e.key == "w") movementInput.up.down = true;
    if (e.key == "d") movementInput.right.down = true;
    if (e.key == "s") movementInput.down.down = true;
    if (e.key == "a") movementInput.left.down = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key == "w") movementInput.up.down = false;
    if (e.key == "d") movementInput.right.down = false;
    if (e.key == "s") movementInput.down.down = false;
    if (e.key == "a") movementInput.left.down = false;
});
//#endregion

//#region [Setting up Garbages]
const Garbages = [];
Garbages[0] = new Garbage(0, 0, 85, 234 * 0.5, 22, 0, 100, 234, "./Assets/Garbages/bottle.png", 0.5, Math.PI / 6, "Bottle");
Garbages[1] = new Garbage(0, 0, 55, 38, 20, -12, 100, 422, "./Assets/Garbages/cigarette.png", 0.15, -Math.PI / 3, "Cigarette");
Garbages[2] = new Garbage(0, 0, 82, 66, 15, -10, 100, 181, "./Assets/Garbages/coffee_cup.png", 0.5, -Math.PI / 3, "Coffee Cup");
Garbages[3] = new Garbage(0, 0, 80, 60, 20, -15, 100, 200, "./Assets/Garbages/plastic_bag.png", 0.4, -Math.PI / 4, "Plastic Bag");
Garbages[4] = new Garbage(0, 0, 90, 80, 30, -25, 100, 150, "./Assets/Garbages/food_packaging.png", 0.5, Math.PI / 6, "Food Packaging");
Garbages[5] = new Garbage(0, 0, 85, 200, 30, -20, 100, 400, "./Assets/Garbages/household_cleaner_bottle.png", 0.6, -Math.PI / 6, "Household Cleaner Bottle");
Garbages[6] = new Garbage(0, 0, 60, 100, 20, -15, 100, 150, "./Assets/Garbages/mask.png", 0.3, -Math.PI / 2, "Mask");
Garbages[7] = new Garbage(0, 0, 60, 90, 25, -10, 100, 200, "./Assets/Garbages/tooth_brush.png", 0.3, Math.PI / 4, "Tooth Brush");
Garbages[8] = new Garbage(0, 0, 80, 80, 30, -20, 100, 150, "./Assets/Garbages/yogurt_cup.png", 0.4, -Math.PI / 3, "Yogurt Cup");
//#endregion

//#region [Player Setup]
const player = new Player(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100, 0, 0, 600, 800, "./Assets/Player/Player.png", 4, 10, 0.5);
//#endregion

//#region [Game Loop]
function main() {
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw the background
    player.drawGizmo();
    Garbages.forEach(garbage => garbage.draw());
    player.idle(false);
    update();
}

function update() {
    if (movementInput.up.down) player.translate(0, -2);
    if (movementInput.right.down) player.translate(2, 0);
    if (movementInput.down.down) player.translate(0, 2);
    if (movementInput.left.down) player.translate(-2, 0);
    requestAnimationFrame(main);
}
//#endregion
