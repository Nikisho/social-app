export const buildWaitlistOrganizerEmail = ({
    organizerName,
    eventTitle,
    name,
    email,
}: {
    organizerName: string;
    eventTitle: string;
    name: string;
    email: string;
}) => {
    return `
<div style="margin:0;padding:32px 16px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

    <!-- Header -->
    <div style="padding:24px 28px;border-bottom:1px solid #f0f0f0;">
      <div style="font-size:22px;font-weight:700;color:#111827;">
        Linkzy
      </div>
    </div>

    <!-- Content -->
    <div style="padding:28px;">

      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
        Hello ${organizerName},
      </p>

      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#111827;">
        New waitlist signup
      </h1>

      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">
        Someone has joined the waitlist for your event:
      </p>

      <!-- Event -->
      <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px;">
        <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">
          ${eventTitle}
        </p>
      </div>

      <!-- User Details -->
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#111827;">
        Waitlist member
      </p>

      <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <div style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">
            Name
          </p>
          <p style="margin:0;font-size:15px;color:#111827;">
            ${name}
          </p>
        </div>

        <div style="padding:14px 16px;">
          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">
            Email
          </p>
          <p style="margin:0;font-size:15px;color:#111827;">
            ${email}
          </p>
        </div>
      </div>

      <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
        If a ticket becomes available, this person will be notified according to your event's waitlist process.
      </p>

    </div>

    <!-- Footer -->
    <div style="padding:20px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">
        This notification was sent by Linkzy because a user joined your event waitlist.
      </p>
    </div>

  </div>
</div>
  `.trim();
};