const five = require("johnny-five");
const Raspi = require("raspi-io").RaspiIO;
import type { Request, Response, NextFunction } from "express";
const express = require("express");
const app = express();

// Add CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Add JSON body parser middleware
app.use(express.json());

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
  band: string;
  song: string;
  message: string[];
  bpm: number;
};

arr.push({
  band: "Jams",
  song: "Demo",
  message: [
    "C4",
    "0.5",
    "C4",
    "0.5",
    "D4",
    "0.5",
    "C4",
    "0.5",
    "A5",
    "0.75",
    "A5",
    "0.75",
    "G4",
    "1.25",

    "C4",
    "0.5",
    "C4",
    "0.5",
    "D4",
    "0.5",
    "C4",
    "0.5",
    "G5",
    "0.75",
    "G5",
    "0.75",
    "F4",
    "1.25",

    "C4",
    "0.5",
    "C4",
    "0.5",
    "D4",
    "0.5",
    "C4",
    "0.5",
    "F5",
    "0.75",
    "G5",
    "0.75",
    "E4",
    "1",
    "D4",
    "0.5",
    "C4",
    "0.5",
    "C4",
    "0.5",
    "G4",
    "1",
    "F4",
  ],
  bpm: 160,
});

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

app.post("/exec", async (req: Request, response: Response) => {
  console.log("play", req.body);
  const idx = (req.body as { idx: number }).idx;
  console.log("message: ", +idx);
  globalIter++;
  globalIter %= 128;
  setTimeout(() => {
    if (idx && arr[idx]) {
      chain(arr[idx].message, globalIter, arr[idx].bpm), 0;
    }
  });

  return response.json({ status: "ok" });
});

app.get("/note", async (req: Request, response: Response) => {
  console.log("GET!");
  console.log("arr:", arr);
  return response.json({
    status: "ok",
    body: arr.map((e: any, i: number) => ({
      song: e.song,
      band: e.band,
      idx: i,
    })),
  });
});

app.post("/note", async (req: Request, response: Response) => {
  console.log("POST!");
  const resData: object = { status: "ok", message: "yippe!" };
  let body = req.body as msg;
  setTimeout(async () => {
    arr.push(body);
    console.log("arr:", arr);
  }, 0);
  return response.json(resData);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(20240, () => {
  console.log(`Server is running on port 20240`);
});

async function chain(a: string[], iter: number, bpm: number) {
  if (a.length == 0 || iter != globalIter) return;
  //if it is a num
  if (a[0] == null || isNaN(+a[0])) {
    console.log("chain", a); //EDIT THIS

    chain(a.slice(1), iter, bpm);
  } else {
    setTimeout(() => chain(a.slice(1), iter, bpm), (+a[0] / bpm) * 60000);
  }
}
