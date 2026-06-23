import { createFileRoute } from "@tanstack/react-router";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, email, company, phone, service, message } = body as Record<string, string>;

          if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const client = await pool.connect();
          try {
            await client.query(
              `INSERT INTO contact_submissions (name, email, company, phone, service, message)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                name.trim().slice(0, 120),
                email.trim().slice(0, 255),
                (company ?? "").trim().slice(0, 200) || null,
                (phone ?? "").trim().slice(0, 40) || null,
                (service ?? "").trim().slice(0, 80) || null,
                message.trim().slice(0, 5000),
              ]
            );
          } finally {
            client.release();
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          console.error("Contact form error:", err);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
