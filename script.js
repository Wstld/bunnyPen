
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//setup canvas 
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const images = {};
const bunnyActions = ['up','down','left','right','still']
const bunnysArr = []
const effectsArr = []
images.bunny = new Image();
images.bunny.src = 'rabbit.png';
images.explosion = new Image();
images.explosion.src = 'explosion.png'

class Effect {
    constructor(x,y){
        //explosiion effect.
        this.width = 64;
        this.height = 64;
        this.frameX = 0;
        this.frameY = 0;
        this.x = x
        this.y = y
        this.finnished = false
    }
    draw(){
        drawSprite(images.explosion, this.width * this.frameX,this.height * this.frameY,this.width,this.height,this.x,this.y,this.width,this.height)
};
update(){
    if (this.frameX < 7){
        this.frameX ++
    }else{
        if(this.frameY < 3){
            this.frameY ++
            this.frameX = 0
        }else{
            this.finnished = true;
        }
        
    }
}

}

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
canvas.addEventListener('click',function(event){
    for (let i = 0; i < bunnysArr.length; i++) {
        if(rectIntersect(event.clientX,event.clientY,10,10,bunnysArr[i].x + 30 ,bunnysArr[i].y + 30, 7, 7) == true){
           effectsArr.push(new Effect(bunnysArr[i].x,bunnysArr[i].y))
           console.log(bunnysArr)
            bunnysArr.splice(i,1)
            console.log(bunnysArr)
        }
        
    }
 
})
window.onload = setInterval(animate,1000/10)
window.addEventListener('resize',function(){
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
})