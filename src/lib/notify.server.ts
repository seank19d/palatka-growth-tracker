const FROM = "Palatka Homes Report <alerts@palatkahomesreport.com>";

export async function notifyInbox(subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ALERT_EMAIL?.trim();
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, text }),
    });
  } catch (err) {
    console.error("[notify] resend failed", err);
  }
}
