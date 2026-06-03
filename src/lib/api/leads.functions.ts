import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LEAD_CAPTURE_URL = "https://newtracking-sales-sys.vercel.app/api/public/leads";
const LEAD_CAPTURE_KEY = "t1eubvqv45w3sqp6w65j0usz";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(z.record(z.unknown()))
  .handler(async ({ data }) => {
    const response = await fetch(LEAD_CAPTURE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lead-capture-key": LEAD_CAPTURE_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "(sem resposta)");
      throw new Error(`Lead capture failed — status ${response.status}: ${body}`);
    }
  });
