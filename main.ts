radio.setGroup(54);
radio.setFrequencyBand(7);

let levaStrana;
let pravaStrana;

let speed = 140;
let speedCorrect = -10;
let speedTurn = 140;
let krizovatkaTurn = 140;

let whiteline = 1;

const pinC = DigitalPin.P15;
const pinL = DigitalPin.P14;
const pinR = DigitalPin.P13;

let direction = 0;

radio.onReceivedNumber(function (num: number) {
    direction = num;
})

function setSpeed(speedLeft: number, speedRight: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, speedLeft);
    PCAmotor.MotorRun(PCAmotor.Motors.M4, speedRight * 0.75);
}

let tick = 0;
let lastData: number[][];
const dir = {LEFT: 0, CENTER: 1, RIGHT: 2};

function dataHistory(direction: number, state: boolean) {
    if (tick % 2 == 0) {
        lastData[direction].push(state ? 1 : 0);
        if (lastData[direction].length > 10) {
            lastData[direction].shift();
        }
    }
}

basic.forever(() => {
    let center = (whiteline ^ pins.digitalReadPin(pinC)) == 0 ? false : true;
    let left = (whiteline ^ pins.digitalReadPin(pinL)) == 0 ? false : true;
    let right = (whiteline ^ pins.digitalReadPin(pinR)) == 0 ? false : true;

    if (dataHistory(dir.CENTER, center)) {
        if (dataHistory(dir.LEFT, left) && dataHistory(dir.RIGHT, right)) {
            setSpeed(speed, speed);
            // if (direction == -1) {
            //     setSpeed(-krizovatkaTurn, krizovatkaTurn);
            //     basic.pause(850);
            //     setSpeed(speed, speed);
            //     basic.pause(850);
            // } else if (direction == 1) {
            //     setSpeed(krizovatkaTurn, -krizovatkaTurn);
            //     basic.pause(850);
            //     setSpeed(speed, speed);
            //     basic.pause(850);
            // } else {
            //     setSpeed(speed, speed);
        }
        if (dataHistory(dir.LEFT, left) && dataHistory(dir.RIGHT, right)) {
            if (direction == -1) {
                setSpeed(-krizovatkaTurn, krizovatkaTurn);
                basic.pause(850);
                setSpeed(speed, speed);
                basic.pause(850);
            } else if (direction == 1) {
                setSpeed(krizovatkaTurn, -krizovatkaTurn);
                basic.pause(850);
                setSpeed(speed, speed);
                basic.pause(850);
            } else {
                setSpeed(speed, speed);
            }
        } else {
            if (dataHistory(dir.RIGHT, right)) {
                pravaStrana = speed;
            } else {
                pravaStrana = speedCorrect;
            }

            if (dataHistory(dir.LEFT, left)) {
                levaStrana = speed;
            } else {
                levaStrana = speedCorrect;
            }
            setSpeed(levaStrana, pravaStrana);
        }
        setSpeed(-speed, -speed);
        basic.pause(300);
    }
    basic.pause(50);
    tick += 1;
})
