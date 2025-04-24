import { serve } from "bun";
import { Board } from "johnny-five";
import RaspiIO from "raspi-io";

import { getStatusCode, Status } from "./types/Status";
import type { Code } from "./types/Code";
import { Glockenspiel, playNote } from "./types/Glockenspiel";

// Server status
let status: Status = Status.INIT;

// Glockenspiel Servo Controller
let gs: Glockenspiel | null = null;

// RPi GPIO Connection
const board = new Board({
  io: new RaspiIO(),
});

status = Status.NO_BOARD;

board.on("ready", () => {
  gs = new Glockenspiel();
  status = Status.READY;
});

serve({
  routes: {
    "/status": new Response(status, { status: getStatusCode(status) }),

    "/play": {
      POST: async (req) => {
        if (gs) {
          const body = (await req.json()) as { note: string };
          playNote(body.note, gs);
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
