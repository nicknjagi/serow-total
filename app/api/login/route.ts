import { posFetch } from "@/lib/pos";

export async function GET() {
  try {
    // force a call to trigger login
    await posFetch("/login");
    return Response.json({ ok: true });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}