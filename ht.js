let video;
let handPose;
let hands = [];

let painting;
let px = 0;
let py = 0;

function preload(){
    handPose = ml5.handPose({flipped: true});
}

function mousePressed() {
    console.log(hands);
}

function gotHands(results) {
    hands = results;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // painting = createGraphics(width,height);
    // painting.clear();
    video = createCapture(VIDEO, { flipped: true });
    video.size(width, height);
    video.hide();
    handPose.detectStart(video, gotHands);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    video.size(windowWidth, windowHeight);
}


function draw() {
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
            }
        }
    }
}