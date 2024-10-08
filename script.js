const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")

// Resize canvas to fit browser window
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    // Optionally, you can call this to redraw the background if needed
    // c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Set initial canvas size
resizeCanvas()

// Handle window resize event
window.addEventListener("resize", resizeCanvas)

const backgroundImage = new Image();
backgroundImage.src = "./Assets/Bg/bgtwo.png"; // Replace with the path to your background image
backgroundImage.onload = function() {
    main(); // Start the game loop only after the image has loaded
};

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
const Garbages = new Array();
Garbages[0] = new Garbage(0, 0, 85, 234 * 0.5, 22, 0, 100, 234, "./Assets/Garbages/bottle.png", 0.5, Math.PI / 6, "Bottle");
Garbages[1] = new Garbage(0, 0, 55, 38, 20, -12, 100, 422, "./Assets/Garbages/cigarette.png", 0.15, -Math.PI / 3, "Cigarette");
Garbages[2] = new Garbage(0, 0, 82, 66, 15, -10, 100, 181, "./Assets/Garbages/coffee_cup.png", 0.5, -Math.PI / 3, "Coffee Cup");
Garbages[3] = new Garbage(0, 0, 80, 60, 20, -15, 100, 200, "./Assets/Garbages/plastic_bag.png", 0.4, -Math.PI / 4, "Plastic Bag");
Garbages[4] = new Garbage(0, 0, 90, 80, 30, -25, 100, 150, "./Assets/Garbages/food_packaging.png", 0.5, Math.PI / 6, "Food Packaging");
Garbages[5] = new Garbage(0, 0, 85, 200, 30, -20, 100, 400, "./Assets/Garbages/household_cleaner_bottle.png", 0.6, -Math.PI / 6, "Household Cleaner Bottle");
Garbages[6] = new Garbage(0, 0, 60, 100, 20, -15, 100, 150, "./Assets/Garbages/mask.png", 0.3, -Math.PI / 2, "Mask");
Garbages[7] = new Garbage(0, 0, 60, 90, 25, -10, 100, 200, "./Assets/Garbages/tooth_brush.png", 0.3, Math.PI / 4, "Tooth Brush");
Garbages[8] = new Garbage(0, 0, 80, 80, 30, -20, 100, 150, "./Assets/Garbages/yogurt_cup.png", 0.4, -Math.PI / 3, "Yogurt Cup");

for (let i = 0; i < Garbages.length; i++) {
    let x;
    let y;
    x = Math.random() * (canvas.width - Garbages[i].width);
    if (x < 230) {
        y = Math.random() * (canvas.height - Garbages[i].height - 199) + 200;
    } else {
        y = Math.random() * (canvas.height - Garbages[i].height);
    }
    Garbages[i].translate(x, y);
}
//#endregion

//#region [UI]
c.font = "40px san"
const box = document.getElementById("box")
const info = document.getElementById("info")
const collect = document.getElementById("collect")
box.style.display = "none"

