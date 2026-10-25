import { apiSuccess, handleApiError } from "@/lib/api";
import { listTrades, searchArtisans } from "@/services/artisan.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("meta") === "trades") {
      const trades = await listTrades();
      return apiSuccess(trades);
    }

    const artisans = await searchArtisans({
      q: searchParams.get("q") ?? undefined,
      trade: searchParams.get("trade") ?? undefined,
      city: searchParams.get("city") ?? undefined,
    });
    return apiSuccess(artisans);
  } catch (error) {
    return handleApiError(error);
  }
}
