import { createFileRoute } from "@tanstack/react-router";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

async function verifyAuth(request: Request): Promise<{ ok: true } | { ok: false; response: Response }> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        ok: false,
        response: new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        }),
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    };
  }
}

export const Route = createFileRoute("/api/admin/submissions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAuth(request);
        if (!auth.ok) return auth.response;

        const client = await pool.connect();
        try {
          const { rows } = await client.query(
            `SELECT id, name, email, company, phone, service, message, status, created_at
             FROM contact_submissions
             ORDER BY created_at DESC
             LIMIT 200`
          );
          return new Response(JSON.stringify({ submissions: rows }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Database error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        } finally {
          client.release();
        }
      },

      PATCH: async ({ request }) => {
        const auth = await verifyAuth(request);
        if (!auth.ok) return auth.response;

        let body: { id: unknown; status: unknown };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const id = Number(body.id);
        if (!Number.isInteger(id) || id <= 0) {
          return new Response(JSON.stringify({ error: "Invalid id" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const ALLOWED_STATUSES = ["new", "reviewed", "archived"];
        if (typeof body.status !== "string" || !ALLOWED_STATUSES.includes(body.status)) {
          return new Response(JSON.stringify({ error: "Invalid status" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const client = await pool.connect();
        try {
          await client.query(
            `UPDATE contact_submissions SET status = $1 WHERE id = $2`,
            [body.status, id]
          );
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Database error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        } finally {
          client.release();
        }
      },
    },
  },
});
