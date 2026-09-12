/** Until palatkahomesreport.com is verified on Resend, default From must be onboarding@resend.dev. */
const DEFAULT_FROM = "Palatka Homes Report <onboarding@resend.dev>";

export async function notifyInbox(subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ALERT_EMAIL?.trim();
  if (!key || !to) {
    console.warn("[notify] skipped — set RESEND_API_KEY and ALERT_EMAIL");
    return;
  }
  const from = process.env.RESEND_FROM?.trim() || DEFAULT_FROM;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[notify] resend rejected", res.status, body.slice(0, 500));
    }
  } catch (err) {
    console.error("[notify] resend failed", err);
  }
}