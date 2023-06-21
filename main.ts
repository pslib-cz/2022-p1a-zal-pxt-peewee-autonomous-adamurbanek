radio.setGroup(54);
radio.setFrequencyBand(7);

let levaStrana;
let pravaStrana;

let speed = 180;
let speedCorrect = -120;
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
    PCAmotor.MotorRun(PCAmotor.Motors.M4, speedRight);
}

let tick = 0;
let lastData: number[][] = [[], [], []];
const dir = { LEFT: 0, CENTER: 1, RIGHT: 2 };

function dataHistory(direction: number, state: boolean) {
    if (tick % 2 == 0) {
        lastData[direction].push(state ? 1 : 0);
        if (lastData[direction].length > 15) {
            lastData[direction].shift();
        }
    }
}

function readHistory(direction: number) {
    let modus = 0
    for (const x of lastData[direction]) {
        modus += x
    }

    if (Math.round(modus / 15) === 1) {
        return true
    } else {
        return false
    }

}

let count = 0

basic.forever(() => {
    let center = (whiteline ^ pins.digitalReadPin(pinC)) == 0 ? false : true;
    let left = (whiteline ^ pins.digitalReadPin(pinL)) == 0 ? false : true;
    let right = (whiteline ^ pins.digitalReadPin(pinR)) == 0 ? false : true;

    while (count < 15) {
        dataHistory(dir.LEFT, left);
        dataHistory(dir.CENTER, center);
        dataHistory(dir.RIGHT, right);
        count++;
    }
        setSpeed(speed, speed);  

        if (right) {
            pravaStrana = speed;
        } else {
            pravaStrana = speedCorrect;
        }

        if (left) {
            levaStrana = speed;
        } else {
            levaStrana = speedCorrect;
        }
        setSpeed(levaStrana, pravaStrana);
            
        if(left && right){
            setSpeed(speed, speed);
        }
            
    center = readHistory(dir.CENTER);
    left = readHistory(dir.LEFT);
    right = readHistory(dir.RIGHT);

    tick += 1;
})
