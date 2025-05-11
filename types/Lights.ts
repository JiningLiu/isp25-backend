const { Led } = require("johnny-five");

class Lights {
  c1: typeof Led;
  d1: typeof Led;
  e1: typeof Led;
  f1: typeof Led;
  g1: typeof Led;
  a1: typeof Led;
  b1: typeof Led;
  c2: typeof Led;
  d2: typeof Led;
  e2: typeof Led;
  f2: typeof Led;
  g2: typeof Led;
  a3: typeof Led;

  constructor() {
    function ledConfig(pin: number): {
      controller: string;
      pin: number;
      range: number[];
    } {
      return { controller: "PCA9685", pin: pin, range: [0, 90] };
    }

    this.c1 = new Led(ledConfig(0));
    this.d1 = new Led(ledConfig(1));
    this.e1 = new Led(ledConfig(2));
    this.f1 = new Led(ledConfig(3));
    this.g1 = new Led(ledConfig(4));
    this.a1 = new Led(ledConfig(5));
    this.b1 = new Led(ledConfig(6));
    this.c2 = new Led(ledConfig(7));
    this.d2 = new Led(ledConfig(8));
    this.e2 = new Led(ledConfig(9));
    this.f2 = new Led(ledConfig(10));
    this.g2 = new Led(ledConfig(11));
    this.a3 = new Led(ledConfig(12));
  }
}

function ledOn(note: string, lights: Lights): void {
  const notes: { [key: string]: () => void } = {
    c1: () => lights.c1.on(),
    d1: () => lights.d1.on(),
    e1: () => lights.e1.on(),
    f1: () => lights.f1.on(),
    g1: () => lights.g1.on(),
    a1: () => lights.a1.on(),
    b1: () => lights.b1.on(),
    c2: () => lights.c2.on(),
    d2: () => lights.d2.on(),
    e2: () => lights.e2.on(),
    f2: () => lights.f2.on(),
    g2: () => lights.g2.on(),
    a3: () => lights.a3.on(),
  };

  if (notes[note]) {
    notes[note]();
  }
}

function ledOff(note: string, lights: Lights): void {
  const notes: { [key: string]: () => void } = {
    c1: () => lights.c1.off(),
    d1: () => lights.d1.off(),
    e1: () => lights.e1.off(),
    f1: () => lights.f1.off(),
    g1: () => lights.g1.off(),
    a1: () => lights.a1.off(),
    b1: () => lights.b1.off(),
    c2: () => lights.c2.off(),
    d2: () => lights.d2.off(),
    e2: () => lights.e2.off(),
    f2: () => lights.f2.off(),
    g2: () => lights.g2.off(),
    a3: () => lights.a3.off(),
  };

  if (notes[note]) {
    notes[note]();
  }
}

function ledsSet(notes: string[], lights: Lights, on: boolean): void {
  const map: { [key: string]: typeof Led } = {
    c1: lights.c1,
    d1: lights.d1,
    e1: lights.e1,
    f1: lights.f1,
    g1: lights.g1,
    a1: lights.a1,
    b1: lights.b1,
    c2: lights.c2,
    d2: lights.d2,
    e2: lights.e2,
    f2: lights.f2,
    g2: lights.g2,
    a3: lights.a3,
  };

  Object.entries(map).forEach(([note, led]) => {
    if (notes.includes(note)) {
      if (on) {
        led.on();
      } else {
        led.off();
      }
    } else {
      if (on) {
        led.off();
      } else {
        led.on();
      }
    }
  });
}

module.exports = {
  Lights,
  ledOn,
  ledOff,
  ledsSet
};
