export const runtime = "edge"; // respond fast on Vercel

export async function POST(req: Request) {
  try {
    const update = await req.json();
    console.log("TELEGRAM UPDATE:", update);

    // Basic ACK so Telegram doesn't cry
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("ERROR:", err);
    // Always return 200 so Telegram stops throwing errors
    return new Response("OK", { status: 200 });
  }
}
