let video;

let over;
let rect;
let x;
let y;
let move = -10;
let temp = -10;
let score = 0;
let rng;
let hp = 10;
let bosshp = 10;
let ha = 0;
let bossAt;

let handPose;
let hands = [];

let sawin;
//let keston;
let oof;
let doot;
let bgm;

let coin;
let coinBank = 0;
let coinX;
let coinY;
let coinSize = 110;
let coinS;

let blastX = 0;
let blastY = 0;
let blastM = 20;
let blastActive = false;

function preload(){
    handPose = ml5.handPose({flipped: true});
    // sawin = loadImage("sawin.jpg");
    // //keston = loadIamage("keston.jpg");
    oof = loadSound("game/classic_hurt.mp3");
    doot = loadSound("game/skullsound2.mp3");
    // bgm = loadSound("Main Theme.mp3");
    coin = loadImage("game/coinS.png");
    coinS = loadSound("game/coinSound.mp3");
    lazer = loadSound("game/lazer.mp3")
}

function gotHands(results) {
    hands = results;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    over = createGraphics(width,height);
    video = createCapture(VIDEO, { flipped: true });
    video.size(width, height);
    video.hide();
    handPose.detectStart(video, gotHands);

    bossAt = Math.floor(Math.random()*3);
    x = width;
    y = height-200;
    coinX = random(coinSize, width - coinSize);
    coinY = random(coinSize, height - coinSize);

    // bgm.play();
    // bgm.loop();
    //coinS.setVolume(.2);
    //bgm.setVolume(.8);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    video.size(windowWidth, windowHeight);
}

let start = false;
function draw() {
    image(video, 0, 0, width, height);
    
    if(!start){
        starts();
    }
    else{
        if(score < 10){
            run();
        }
        else{
            move = -15;
            boss();
        }
        //run();
    }
    //move = -15;
    //run();
}

function starts() {
    image(video, 0, 0, width, height);
    if(hands.length > 0){
        for(let hand of hands){
            if(hand.confidence > .1){
                for(let i = 0; i < hand.keypoints.length; i++){
                    let keypoint = hand.keypoints[i];
                    if(hand.handedness == "Left"){
                        fill(255,0,255);
                    }
                    else{
                        fill(0,255,255);
                    }
                    noStroke();
                    circle(keypoint.x, keypoint.y, 8);
                }
                let index = hand.index_finger_tip;
                let thumb = hand.thumb_tip;
                let d = dist(index.x, index.y, thumb.x, thumb.y);
                if(d < 20){
                    start = true;
                }
            }
        }
    }
    textSize(150);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(230, 210, 250);
    text("PINCH TO START", width/2, height/2);
}

function mousePressed(){
    if(!start){
        //bgm.loop()
        start = true;
    }
}

function keyPressed(){
    if(key == 'r'){
        move = -10;
        score = 0;
        coinBank = 0;
        hp = 10;
        bosshp = 10;
        x = width;
    }
}

function blastEM(starX, starY){
    lazer.play();
    blastActive = true;
    blastX = starX;
    blastY = starY;
}

