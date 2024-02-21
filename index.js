function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}
let startaudio = new Audio('./assets/Mario, Here We Go - QuickSounds.com.mp3');
 

let jumpaudio = new Audio('./assets/maro-jump-sound-effect_1.mp3');




const imagebase = createImage('./assets/tile_center.png');
const backgroundimg=createImage('./assets/galactic-night-sky-astronomy-science-combined-generative-ai (1).jpg');
const bg2=createImage('./assets/bg2.jpg')
const bg3=createImage('./assets/bg3.jpg')
const imgcoin=createImage('./assets/coin_01.png')


 

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

function setCanvasDimensions() {
    canvas.width = 1024;
    canvas.height = 576;
}

setCanvasDimensions();

const gravity = 0.78;

let score = 0; // Add a variable to keep track of the score
const scoreElement = document.getElementById('score');


function updateScore() {
    scoreElement.textContent = 'SCORE: ' + score;
     
    
    
}

function collectCoin() {
    score++;
 
    updateScore();
}

function resetscore(){
    score=0;
}
class Player {
    constructor() {
        this.height = 30;
        this.width = 30;

        this.position = {
            x: 50,
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            // this.velocity.y = 0;
        }
    }

    isTouching(coin) {
        return (
            this.position.x < coin.position.x + coin.width &&
            this.position.x + this.width > coin.position.x &&
            this.position.y < coin.position.y + coin.height &&
            this.position.y + this.height > coin.position.y
        );
    }
}

class Platform {
    constructor(x, y, image) {
        this.position = {
            x: x,
            y: y,
        };
        this.image = image;
        this.height = image.height;
        this.width = image.width;
        this.hasCoin = false; // Track whether a coin exists on the platform
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
        // Draw a coin if it exists on the platform
        if (this.hasCoin) {
            const coin = new Coin(this.position.x + this.width / 2, this.position.y - 50, imgcoin);
            coin.draw();
            // Check if the player is touching the coin
            if (player.isTouching(coin)) {
                this.hasCoin = false; // Remove the coin
                score++; // Increment the score
                console.log("Score: " + score); // Log the score
            }
        }
    }
}


class Coin {
    constructor(x, y, image) {
        this.position = {
            x: x,
            y: y,
        };
        this.image = image;
        this.height = image.height;
        this.width = image.width;
         
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}



const platforms = [];
generateBasePlatforms(200,300);  
// Define an array of Y-positions
const yPositions = [300, 150,75,130,170, 250,200, 100,50];

// Call the function with the desired parameters
generatePlatformsAtDistance(50, 500, yPositions);
 
 

const player = new Player();

 

class GenericObjects{
    constructor(x, y, image) {
        this.position = {
            x: x,
            y: y,
        };
        this.image = image;
        this.height = image.height;
        this.width = image.width;
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const genericobjects= [new GenericObjects(0,0,backgroundimg),new GenericObjects(backgroundimg.width,0,bg2),new GenericObjects(bg2.width+backgroundimg.width,0,bg2),new GenericObjects((bg2.width)*2+backgroundimg.width,0,bg3)]

let keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    }
}

let scrolloffset = 0;

function restartGame() {
    // Reset player position and velocity
    player.position.x = 100;
    player.position.y = 100;
    player.velocity.x = 0;
    player.velocity.y = 0;
    resetscore();
    updateScore();

     
    startaudio.play();
    // Reset scroll offset
    scrolloffset = 0;
   
    // Regenerate platforms
    platforms.length = 0; // Clear the existing platforms array
    generateBasePlatforms(200, 300);
    const yPositions = [300, 150,75,130,170, 250,200, 100,50];

// Call the function with the desired parameters
    generatePlatformsAtDistance(50, 300, yPositions);

   

    // Reset generic objects
    genericobjects.length = 0; // Clear the existing generic objects array
    genericobjects.push(new GenericObjects(0, 0, backgroundimg));
    genericobjects.push(new GenericObjects(backgroundimg.width, 0, bg2));
    genericobjects.push(new GenericObjects(bg2.width + backgroundimg.width, 0, bg2));
    genericobjects.push(new GenericObjects((bg2.width) * 2 + backgroundimg.width, 0, bg3));
     keys = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        }
    }
 
}


