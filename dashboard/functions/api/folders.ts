/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function: GET & PUT /api/folders
// KV Binding: FOLDERS_KV (set in Cloudflare Dashboard → Pages → Settings → Bindings)

interface Env {
  FOLDERS_KV: KVNamespace;
}

const KV_KEY = "folder_structure";
const ADMIN_TOKEN = "quasar5-admin";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS (CORS preflight)
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

// GET /api/folders — 폴더 구조 읽기 (공개)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.env.FOLDERS_KV.get(KV_KEY);
    if (!data) {
      return new Response(JSON.stringify({
        groups: [{ id: "default", name: "기본" }],
        assignments: {}
      }), {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }
    return new Response(data, {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch {
    return new Response(JSON.stringify({ error: "KV read failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
};

// PUT /api/folders — 폴더 구조 저장 (관리자 전용)
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const authHeader = context.request.headers.get("Authorization");
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    const body = await context.request.text();
    JSON.parse(body); // validate
    await context.env.FOLDERS_KV.put(KV_KEY, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Write failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
};
