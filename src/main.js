const ship = document.querySelector('.player');
const area = document.querySelector('.wrapper');
const alienIMG = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png']
const instructionsText = document.querySelector('.game-instructions');
const start = document.querySelector('.start');
let alienInterval;


function fly(event){
    if(event.key === 'ArrowUp' || event.key === 'w') {
        event.preventDefault();
        moveUp();
    }
    if(event.key === 'ArrowDown' || event.key === 's'){
        event.preventDefault();
        moveDown();  
    }
    if(event.key === " "){
        event.preventDefault();
        fire();  
    }
}

function moveUp(){
    let top = getComputedStyle(ship).getPropertyValue('top');
    if(top === '0px') {
        return;
    }else {
        let position = parseInt(top);
        position -= 50;
        
        ship.style.top = `${position}px`;
    }
}

function moveDown(){
    let top = getComputedStyle(ship).getPropertyValue('top');
    if(top === '550px') {
        return;
    }else {
        let position = parseInt(top);
        position += 50;
        
        ship.style.top = `${position}px`;
    }
}

window.addEventListener('keydown',fly);

function fire() {
    let laser = createLaserElement();
    area.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let positionX = parseInt(window.getComputedStyle(ship).getPropertyValue('left'));
    let positionY = parseInt(window.getComputedStyle(ship).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = './img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${positionX}px`
    newLaser.style.top = `${positionY - 10}px`
    return newLaser;
} 

function moveLaser(laser){
    let LaserInterval = setInterval(() => {
        let positionX = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { 
            if(checkLaserCollision(laser, alien)) {
                alien.src = './img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if(positionX === 348){
            laser.remove();
        } else {
            laser.style.left = `${positionX + 8}px` ;
            console.log(positionX);
        }
    }, 10);
}

function createAlien() {
    let newAlien = document.createElement('img');
    let alienSprite = alienIMG[Math.floor(Math.random() * alienIMG.length)]; 
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    area.appendChild(newAlien);
    moveAlien(newAlien);
}


function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

function checkLaserCollision(laser, alien){
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }


}

start.addEventListener('click', (event) => {
    play();
})

function play() {
    start.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', fly);
    alienInterval = setInterval(() => {
        createAlien();
    }, 2000);
}


function gameOver() {
    window.removeEventListener('keydown', fly);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        ship.style.top = "250px";
        start.style.display = "block";
        instructionsText.style.display = "block";
        location.reload();
    });
}