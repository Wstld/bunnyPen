//weapon selected
var weaponOfChoice = ""
//weapons
const LIGHTNING = "LIGHTNING"
const SQUISH = "SQUISH"
const EXPLODE = "EXPLODE"


//setup canvas 
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//menu btns
const explodeBtn = document.getElementById('explode')
const thunderBoltBtn = document.getElementById('lightning')
const squishBtn = document.getElementById('squish')

//image object holds all sprites.
const images = {};


const bunnyActions = ['up','down','left','right','still']

//arrays to hold sprite objects.
const bunnysArr = []
const effectsArr = []

//add sprites to images object.
images.bunny = new Image();
images.bunny.src = 'rabbit.png';
images.explosion = new Image();
images.explosion.src = 'explosion.png'
images.lightning = new Image();
images.lightning.src = 'lightning2.png'
images.squish = new Image()
images.squish.src = 'squish.png'



class Effect {
    constructor(x,y,width,height,frameX,frameY,img,sound){
        //explosiion effect.
        this.width = width;
        this.height = height;
        this.frameX = frameX;
        this.frameY = frameY;
        this.x = x
        this.y = y
        this.finnished = false
        this.image = img
        this.sound = sound
    }
    resetEffect(){
        this.finnished = false
        this.frameX = 0;
        this.frameY = 0;
    }
    setPosition(x,y){
        this.x = x;
        this.y = y;
    }
    playSoundEffect(){
        this.sound.play()
    }
    draw(){
        drawSprite(this.image, this.width * this.frameX,this.height * this.frameY,this.width,this.height,this.x,this.y,this.width,this.height)
};
update(){
    if (this.frameX < 7){
        this.frameX ++
        console.log("x:"+this.frameX)
    }else{
        if(this.frameY < 3){
            this.frameY ++
            console.log("y:"+this.frameY)
            this.frameX = 0
        }else{
            this.finnished = true;
        }
        
    }
}

};

//effect object
const effects = {}
effects.explosion = new Effect(0,0,64,64,0,0,images.explosion,new Audio('sound/explosion.flac'))
effects.lightning = new Effect(0,0,72,72,0,0,images.lightning,new Audio('sound/thunder.flac'))
effects.squish = new Effect(0,0,72,72,0,0,images.squish,new Audio('sound/squish.flac'))

class Bunny {
    constructor(){
        this.width = 72;
        this.height = 72;
        this.frameX = 0;
        this.frameY = 3;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 10;
        this.action = 'up';
        this.dead = false
    };
    draw(){
            drawSprite(images.bunny, this.width * this.frameX,this.height * this.frameY,this.width,this.height,this.x,this.y,this.width,this.height)
        
    };
    update(){
            //animation 
        if (this.frameX < 3){
            this.frameX ++
        }else{
            this.frameX = 0
        }
        //setDirection.
        if (Math.floor(Math.random() * Math.floor(100)) > 90){
            this.frameY = 6
            this.action = this.randomMovement()
        }else{

        //right 
        if (this.action === 'right'){
            this.moveRight()
        }
        //still
        if (this.action == 'still'){
            this.standStill()
        }
        //left
        if(this.action == 'left'){
            this.moveLeft()
        }
        //up 
        if(this.action == 'up'){
            this.moveUp()
        }
        if (this.action == 'down'){
            this.moveDown()
        }
        }
        
      
    }
    moveRight(){
        this.frameY = 3
        if (this.x <= canvas.width - this.width - this.speed){
            this.x += this.speed
        }else{
            this.frameY = 6
            this.action = this.randomMovement()
        }
    }
    standStill(){
        this.frameY = 6
    }
    moveLeft(){
        this.frameY = 1
        if(this.x >= this.speed){
            this.x -= this.speed
        }else{
            this.frameY = 6
            this.action = this.randomMovement()
        }
    }
    moveUp(){
        this.frameY = 0
        if(this.y >= this.speed){
            this.y -= this.speed
        }else{
            this.frameY = 6
            this.action = this.randomMovement()
        }
    }
    moveDown(){
        this.frameY = 2
        if(this.y <= canvas.height - this.height - this.speed){
            this.y += this.speed
        }else{
            this.frameY = 6
            this.action = this.randomMovement()
        }
    }
    randomMovement(){
        return bunnyActions[Math.floor(Math.random() * Math.floor(5))];
    }


};

