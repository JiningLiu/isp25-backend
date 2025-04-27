import { Servo } from "johnny-five";

export class Glockenspiel {
  c1: Servo;
  d1: Servo;
  e1: Servo;
  f1: Servo;
  g1: Servo;
  a1: Servo;
  b1: Servo;
  c2: Servo;
  d2: Servo;
  e2: Servo;
  f2: Servo;
  g2: Servo;
  a3: Servo;

  constructor() {
    function servoConfig(pin: number): {
      controller: string;
      pin: number;
      range: number[];
    } {
      return { controller: "PCA9685", pin: pin, range: [0, 90] };
    }

    this.c1 = new Servo(servoConfig(0));
    this.d1 = new Servo(servoConfig(1));
    this.e1 = new Servo(servoConfig(2));
    this.f1 = new Servo(servoConfig(3));
    this.g1 = new Servo(servoConfig(4));
    this.a1 = new Servo(servoConfig(5));
    this.b1 = new Servo(servoConfig(6));
    this.c2 = new Servo(servoConfig(7));
    this.d2 = new Servo(servoConfig(8));
    this.e2 = new Servo(servoConfig(9));
    this.f2 = new Servo(servoConfig(10));
    this.g2 = new Servo(servoConfig(11));
    this.a3 = new Servo(servoConfig(12));
  }
}

export function playNote(note: string, gs: Glockenspiel): void {
  const notes: { [key: string]: () => void } = {
    c1: () => gs.c1.play(),
    d1: () => gs.d1.play(),
    e1: () => gs.e1.play(),
    f1: () => gs.f1.play(),
    g1: () => gs.g1.play(),
    a1: () => gs.a1.play(),
    b1: () => gs.b1.play(),
    c2: () => gs.c2.play(),
    d2: () => gs.d2.play(),
    e2: () => gs.e2.play(),
    f2: () => gs.f2.play(),
    g2: () => gs.g2.play(),
    a3: () => gs.a3.play(),
  };

  if (notes[note]) {
    notes[note]();
  }
}

declare module "johnny-five" {
  interface Servo {
    play(): void;
  }
}

Servo.prototype.play = function () {
  this.max();
  setTimeout(() => {
    this.min();
  }, 200);
};