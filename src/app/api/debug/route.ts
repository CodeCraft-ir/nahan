export async function GET() {
  const siteUrl = process.env.WP_SITE_URL ?? "https://api.nahancafe.ir";

  let apiStatus: number | null = null;
  let apiError: string | null = null;

  try {
    const res = await fetch(`${siteUrl}/wp-json/`, {
      signal: AbortSignal.timeout(5000),
    });
    apiStatus = res.status;
  } catch (e) {
    apiError = String(e);
  }

  return Response.json({
    WP_SITE_URL: siteUrl,
    WC_CONSUMER_KEY_set: !!process.env.WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET_set: !!process.env.WC_CONSUMER_SECRET,
    apiStatus,
    apiError,
  });
}
