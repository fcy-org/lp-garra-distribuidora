import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const WEBHOOK_URL = "https://newtracking-sales-sys.vercel.app/api/webhooks/leads/cmpy5fztd000348rojo6xn9f5";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(z.record(z.unknown()))
  .handler(async ({ data }) => {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "(sem resposta)");
      throw new Error(`Lead capture failed — status ${response.status}: ${body}`);
    }
  });
