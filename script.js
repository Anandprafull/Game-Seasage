const canvas = document.getElementById("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
const c = canvas.getContext("2d")

//#region [Classes]
class Draw {
    static drawRotatedRectangle(x, y, width, height, theta, color, flip, wired) {
        if (wired) {
            if (flip) {
                c.save();
                c.strokeStyle = color
                c.translate(x + width / 2, y + height / 2);
                c.rotate((Math.PI / 2 - theta) + (3 * Math.PI / 2));
                c.scale(-1, 1)
                c.strokeRect(-width / 2, -height / 2, width, height)
                c.restore();
            }
            else {
                c.save();
                c.strokeStyle = color
                c.translate(x + width / 2, y + height / 2);
                c.rotate(theta);
                c.strokeRect(-width / 2, -height / 2, width, height)
                c.restore();
            }
        }
        else {
            if (flip) {
                c.save();
                c.fillStyle = color
                c.translate(x + width / 2, y + height / 2);
                c.rotate((Math.PI / 2 - theta) + (3 * Math.PI / 2));
                c.scale(-1, 1)
                c.fillRect(-width / 2, -height / 2, width, height)
                c.restore();
            }
            else {
                c.save();
                c.fillStyle = color
                c.translate(x + width / 2, y + height / 2);
                c.rotate(theta);
                c.fillRect(-width / 2, -height / 2, width, height)
                c.restore();
            }
        }
    }
    static drawRotatedImageCropped(img,
        sourceWidth, sourceHeight,
        x, y,
        finalWidth = sourceWidth, finalHeight = sourceHeight,
        theta = 0,
        flip = 0,
        sourceX = 0, sourceY = 0) {
        if (flip) {
            c.save();
            c.translate(x + finalWidth / 2, y + finalHeight / 2);
            c.rotate((Math.PI / 2 - theta) + (3 * Math.PI / 2));
            c.scale(-1, 1)
            c.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight)
            c.restore();
        }
        else {
            c.save();
            c.translate(x + finalWidth / 2, y + finalHeight / 2);
            c.rotate(theta);
            c.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight)
            c.restore();
        }
    }
}
class Entity {
    constructor(x, y, width, height, imgX, imgY, imgwidth, imgheight) {
        this.x = x
        this.y = y
        this.imgX = imgX
        this.imgY = imgY
        this.imgwidth = imgwidth
        this.imgheight = imgheight
        this.width = width
        this.height = height
    }

    drawGizmo() {
        Draw.drawRotatedRectangle(this.x, this.y, this.width, this.height, 0, "black", 0, 1)
    }

    translate(dx, dy) {
        this.x += dx
        this.y += dy
        this.imgX += dx
        this.imgY += dy
    }
}
class Player extends Entity {
    constructor(x, y, width, height, imgX, imgY, imgwidth, imgheight, src, noOfFrames, speedFactor, scaleFactor) {
        super(x, y, width, height, imgX, imgY, imgwidth, imgheight)
        this.img = new Image()
        this.img.src = src
        this.scaleFactor = scaleFactor
        this.noOfFrames = noOfFrames
        this.speedFactor = speedFactor
        this.idleAnimCounterI = 1
        this.idleAnimCounterJ = 1
        this.AnimController = { up: false, down: false, right: false, left: false }
        this.restDirection = false
    }

