let video;

let bodyPose;
let poses = [];
let connections;

let over;
let rect;
let x;
let y;
let move = -5;
let score = 0;
let rng = 0;
let hp = 10;
let ha = 0;
let bosshp = 10;
let bossAt = 0;
let box = 0;

let oof;
let doot;
let bgm;
let lazer;
let winner;

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
    bodyPose = ml5.bodyPose("MoveNet", {flipped: true});
    oof = loadSound("game/classic_hurt.mp3");
    doot = loadSound("game/skullsound2.mp3");
    // bgm = loadSound("Main Theme.mp3");
    coin = loadImage("game/coinS.png");
    coinS = loadSound("game/coinSound.mp3");
    lazer = loadSound("game/lazer.mp3")
    // winner = loadSound("game/winner.mp3");
}

function mousePressed() {
    console.log(poses);
}

function gotPoses(results) {
    poses = results;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    over = createGraphics(width,height);
    video = createCapture(VIDEO, { flipped: true });
    video.size(width, height);
    video.hide();

    bodyPose.detectStart(video, gotPoses);
    connections = bodyPose.getSkeleton();

    x = width;
    y = height-200;

    coinX = random(coinSize, width - coinSize);
    coinY = random(coinSize, height - coinSize);

    // bgm.setVolume(.8);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    video.size(windowWidth, windowHeight);
}
// 11ft, 15ft, 3ft 1in camera height
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
            boss();
        }
    }
    //move = -15;
    //boss();
}

function starts() {
    if (poses.length > 0){
        let pose = poses[0];
        for(let i = 0; i < pose.keypoints.length; i++){
            let keypoint = pose.keypoints[i];
            fill(0,0,255);
            noStroke();
            if(keypoint.confidence > .1){
                circle(keypoint.x, keypoint.y, 15);
            }
            if(keypoint.x > x &&
                keypoint.x < x + 100 && 
                keypoint.y > y &&
                keypoint.y < y + box)
            {
                touchy = true;
            }
            let d = dist(keypoint.x, keypoint.y, coinX, coinY);
            if (d < coinSize / 2) {
                coinBank++;
                coinS.play();
                coinX = random(coinSize, width - coinSize);
                coinY = random(coinSize, height - coinSize);
            }
        }
        for(let i = 0; i < connections.length; i ++){
            let connection = connections[i];
            let a = connection[0];
            let b = connection[1];
            let keyPointA = pose.keypoints[a];
            let keyPointB = pose.keypoints[b];

            let confA = keyPointA.confidence;
            let confB = keyPointB.confidence;

            if(confA > .1 && confB > .1){
                stroke(0,255,0);
                strokeWeight(10);
                line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y) 
            }
        }
        let right = pose.right_wrist;
        let left = pose.left_wrist;
        let d = dist(right.x, right.y, left.x, left.y);
        if (d < 50){
            start = true;
        }
    }
    textSize(150);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(230, 210, 250);
    text("CLAP TO START", width/2, height/2);
}

