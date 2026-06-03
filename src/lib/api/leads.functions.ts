import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LEAD_CAPTURE_URL = "https://newtracking-sales-sys.vercel.app/api/public/leads";
const LEAD_CAPTURE_KEY = "t1eubvqv45w3sqp6w65j0usz";
const WEBHOOK_URL = "https://newtracking-sales-sys.vercel.app/api/webhooks/leads/cmpy5fztd000348rojo6xn9f5";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(z.record(z.unknown()))
  .handler(async ({ data }) => {
    const [captureRes, webhookRes] = await Promise.all([
      fetch(LEAD_CAPTURE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lead-capture-key": LEAD_CAPTURE_KEY,
        },
        body: JSON.stringify(data),
      }),
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    ]);

    if (!captureRes.ok) {
      const body = await captureRes.text().catch(() => "(sem resposta)");
      throw new Error(`Lead capture failed — status ${captureRes.status}: ${body}`);
    }

    if (!webhookRes.ok) {
      const body = await webhookRes.text().catch(() => "(sem resposta)");
      console.error(`Webhook failed — status ${webhookRes.status}: ${body}`);
    }
  });