    idle(restDirection) {
        this.idleAnimCounterJ++
        if (this.idleAnimCounterJ == this.speedFactor) {
            this.idleAnimCounterJ = 0
            this.idleAnimCounterI++
        }
        if (this.idleAnimCounterI == this.noOfFrames) {
            this.idleAnimCounterI = 0
        }
        // restDirection = true for right
        // restDirection = false for left
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, 0, restDirection, this.idleAnimCounterI * 100, 0)
    }

    up(restDirection) {
        this.idleAnimCounterJ++
        if (this.idleAnimCounterJ == this.speedFactor) {
            this.idleAnimCounterJ = 0
            this.idleAnimCounterI++
        }
        if (this.idleAnimCounterI == this.noOfFrames) {
            this.idleAnimCounterI = 0
        }
        // restDirection = true for right
        // restDirection = false for left
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, -Math.PI / 6, restDirection, this.idleAnimCounterI * 100, 0)
    }

    down(restDirection) {
        this.idleAnimCounterJ++
        if (this.idleAnimCounterJ == this.speedFactor) {
            this.idleAnimCounterJ = 0
            this.idleAnimCounterI++
        }
        if (this.idleAnimCounterI == this.noOfFrames) {
            this.idleAnimCounterI = 0
        }
        // restDirection = true for right
        // restDirection = false for left
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, Math.PI / 6, restDirection, this.idleAnimCounterI * 100, 0)
    }
}
class Garbage extends Entity {
    constructor(x, y, width, height, imgX, imgY, imgwidth, imgheight, src, scaleFactor, theta, name) {
        super(x, y, width, height, imgX, imgY, imgwidth, imgheight)
        this.img = new Image()
        this.img.src = src
        this.scaleFactor = scaleFactor
        this.theta = theta
        this.name = name
    }

    draw() {
        Draw.drawRotatedImageCropped(this.img, this.imgwidth, this.imgheight, this.imgX, this.imgY, this.imgwidth * this.scaleFactor, this.imgheight * this.scaleFactor, this.theta)
    }
}
//#endregion

//#region [Input setup]
const movementInput = {
    up: { down: false },
    right: { down: false },
    down: { down: false },
    left: { down: false },
}
window.addEventListener("keydown", (e) => {
    if (e.key == "w") movementInput.up.down = true
    if (e.key == "d") movementInput.right.down = true
    if (e.key == "s") movementInput.down.down = true
    if (e.key == "a") movementInput.left.down = true
})
window.addEventListener("keyup", (e) => {
    if (e.key == "w") movementInput.up.down = false
    if (e.key == "d") movementInput.right.down = false
    if (e.key == "s") movementInput.down.down = false
    if (e.key == "a") movementInput.left.down = false
})
//#endregion

//#region [Setting up Garbages]
const Garbages = new Array()
Garbages[0] = new Garbage(0, 0, 85, 234 * 0.5, 22, 0, 100, 234, "./Assets/Garbages/bottle.png", 0.5, Math.PI / 6, "Bottle")
Garbages[1] = new Garbage(0, 0, 55, 38, 20, -12, 100, 422, "./Assets/Garbages/cigarette.png", 0.15, -Math.PI / 3, "Cigarette")
Garbages[2] = new Garbage(0, 0, 82, 66, 15, -10, 100, 181, "./Assets/Garbages/coffee_cup.png", 0.5, -Math.PI / 3, "CoffeeCup")
for (let i = 0; i < Garbages.length; i++) {
    let x;
    let y;
    x = Math.random() * (canvas.width - Garbages[i].width)
    if (x < 230) {
        y = Math.random() * (canvas.height - Garbages[i].height - 199) + 200
    }
    else {
        y = Math.random() * (canvas.height - Garbages[i].height)
    }
    Garbages[i].translate(x, y)
}
//#endregion

//#region [UI]
c.font = "40px san"
const box = document.getElementById("box")
const info = document.getElementById("info")
const collect = document.getElementById("collect")
const ignore = document.getElementById("ignore")
box.style.display = "none"
collect.addEventListener("click", () => {
    box.style.display = "none"
    playable = true
    movementInput.down.down = false
    movementInput.up.down = false
    movementInput.left.down = false
    movementInput.right.down = false
})
ignore.addEventListener("click", () => {
    box.style.display = "none"
    playable = true
    movementInput.down.down = false
    movementInput.up.down = false
    movementInput.left.down = false
    movementInput.right.down = false
})

//#endregion

