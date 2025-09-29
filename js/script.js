let board;
let boardWidth =  window.innerWidth *0.8;
let boardHeight = window.innerHeight *0.7;
let score =0;
let gameOver =false;
let context ;

//player
let playerWidth = boardWidth *0.3;
let playerHeight = 12;
let playerVelocityX  = boardWidth *0.05;

let player ={

    x: boardWidth/2 - playerWidth/2 ,
    y: boardHeight - playerHeight -5 ,
    width : playerWidth ,
    height : playerHeight ,
    velocityX : playerVelocityX ,
}
//ball
let ballwidth =  boardWidth * 0.03;
let ballHeight = 10;
let ballVelocityX =  boardWidth * 0.003;
let ballVelcoityY = boardHeight * 0.002;

let ball ={

    x :boardWidth/2 ,
    y :boardHeight/2 ,
    width : ballwidth ,
    height : ballHeight ,
    velocityX :ballVelocityX ,
    velocityY : ballVelcoityY ,
}

//blocks
let blockArray = [] ;
let blockColumns = 10 ;
let blockWidth =  boardWidth/blockColumns -10 ;
let blockHeight = boardHeight * 0.03 ;
let blockRows = 3 ;
let blockMaxRows = 10 ;
let blockCount = 0;

//starting  block corner topleft
let blockX = 5;
let blockY =45 ;


window.onload = function (){

    board = document.querySelector("#board");
    board.width =boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //draw initial player
    context.fillStyle = "lightGreen",
    context.fillRect(player.x , player.y , player.width , player.height);


    requestAnimationFrame(update);
    document.addEventListener("keydown" ,movePlayer) ;


    //createblocks

    createBlocks();

}

function update(){

    requestAnimationFrame(update);

    if(gameOver){
        return ;
    }

    context.clearRect ( 0, 0  , board.width , board.height)

    //player
    context.fillStyle ="lightGreen" ;
    context.fillRect(player.x ,player.y , player.width , player.height);

    //ball
    context.fillStyle = "white" ;
    ball.x += ball.velocityX ;
    ball.y +=ball.velocityY ;
    context.fillRect(ball.x , ball.y , ball.width ,ball.height);


    //bounce the ball off player paddle
    if( topCollision(ball ,player) || bottomCollision(ball ,player)){

         ball.velocityY *=-1; //flip y direction up or down ;
    }

    else if(leftCollision(ball ,player) || rightCollision (ball ,player)){

        ball.velocityX *=-1 ; //flip  x direction  left or right
    }

    //bounce ball of walls
    if(ball.y <=0){

        //if ball touches top of canvas;
         ball.velocityY *= -1;
    }

    //if ball touches left or right of the canvas
    if (ball.x < 0 || ball.x + ball.width >=boardWidth) {

        //if ball touches left or right of the canvas
        ball.velocityX *= -1 ;

    }


    else if(ball.y + ball.height >= boardHeight){
         
        //if ball touches bottom of canvas
        context.font = "14px sans-serif";
        context.textAlign = "center";
        context.fillText("Game Over : Press Space to Restart" , boardWidth/2 , boardHeight/2);
        gameOver =true;
    }

    //blocks
    context.fillStyle ="skyblue";
    for(let i =0 ; i<blockArray.length ; i++){
        let block =blockArray[i]
        if(!block.break){
            if(topCollision(ball ,block) || bottomCollision(ball ,block)){
                block.break = true;
                ball.velocityY *=-1;
                blockCount-=1;
                score +=100;
            }
            else if(leftCollision(ball, block) || rightCollision(ball ,block)){
                block.break = true;
                ball.velocityX *=-1;
                blockCount-=1;
                score +=100
            }
            context.fillRect(block.x , block.y ,blockWidth ,blockHeight);
        }
    }

    //next level
    if(blockCount == 0){

        score +=100 * blockRows * blockColumns ;
        blockRows = Math.min(blockRows + 1 ,blockMaxRows);
        createBlocks();

    }

    document.querySelector("#score").innerHTML = score;

}

function outOfBounds(xPosition){

    return (xPosition <0 || xPosition + playerWidth > boardWidth)

}

function movePlayer(e) {

 
    if(gameOver){

        if(e.key ==" "){
             resetGame();
             
        }
    }

    if(e.key == "ArrowLeft"){
         
        let nextPlayerX = player.x - player.velocityX;

        if(!outOfBounds(nextPlayerX)){

            player.x = nextPlayerX
        }
    }

    if(e.key == "ArrowRight"){
       
        
        let nextPlayerX =  player.x + playerVelocityX

        if(!outOfBounds(nextPlayerX)){

            player.x = nextPlayerX
        }
    }
    
}

// collision detection

function detectCollision(a ,b){

    return  a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&     //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&   //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y ;   //a's bottom left corner passes b's top left corner
}

function topCollision (ball ,block){  // a is above b (ball is above block)

    return detectCollision(ball , block) && (ball.y +ball.Height) >= block.y;

}


function bottomCollision (ball ,block){
    
    return detectCollision(ball  ,block) && (block.y + block.height)>= ball.y;
}

function leftCollision (ball  ,block){

    return detectCollision(ball ,block) && (ball.x + ball.width) >= block.x ;
}

function rightCollision (ball , block){

    return detectCollision(ball ,block) && (block.x + block.width)>= ball.x ;

}


function createBlocks(){

    blockArray =[]; //clear blockArray

    for(let c =0 ; c < blockColumns ; c++){
        for(let r =0 ; r < blockRows ; r++ ){

            let block ={

                 x: blockX + c* blockWidth + c*10 , // c*10 space 10 pixels apart columns
                 y : blockY + r* blockHeight +r*10  , // r*10 space 10 pixels apart rows
                 width : blockWidth ,
                 height : blockHeight ,
                 break : false ,
            }

            blockArray.push(block);
        }
    }
    
   

    blockCount  =blockArray.length;



}


function resetGame(){

    gameOver =false;

    player ={

        x: boardWidth/2 - playerWidth/2 ,
        y: boardHeight - playerHeight -5 ,
        width : playerWidth ,
        height : playerHeight ,
        velocityX : playerVelocityX ,
    }

    ball ={

        x :boardWidth/2 ,
        y :boardHeight/2 ,
        width : ballwidth ,
        height : ballHeight ,
        velocityX :ballVelocityX ,
        velocityY : ballVelcoityY ,
    }

    score =0;
    blockArray =[];
    createBlocks();


}