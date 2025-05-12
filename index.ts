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
