import { NextRequest, NextResponse } from "next/server";

// Satellite Product Sources
const SATELLITE_PRODUCTS: Record<string, string> = {
  // MOSDAC ISRO Live SCATSAT Scatterometer / Cyclone / Wind vector image
  mosdac: "https://mosdac.gov.in/live_data/fileServer/CycloneArchiveImages/LIVE/Images/SCATSAT_Latest.jpg",
  // IMD INSAT-3DS Color Cloud Top Brightness Temperature / Rainfall radar
  insat_ctbt: "https://mausam.imd.gov.in/Satellite/3Dasiasec_ctbt.jpg",
  // IMD INSAT-3DS Thermal Infrared
  insat_ir: "https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") || "insat_ctbt";

  const targetUrl = SATELLITE_PRODUCTS[product] || SATELLITE_PRODUCTS["insat_ctbt"];

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        Referer: "https://mosdac.gov.in/",
      },
      next: { revalidate: 300 }, // Cache for 5 mins
    });

    if (!res.ok) {
      // Fallback to ctbt if mosdac fails
      if (product === "mosdac") {
        const fallbackRes = await fetch(SATELLITE_PRODUCTS["insat_ctbt"]);
        const fallbackBuf = await fallbackRes.arrayBuffer();
        return new NextResponse(fallbackBuf, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
            "X-Satellite-Source": "IMD-INSAT-Fallback",
          },
        });
      }
      return NextResponse.json({ error: "Failed to fetch satellite photo" }, { status: 502 });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        "X-Satellite-Source": product === "mosdac" ? "ISRO-MOSDAC-Live" : "IMD-INSAT",
      },
    });
  } catch (error) {
    console.error("Satellite image proxy error:", error);
    return NextResponse.json({ error: "Internal error proxying satellite image" }, { status: 500 });
  }
}
