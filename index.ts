import { serve } from "bun";
import { Board } from "johnny-five";
import RaspiIO from "raspi-io";

import { getStatusCode, Status } from "./types/Status";
import type { Code } from "./types/Code";
import { Glockenspiel, playNote } from "./types/Glockenspiel";
import { Lights, ledOn, ledOff, ledsSet } from "./types/Lights";

// Server status
let status: Status = Status.INIT;

// Glockenspiel Servo Controller
let gs: Glockenspiel | null = null;

// Indicator Lights Controller
let lights: Lights | null = null;

// RPi GPIO Connection
const board = new Board({
  io: new RaspiIO(),
});

let playNoteTimeout: NodeJS.Timeout | null = null;

status = Status.NO_BOARD;

board.on("ready", () => {
  gs = new Glockenspiel();
  lights = new Lights();
  status = Status.READY;
});

serve({
  routes: {
    "/status": new Response(status, { status: getStatusCode(status) }),

    "/play": {
      POST: async (req) => {
        if (gs && lights) {
          const body = (await req.json()) as { note: string };

          if (playNoteTimeout) clearTimeout(playNoteTimeout);

          playNote(body.note, gs);
          ledOn(body.note, lights);
          playNoteTimeout = setTimeout(() => {
            if (lights) {
              ledOff(body.note, lights);
            }
          }, 500);

          return new Response("OK");
        }
        return new Response("No Board", { status: 500 });
      },
    },

    "/submit": {
      POST: async (req) => {
        const code = (await req.json()) as Code;
        return new Response("OK");
      },
    },

    "/*": new Response("Not Found", { status: 404 }),
  },

  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});