//#region [Smartphone controls]
function isSmartphone() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile/.test(userAgent);
}
const up = document.getElementById("up")
const down = document.getElementById("down")
const left = document.getElementById("left")
const right = document.getElementById("right")
if (isSmartphone()) {
    up.addEventListener("touchstart", (e) => {
        movementInput.up.down = true
    })
    up.addEventListener("touchend", (e) => {
        movementInput.up.down = false
    })
    down.addEventListener("touchstart", (e) => {
        movementInput.down.down = true
    })
    down.addEventListener("touchend", (e) => {
        movementInput.down.down = false
    })
    left.addEventListener("touchstart", (e) => {
        movementInput.left.down = true
    })
    left.addEventListener("touchend", (e) => {
        movementInput.left.down = false
    })
    right.addEventListener("touchstart", (e) => {
        movementInput.right.down = true
    })
    right.addEventListener("touchend", (e) => {
        movementInput.right.down = false
    })
} else {
    up.style.display = "none"
    down.style.display = "none"
    left.style.display = "none"
    right.style.display = "none"
}

//#endregion

const player = new Player(10, 10, 220, 84 * 2, 15, 50, 100, 50, "./Assets/DiverFrames.png", 10, 20, 2)
const playerSpeed = 4

let playable = true
let lastTime = 0;
let deltaTime = 0;
let score = 0; // Initialize score

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        movementInput.up.down = false
        movementInput.down.down = false
        movementInput.left.down = false
        movementInput.right.down = false
    }
});

function main(currentTime) {
    currentTime *= 0.1;
    deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.save()
    c.fillStyle = "rgb(1 95 108)"
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
    if (playable) {
        playerMovement()
    }
    collisionDetection()
    for (let i = 0; i < Garbages.length; i++) {
        Garbages[i].draw()
    }
    if (playable) {
        if (player.AnimController.up) {
            player.up(player.restDirection)
        }
        else if (player.AnimController.down) {
            player.down(player.restDirection)
        }
        else if (player.AnimController.right) {
            player.idle(player.restDirection)
        }
        else if (player.AnimController.left) {
            player.idle(player.restDirection)
        }
        else {
            player.idle(player.restDirection)
        }
    }
    else {
        player.idle(playable.restDirection)
    }
    c.fillStyle = "white";
    c.fillText("Score: " + score, 10, 50); // Display score
    requestAnimationFrame(main)
}
main(0)

function playerMovement() {
    // Moving Player
    {
        if (movementInput.left.down) {
            player.AnimController.left = true
            player.restDirection = true
            player.translate(-playerSpeed * deltaTime, 0)
        }
        else {
            player.AnimController.left = false
        }
        if (movementInput.right.down) {
            player.AnimController.right = true
            player.translate(playerSpeed * deltaTime, 0)
            player.restDirection = false
        }
        else {
            player.AnimController.right = false
        }
        if (movementInput.up.down) {
            player.AnimController.up = true
            player.translate(0, -playerSpeed * deltaTime)
        }
        else {
            player.AnimController.up = false
        }
        if (movementInput.down.down) {
            player.AnimController.down = true
            player.translate(0, playerSpeed * deltaTime)
        }
        else {
            player.AnimController.down = false
        }
    }
    // Adding Movement Constraint
    {
        if (player.x < 0) {
            player.translate(playerSpeed * deltaTime, 0)
        }
        if (player.x + player.width > canvas.width) {
            player.translate(-playerSpeed * deltaTime, 0)
        }
        if (player.y < 0) {
            player.translate(0, playerSpeed * deltaTime)
        }
        if (player.y + player.height > canvas.height) {
            player.translate(0, -playerSpeed * deltaTime)
        }
    }
}

function collisionDetection() {
    // Collision Detection
    for (let i = 0; i < Garbages.length; i++) {
        for (let i = 0; i < Garbages.length; i++) {
            if (!((player.x + player.width < Garbages[i].x) || (player.x > Garbages[i].x + Garbages[i].width) || (player.y + player.height < Garbages[i].y) || (player.y > Garbages[i].y + Garbages[i].height))) {
                c.fillText("collding with " + Garbages[i].name, 100, 50 * i + 100)
                box.style.display = "flex"
                playable = false
                info.innerText = Garbages[i].name
                Garbages.splice(i, 1);
                score += 10; // Update score
                break;
            }
        }
    }
}