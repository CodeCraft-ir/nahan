import { wpConfig } from "@/lib/wordpress/config";
import { NextRequest } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const { name, phone, email } = body as Record<string, string>;

  if (!name?.trim() || !phone?.trim()) {
    return Response.json(
      { success: false, code: "validation", message: "نام و شماره موبایل الزامی است." },
      { status: 400 },
    );
  }

  const wpUrl = `${wpConfig.siteUrl}/wp-json/nahan/v1/events/${id}/register`;

  try {
    const res = await fetch(wpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email?.trim() ?? "" }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { success: false, code: "server_error", message: "خطا در ارتباط با سرور." },
      { status: 500 },
    );
  }
}
