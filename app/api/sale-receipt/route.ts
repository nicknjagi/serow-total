import { saleFetch } from "@/lib/pos";


export async function GET(req: Request) {
   try {
    const { searchParams } = new URL(req.url);

    const saleId = searchParams.get("saleId");

    const data = await saleFetch(saleId!);

    return Response.json(data);
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, { status: 500 });
  }
}