import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const wpUrl = process.env.WP_SITE_URL ?? "(not set)";
  const hasKey = !!process.env.WC_CONSUMER_KEY;
  const hasSecret = !!process.env.WC_CONSUMER_SECRET;

  let apiReachable = false;
  let apiStatus: number | null = null;
  let apiError: string | null = null;

  try {
    const res = await fetch(`${wpUrl}/wp-json/`, {
      signal: AbortSignal.timeout(8000),
    });
    apiReachable = res.ok;
    apiStatus = res.status;
  } catch (e) {
    apiError = String(e);
  }

  return NextResponse.json({
    WP_SITE_URL: wpUrl,
    WC_CONSUMER_KEY_set: hasKey,
    WC_CONSUMER_SECRET_set: hasSecret,
    apiReachable,
    apiStatus,
    apiError,
  });
}
