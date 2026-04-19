import { posFetch } from "@/lib/pos";

export async function GET(req: Request) {
   try {
    const { searchParams } = new URL(req.url);

    const qs = searchParams.toString();
    const path = qs ? `?${qs}` : ``;

    const data = await posFetch(path);

    return Response.json(data);
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, { status: 500 });
  }
}