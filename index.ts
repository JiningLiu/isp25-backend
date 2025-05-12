const five = require("johnny-five");
const Raspi = require("raspi-io").RaspiIO;
import type { Request, Response } from "express";
const express = require("express");
const app = express();

const { getStatusCode, Status } = require("./types/Status");
const { Code } = require("./types/Code");
const { Glockenspiel, playNote } = require("./types/Glockenspiel");
const { Lights, ledOn, ledOff, ledsSet } = require("./types/Lights");

console.log("================================");
console.log("IB Literature 2024-2025 ISP");
console.log("Marble Machine");
console.log("================================");

// Server status
let serverStatus: (typeof Status)[keyof typeof Status] = Status.INIT;

// Glockenspiel Servo Controller
let gs: typeof Glockenspiel | null = null;

// Indicator Lights Controller
let lights: typeof Lights | null = null;

// RPi GPIO Connection
const board = new five.Board({
  io: new Raspi(),
});

serverStatus = Status.NO_BOARD;

board.on("ready", () => {
  gs = new Glockenspiel();
  lights = new Lights();
  serverStatus = Status.READY;
});

//the iteration that is currently playing
let globalIter = -1;

let arr: msg[] = [];

type msg = {
  band: string,
  song: string,
  message: string[]
}


app.use(express.json());

// Status endpoint
app.get("/status", (req: Request, res: Response) => {
  res.status(getStatusCode(serverStatus)).send(serverStatus);
});

// Play endpoint
app.post("/play", async (req: Request, res: Response) => {
  if (gs && lights) {
    const { note } = req.body as unknown as { note: string };

    playNote(note, gs);
    ledOn(note, lights);
    await new Promise((resolve) => setTimeout(resolve, 166));
    ledOff(note, lights);

    res.status(200).send("OK");
  } else {
    res.status(500).send("No Board");
  }
});

//---------------
app.post("/exec", async (req: Request, response: Response) => {
  console.log("play");
  const idx = (req.body as { idx: number }).idx;
  console.log("message: ", +idx);
  globalIter++;
  globalIter %= 128;
  setTimeout(() => { if (idx && arr[idx]) { chain(arr[idx].message, globalIter), 0 } })

  const res = response.json({ status: "ok" });
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  return res;
})

app.get("/note", async (req: Request, response: Response) => {
  console.log("GET!");
  console.log("arr:", arr);
  const res = response.json({ status: "ok", body: arr.map((e: any, i: number) => ({ song: e.song, band: e.band, idx: i })) });
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Connection', 'keep-alive');
  return res;
})
app.post("/note", async (req: Request, response: Response) => {
  console.log("POST!");
  const resData: object = { "status": "ok", "message": "yippe!" };
  const res = response.json(resData);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  // add Access-Control-Allow-Headers if needed
  let body = req.body as msg;
  setTimeout(async () => {

    arr.push(body);
    console.log("arr:", arr);
  }, 0);
  return res;
})




//----------

// Submit endpoint
app.post("/submit", async (req: Request, res: Response) => {
  const code = req.body as typeof Code;
  res.status(200).send("OK");
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(20240, () => {
  console.log(`Server is running on port 20240`);
});

async function chain(a: string[], iter: number) {
  if (a.length == 0 || iter != globalIter) return;
  //if it is a num
  if (a[0] == null || isNaN(+a[0])) {
    
    console.log("chain", a);//EDIT THIS

    chain(a.slice(1), iter);

  } else {
    setTimeout(() => chain(a.slice(1), iter), +a[0] * 1000)

  }
}