for (let i = 0; i < 10; i++) {
    bunnysArr.push(new Bunny())
}


function drawSprite(image, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH)
};

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 - 20 > w1 + x1 || x1 - 20  > w2 + x2 || y2 - 20 > h1 + y1 || y1 - 20  > h2 + y2){
        return false;
    }
    return true;
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(effectsArr.length > 0){
        for (let i = 0; i < effectsArr.length; i++) {
            effectsArr[i].draw()
            effectsArr[i].update()
            if(effectsArr[i].finnished == true){
                effectsArr.splice(i,1)
            }
        }
    }
    for (let i = 0; i < bunnysArr.length; i++) {
        bunnysArr[i].draw()
        bunnysArr[i].update()
        for (let j = i +1; j < bunnysArr.length; j++) {
            if (rectIntersect(bunnysArr[i].x,bunnysArr[i].y,bunnysArr[i].width,bunnysArr[i].height,bunnysArr[j].x,bunnysArr[j].y,bunnysArr[j].width,bunnysArr[j].height) == true){
                //if moving same way randomize move.
                if(bunnysArr[i].action == bunnysArr[j].action){
                    bunnysArr[i].action = 'still'
                }else{
                    bunnysArr[i].action = bunnysArr[j].action
                     bunnysArr[j].action = 'still'
                }
                
            }
            
        }
        
    }
};
//attack bunny -- you heartless bastard.
function attackBunny(bunny,index){
    if(weaponOfChoice == EXPLODE){
    effects.explosion.resetEffect()
    effects.explosion.setPosition(bunny.x,bunny.y);
    effects.explosion.sound.play()
    effectsArr.push(effects.explosion)
    bunnysArr.splice(index,1)
    }else if(weaponOfChoice == LIGHTNING) {
        effects.lightning.resetEffect()
        effects.lightning.setPosition(bunny.x,bunny.y);
        effects.lightning.sound.play()
        effectsArr.push(effects.lightning)
        bunnysArr.splice(index,1)
    }else if(weaponOfChoice == SQUISH) {
        effects.squish.resetEffect()
        effects.squish.setPosition(bunny.x,bunny.y);
        effects.squish.sound.play()
        effectsArr.push(effects.squish)
        bunnysArr.splice(index,1)
    }else{
        console.log("nothing")
    }
}
//on bunny clicked.
canvas.addEventListener('click',function(event){
    for (let i = 0; i < bunnysArr.length; i++) {
        if(rectIntersect(event.clientX,event.clientY,10,10,bunnysArr[i].x + 30 ,bunnysArr[i].y + 30, 7, 7) == true){
           attackBunny(bunnysArr[i],i)
        }
        
    }
 
})
//on menu clicked
explodeBtn.addEventListener('click',function(){
    resetBtnBg(explodeBtn);
    explodeBtn.style.backgroundColor = 'lightskyblue';
    weaponOfChoice = EXPLODE;
})
thunderBoltBtn.addEventListener('click',function(){
    resetBtnBg(thunderBoltBtn);
    thunderBoltBtn.style.backgroundColor = 'lightskyblue';
    weaponOfChoice = LIGHTNING;
})
squishBtn.addEventListener('click',function(){
    resetBtnBg(squishBtn);
    squishBtn.style.backgroundColor = 'lightskyblue';
    weaponOfChoice = SQUISH;
})

//reset btn colors
function resetBtnBg(btn){
    if(btn == thunderBoltBtn){
        squishBtn.style.backgroundColor = 'whitesmoke'
        explodeBtn.style.backgroundColor = 'whitesmoke'
    }else if (btn == explodeBtn){
        squishBtn.style.backgroundColor = 'whitesmoke'
        thunderBoltBtn.style.backgroundColor = 'whitesmoke'
    }else{
        thunderBoltBtn.style.backgroundColor = 'whitesmoke'
        explodeBtn.style.backgroundColor = 'whitesmoke'
    }
}


window.onload = setInterval(animate,1000/10)
window.addEventListener('resize',function(){
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
})