let ouch = false;
let bossOuch = false;
function boss(){
    let ouchie = false;
    let bossOuchie = false;
    if(hands.length > 0){
        for(let hand of hands){
            if(hand.confidence > .1){
                for(let i = 0; i < hand.keypoints.length; i++){
                    let keypoint = hand.keypoints[i];
                    fill(255,0,255);
                    noStroke();
                    circle(keypoint.x, keypoint.y, 8);
                    if(bossAt == 0){
                        if((keypoint.x > x && keypoint.x < x + 100) && 
                            ((keypoint.y > 0 && keypoint.y < 200) ||
                            (keypoint.y > height-200 && keypoint.y < height)))
                         {
                            ouchie = true;
                         }
                    }
                    else if(bossAt == 1){
                        if(keypoint.x > x && keypoint.x < x + 100 &&
                           keypoint.y > (height/2)-100 && keypoint.y <(height/2)+100)
                        {
                            ouchie = true;
                        }
                    }
                    else if(bossAt == 2){
                        if(keypoint.x > x && keypoint.x < x + 100)
                         {
                            ouchie = true;
                         }
                    }
                }
                let index = hand.index_finger_tip;
                let thumb = hand.thumb_tip;
                let d = dist(index.x, index.y, thumb.x, thumb.y);
                if(d < 20 && !blastActive){
                    blastEM(index.x, index.y);
                }
                
            }
        }
    }
    if(blastActive){
        fill(0,255,0);
        noStroke();
        ellipse(blastX,blastY, 100);
        blastX += blastM;
        if(blastX >= width){
            bossOuchie = true;
            blastActive = false;
        }
    }

    if (bossOuchie && !bossOuch){
        bosshp--;
        bossOuch = true;
        doot.play();
    }

    if (ouchie && !ouch){
        hp--;
        ouch = true;
        oof.play();
    }


    fill(0);
    noStroke();
    textSize(50);
    textAlign(CENTER, CENTER);
    text("score: " + score, 110, 30);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("hp: " + hp, width-350,30);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("coins: " + coinBank, 105, 80);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("boss hp: " + bosshp, width/2,30);
    
    over.clear();
    if(hp <= 0){
        move = 0;
        textSize(250);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255,0,0);
        text("YOU DIED", width/2, height/2);
        textSize(150);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(119, 221, 119);
        text("Press R to reset", width/2, height*.75);
    }

    if(bosshp <= 0){
        move = 0;
        hp = 99;
        textSize(250);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0,253,0);
        text("YOU WIN", width/2, height/2);
    }

    if(x <= 0){
        x = width;
        ha = Math.floor(Math.random()*3);
        ouch = false;
        bossOuch = false;
    }
    //boss moves
    over.fill(0,255,255);
    over.noStroke();
    bossAt = ha % 3;
    if(bossAt == 0){
        over.rect(x,0,100,200);
        over.rect(x,height-200,100,200);
    }
    else if(bossAt == 1){
        over.rect(x, (height/2)-100, 100, 200);
    }
    else if(bossAt == 2){
        over.rect(x,0,100,height);
    }
    x += move;


    //boss body
    over.fill(230, 210, 250);
    over.noStroke();
    over.rect(width-100,0,200,height);
    // image(sawin, width-200, 0, 200, height);
    image(over,0,0);
}

let touch = false;

function run(){
    let touchy = false; 
    if(hands.length > 0){
        for(let hand of hands){
            if(hand.confidence > .1){
                for(let i = 0; i < hand.keypoints.length; i++){
                    let keypoint = hand.keypoints[i];
                    if(hand.handedness == "Left"){
                        fill(255,0,255);
                    }
                    else{
                        fill(0,255,255);
                    }
                    noStroke();
                    circle(keypoint.x, keypoint.y, 8);

                    if(keypoint.x > x && keypoint.x < x + 100 &&
                          keypoint.y > y && keypoint.y < y + 300)
                      {
                            touchy = true;
                      }
                    let d = dist(keypoint.x, keypoint.y, coinX, coinY);
                    if (d < coinSize / 2) {
                        coinS.play()
                        coinBank++;
                        coinX = random(coinSize, width - coinSize);
                        coinY = random(coinSize, height - coinSize);
                        move = temp;
                    }
                }

            }
        }
    }
    if (touchy && !touch){
        hp--;
        touch = true;
        oof.play();
    }

    fill(0);
    noStroke();
    textSize(50);
    textAlign(CENTER, CENTER);
    text("score: " + score, 110, 30);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("coins: " + coinBank, 105, 80);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("hp: " + hp, width-150,30);
    
    over.clear();
    if(x <= 0){
        x = width;
        score++;
        move--;
        temp--;
        if(move <= -25){
            move = -25;
            temp = -25;
        }
        y = random() < 0.5 ? 0 : height - 300;
        touch = false;
    }
    if(hp <= 0){
        move = 0;
        textSize(250);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255,0,0);
        text("YOU DIED", width/2, height/2);
        textSize(150);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(119, 221, 119);
        text("Press R to reset", width/2, height*.75);
    }
    over.fill(0,255,255);
    over.noStroke();
    over.rect(x,y,100,300);

    image(coin, coinX - coinSize / 2, coinY - coinSize / 2, coinSize, coinSize);

    x += move;
    image(over,0,0);
}