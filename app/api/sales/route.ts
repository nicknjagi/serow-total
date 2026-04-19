import { posFetch } from "@/lib/pos";

export async function GET() {
  try {
    const data = await posFetch("/sales"); // <-- adjust endpoint

    return Response.json(data);
  } catch (err: any) {
    console.log(err)
    return new Response(err.message, { status: 500 });
  }
}