function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
   
    updateScore();
    genericobjects.forEach((genobj) => {
        genobj.draw();
    })

  
    

    platforms.forEach((platform) => {
        platform.draw();
    })
    player.update();
    platforms.forEach((platform) => {

        if (keys.right.pressed == true && player.position.x < 200) {
            player.position.x += 3
            

        } else if ((keys.left.pressed == true && player.position.x > 700)||(keys.left.pressed && scrolloffset===0 && player.position.x>0)) {
            player.position.x -= 3

        } else {
            player.velocity.x = 0;
            if (keys.left.pressed && scrolloffset>0) {
                platform.position.x += 5;
                
                scrolloffset -= 5;
                genericobjects.forEach((obj)=>{
                    obj.position.x +=0.01;
                })
                 

            } else if (keys.right.pressed) {
                platform.position.x -= 5;
                
                genericobjects.forEach((obj)=>{
                    obj.position.x -=0.01;
                })
                

                scrolloffset += 5;
            }
        }
        // console.log(scrolloffset);
        //player-platform handling   

        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {

            player.velocity.y = 0;
        }



        
    

 
  
       

      
    })

   //winning scenario
    if (score ==60 ) {
        alert('YOU WIN THE GAME, Press "ctrl+r" to restart ');
    }

    else if(score<50 && scrolloffset==4776000){
        alert('You did not collected required coins , You LOST');
    }

 
  

    //lose scenario
    if(player.position.y>=canvas.height){
        setTimeout(restartGame,1000);
        
    }

  

}

animate();

addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = true;
            break;
        case 83:
            break;
        case 68:
            keys.right.pressed = true;
            break;
        case 87:
            player.velocity.y -= 25;
            jumpaudio.play();
            break;
    }
})

addEventListener("keyup", ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = false;
            break;
        case 83:
            break;
        case 68:
            keys.right.pressed = false;
            break;
        case 87:
            break;
    }
})
document.addEventListener("dblclick", (event) => {
    // Check if the double-clicked key is "w" (key code 87)
    if (event.keyCode === 87) {
        // Prevent the default behavior of the double-click event
        event.preventDefault();
    }
});
function generateBasePlatforms(numPlatforms, gap) {
    const platformWidth = imagebase.width; // Width of platforms
    const platformHeight = 20; // Height of platforms

    let prevX = 0; // Initialize the X-coordinate of the previous platform to 0

    for (let i = 0; i < numPlatforms; i++) {
        const x = prevX; // X-coordinate of the new platform (same as prevX)
        const y = 500; // Y-coordinate of the platform
        
        const platform = new Platform(x, y, imagebase); // Create a new platform
        platforms.push(platform); // Add platform to the array
        
        // Randomly decide whether to create a coin on this platform
        if (Math.random() < 0.3) { // Adjust the probability as needed
            platform.hasCoin = true;
        }

        prevX += platformWidth; // Update the X-coordinate of the previous platform to move to the next position
        if ((i + 1) % 10 === 0) {
            prevX += gap; // Add gap after every 10th platform
        }
    }
}
function generatePlatformsAtDistance(numPlatforms, distance, yPositions) {
    const platformWidth = imagebase.width; // Width of platforms
    const platformHeight = 20; // Height of platforms

    let prevX = 0; // Initialize the X-coordinate of the previous platform to 0
    let yIndex = 0; // Index to iterate over yPositions array

    for (let i = 0; i < numPlatforms; i++) {
        const x = prevX + distance; // X-coordinate of the new platform with a fixed distance from the previous one
        const y = yPositions[yIndex]; // Y-coordinate of the platform

        const platform = new Platform(x, y, imagebase); // Create a new platform
        platforms.push(platform); // Add platform to the array

        // Randomly decide whether to create a coin on this platform
        if (Math.random() < 0.3) { // Adjust the probability as needed
            platform.hasCoin = true;
        }

        prevX = x + platformWidth; // Update the X-coordinate of the previous platform to move to the next position
        yIndex = (yIndex + 1) % yPositions.length; // Increment yIndex, looping back to 0 if it exceeds the length of yPositions
    }
}
