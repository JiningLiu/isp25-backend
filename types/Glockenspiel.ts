import { Servo } from "johnny-five";

export class Glockenspiel {
  g0: Servo;
  a0: Servo;
  b0: Servo;
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

  gSharp0: Servo;
  aSharp0: Servo;
  cSharp0: Servo;
  dSharp0: Servo;
  fSharp0: Servo;
  gSharp1: Servo;
  aSharp1: Servo;
  cSharp1: Servo;
  dSharp1: Servo;
  fSharp1: Servo;

  constructor() {
    function servoConfig(
      pin: number,
      address: number = 0x40
    ): {
      controller: string;
      pin: number;
      startAt: number;
      range: number[];
      address: number;
    } {
      return {
        controller: "PCA9685",
        pin: pin,
        startAt: 0,
        range: [0, 90],
        address: address,
      };
    }

    this.g0 = new Servo(servoConfig(0));
    this.a0 = new Servo(servoConfig(1));
    this.b0 = new Servo(servoConfig(2));
    this.c1 = new Servo(servoConfig(3));
    this.d1 = new Servo(servoConfig(4));
    this.e1 = new Servo(servoConfig(5));
    this.f1 = new Servo(servoConfig(6));
    this.g1 = new Servo(servoConfig(7));
    this.a1 = new Servo(servoConfig(8));
    this.b1 = new Servo(servoConfig(9));
    this.c2 = new Servo(servoConfig(10));
    this.d2 = new Servo(servoConfig(11));
    this.e2 = new Servo(servoConfig(12));
    this.f2 = new Servo(servoConfig(13));
    this.g2 = new Servo(servoConfig(14));

    this.gSharp0 = new Servo(servoConfig(0, 0x41));
    this.aSharp0 = new Servo(servoConfig(1, 0x41));
    this.cSharp0 = new Servo(servoConfig(2, 0x41));
    this.dSharp0 = new Servo(servoConfig(3, 0x41));
    this.fSharp0 = new Servo(servoConfig(4, 0x41));
    this.gSharp1 = new Servo(servoConfig(5, 0x41));
    this.aSharp1 = new Servo(servoConfig(6, 0x41));
    this.cSharp1 = new Servo(servoConfig(7, 0x41));
    this.dSharp1 = new Servo(servoConfig(8, 0x41));
    this.fSharp1 = new Servo(servoConfig(9, 0x41));
  }
}

export function playNote(note: string, gs: Glockenspiel): void {
  const notes: { [key: string]: () => void } = {
    g0: () => gs.g0.play(),
    a0: () => gs.a0.play(),
    b0: () => gs.b0.play(),
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

    gSharp0: () => gs.gSharp0.play(),
    aSharp0: () => gs.aSharp0.play(),
    cSharp1: () => gs.cSharp1.play(),
    dSharp1: () => gs.dSharp1.play(),
    fSharp1: () => gs.fSharp1.play(),
    gSharp1: () => gs.gSharp1.play(),
    aSharp1: () => gs.aSharp1.play(),
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
