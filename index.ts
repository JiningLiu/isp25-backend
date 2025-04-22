import { serve } from "bun";

serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": new Response("OK"),

    // Dynamic routes
    "/users/:id": (req) => {
      return new Response(`Hello User ${req.params.id}!`);
    },

    // Per-HTTP method handlers
    "/api/posts": {
      POST: async (req) => {
        const body = await req.json();
        // process
        return new Response("OK");
      },
    },

    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },

  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});