collect.addEventListener("click", () => {
    box.style.display = "none";
    playable = true;
    movementInput.down.down = false;
    movementInput.up.down = false;
    movementInput.left.down = false;
    movementInput.right.down = false;
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

const player = new Player(10, 10, 110, 42 * 2, 15, 50, 100, 50, "./Assets/DiverFrames.png", 10, 20, 1.5)
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

//#region [Main Function]
function main(currentTime = 0) {
    currentTime *= 0.1;
    deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    c.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw background

    if (playable) {
        playerMovement(); // Handle player movement
    }

    collisionDetection(); // Handle collisions

    for (let i = 0; i < Garbages.length; i++) {
        Garbages[i].draw(); // Draw garbage items
    }

    if (playable) {
        // Handle animations based on direction
        if (movementInput.up.down) {
            player.up(player.restDirection);
        } else if (movementInput.down.down) {
            player.down(player.restDirection);
        } else if (movementInput.left.down) {
            player.idle(player.restDirection);
        } else if (movementInput.right.down) {
            player.idle(player.restDirection);
        } else {
            player.idle(player.restDirection);
        }
    } else {
        player.idle(player.restDirection);
    }

    c.fillStyle = "white";
    c.fillText("Score: " + score, 10, 50); // Display score
    requestAnimationFrame(main); // Request next frame
}
//#endregion

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

// Function to reinitialize all garbage items
function initializeGarbages() {
    Garbages.push(
        new Garbage(0, 0, 85, 234 * 0.5, 22, 0, 100, 234, "./Assets/Garbages/bottle.png", 0.5, Math.PI / 6, "Bottle"),
        new Garbage(0, 0, 55, 38, 20, -12, 100, 422, "./Assets/Garbages/cigarette.png", 0.15, -Math.PI / 3, "Cigarette"),
        new Garbage(0, 0, 82, 66, 15, -10, 100, 181, "./Assets/Garbages/coffee_cup.png", 0.5, -Math.PI / 3, "Coffee Cup"),
        new Garbage(0, 0, 80, 60, 20, -15, 100, 200, "./Assets/Garbages/plastic_bag.png", 0.4, -Math.PI / 4, "Plastic Bag"),
        new Garbage(0, 0, 90, 80, 30, -25, 100, 150, "./Assets/Garbages/food_packaging.png", 0.5, Math.PI / 6, "Food Packaging"),
        new Garbage(0, 0, 85, 200, 30, -20, 100, 400, "./Assets/Garbages/household_cleaner_bottle.png", 0.6, -Math.PI / 6, "Household Cleaner Bottle"),
        new Garbage(0, 0, 60, 100, 20, -15, 100, 150, "./Assets/Garbages/mask.png", 0.3, -Math.PI / 2, "Mask"),
        new Garbage(0, 0, 60, 90, 25, -10, 100, 200, "./Assets/Garbages/tooth_brush.png", 0.3, Math.PI / 4, "Tooth Brush"),
        new Garbage(0, 0, 80, 80, 30, -20, 100, 150, "./Assets/Garbages/yogurt_cup.png", 0.4, -Math.PI / 3, "Yogurt Cup")
    );

    for (let i = 0; i < Garbages.length; i++) {
        let x = Math.random() * (canvas.width - Garbages[i].width);
        let y = x < 230 ? Math.random() * (canvas.height - Garbages[i].height - 199) + 200 : Math.random() * (canvas.height - Garbages[i].height);
        Garbages[i].translate(x, y);
    }
}

// Add this function to generate and position garbage items
function generateGarbageItems() {
    Garbages.forEach((garbage, index) => {
        let x, y;
        x = Math.random() * (canvas.width - garbage.width);
        if (x < 230) {
            y = Math.random() * (canvas.height - garbage.height - 199) + 200;
        } else {
            y = Math.random() * (canvas.height - garbage.height);
        }
        garbage.translate(x, y); // Reset position
    });
}

// Garbage info content
const garbageInfo = {
    "Bottle": "Plastic bottles can take up to 450 years to decompose, polluting our oceans and harming marine life.",
    "Cigarette": "Cigarette butts are the most littered item in the world and can take up to 10 years to decompose.",
    "Coffee Cup": "Coffee cups are often made with plastic lining, making them non-recyclable and harmful to the environment.",
    "Plastic Bag": "Plastic bags can take hundreds of years to decompose and are a significant threat to wildlife.",
    "Food Packaging": "Food packaging waste contributes to landfill overflow and can release toxic substances into the environment.",
    "Household Cleaner Bottle": "Cleaning product containers can leach harmful chemicals into soil and water if not disposed of properly.",
    "Mask": "Disposable masks can take hundreds of years to decompose, contributing to ocean pollution.",
    "Tooth Brush": "Plastic toothbrushes are often not recyclable and contribute to plastic pollution.",
    "Yogurt Cup": "Yogurt cups can take hundreds of years to decompose, contributing to landfill waste."
};

function showPopup(garbageName) {
    const infoText = garbageInfo[garbageName] || "Unknown item.";
    box.style.display = "block"; // Show the popup box
    info.innerHTML = `You collected a ${garbageName}!<br>${infoText}`; // Display item and info
}   

// Modify `collisionDetection()` function to remove the item once collected and check if all items are collected
function collisionDetection() {
    for (let i = 0; i < Garbages.length; i++) {
        if (
            player.imgX < Garbages[i].imgX + Garbages[i].width &&
            player.imgX + player.width > Garbages[i].imgX &&
            player.imgY < Garbages[i].imgY + Garbages[i].height &&
            player.height + player.imgY > Garbages[i].imgY
        ) {
            // Show information box and pause game
            playable = false;

            showPopup(Garbages[i].name); // Call the popup function

            // Remove the collected garbage item from the array
            Garbages.splice(i, 1);
            score+=10;

            // Check if all items are collected
            checkAllCollected();
            break;
        }
    }
}

const resetButton = document.getElementById("reset"); // Assuming you have a button with id 'reset'
resetButton.addEventListener("click", resetGame);

// Function to display the reset button when all items are collected
function checkAllCollected() {
    if (Garbages.length === 0) { // If all garbage items are collected
        resetButton.style.display = "block"; // Show the reset button
        playable = false; // Disable player movement
    }
}

// Function to reset the game state
function resetGame() {
    window.location.reload(); // This will reload the webpage
}

// Call this function when the reset button is clicked
resetButton.addEventListener("click", () => {
    resetGame();
});