function mousePressed(){
    if(!start){
        bgm.loop()
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

let ouch = false;
let bossOuch = false;
function boss(){
    let ouchie = false;
    let bossOuchie = false;
    if (poses.length > 0){
        let pose = poses[0];

        let rx = pose.right_wrist.x;
        let ry = pose.right_wrist.y;
        let lx = pose.left_wrist.x;
        let ly = pose.left_wrist.y;

        let blast = dist(rx, ry, lx, ly);
        if(blast < 50 && !blastActive){
            blastEM(rx,ry);
        }

        for(let i = 0; i < pose.keypoints.length; i++){
            let keypoint = pose.keypoints[i];
            fill(0,0,255);
            noStroke();
            if(keypoint.confidence > .1){
                circle(keypoint.x, keypoint.y, 15);
            }
            if(bossAt == 0){
                if((keypoint.x > x && keypoint.x < x + 100) && 
                    (//(keypoint.y > 0 && keypoint.y < 200) ||
                    (keypoint.y > height-150))) //&& keypoint.y < height)))
                 {
                    ouchie = true;
                 }
            }
            else if(bossAt == 1){
                if(keypoint.x > x && keypoint.x < x + 100 &&
                   keypoint.y <(height/2)-300)
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
            let d = dist(keypoint.x, keypoint.y, coinX, coinY);
            if (d < coinSize / 2) {
                coinBank++;
                coinS.play();
                coinX = random(coinSize, width - coinSize);
                coinY = random(coinSize, height - coinSize);
            }
        }

        for(let i = 0; i < connections.length; i ++){
            let connection = connections[i];
            let a = connection[0];
            let b = connection[1];
            let keyPointA = pose.keypoints[a];
            let keyPointB = pose.keypoints[b];

            let confA = keyPointA.confidence;
            let confB = keyPointB.confidence;

            if(confA > .1 && confB > .1){
                stroke(0,255,0);
                strokeWeight(10);
                line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y) 
            }
        }

    }

    if(blastActive){
        fill(0,255,0);
        noStroke();
        ellipse(blastX,blastY, 100);
        blastX += blastM;
        if(blastX >= width - 200){
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
        bossAt = ha % 3;
    }
    //boss moves
    over.fill(0,255,255);
    over.noStroke();
    if(bossAt == 0){
        move = -10;
        //over.rect(x,0,100,200);
        over.rect(x,height-150,100,150);
    }
    else if(bossAt == 1){
        move = -10;
        over.rect(x, (height/2)-300, 100, 300);
    }
    else if(bossAt == 2){
        move = -8;
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

function blastEM(starX, starY){
    lazer.play();
    blastActive = true;
    blastX = starX;
    blastY = starY;
}

let touch = false;
function run(){
    let touchy = false;
    if (poses.length > 0){
        let pose = poses[0];
        for(let i = 0; i < pose.keypoints.length; i++){
            let keypoint = pose.keypoints[i];
            fill(0,0,255);
            noStroke();
            if(keypoint.confidence > .1){
                circle(keypoint.x, keypoint.y, 15);
            }
            if(keypoint.x > x &&
                keypoint.x < x + 100 && 
                keypoint.y > y &&
                keypoint.y < y + box)
            {
                touchy = true;
            }
            let d = dist(keypoint.x, keypoint.y, coinX, coinY);
            if (d < coinSize / 2) {
                coinBank++;
                coinS.play();
                coinX = random(coinSize, width - coinSize);
                coinY = random(coinSize, height - coinSize);
            }
        }
        for(let i = 0; i < connections.length; i ++){
            let connection = connections[i];
            let a = connection[0];
            let b = connection[1];
            let keyPointA = pose.keypoints[a];
            let keyPointB = pose.keypoints[b];

            let confA = keyPointA.confidence;
            let confB = keyPointB.confidence;

            if(confA > .1 && confB > .1){
                stroke(0,255,0);
                strokeWeight(10);
                line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y) 
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
    text("hp: " + hp, width-350,30);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("coins: " + coinBank, 105, 80);

    over.clear();
    if(x <= 0){
        x = width;
        score++;
        move = move - .5;
        if(move <= -10){
            move = -10;
        }
        rng = random() < .5; // < 0.5 ? 0 : height - 150;
        touch = false;
    }
    if(hp <= 0){
        move = 0;
        textSize(250);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255,0,0);
        text("YOU DIED", width/2, height/2)
        textSize(150);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(119, 221, 119);
        text("Press R to reset", width/2, height*.75);
    }
    over.fill(0,255,255);
    over.noStroke();
    if(rng < .5){
        y = 0;
        box = 200
    }
    else{
        y = height - 150;
        box = 150
    }
    over.rect(x,y,100,box);

    image(coin, coinX - coinSize / 2, coinY - coinSize / 2, coinSize, coinSize);

    x += move;
    image(over,0,0);
}