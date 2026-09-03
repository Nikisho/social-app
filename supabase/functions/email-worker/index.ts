import { supabaseAdmin } from "../_utils/supabase.ts";
// This function is designed to be run as a worker, processing email jobs in batches of 10.
// I built this function because the original email-attendees function failed to send 
// emails for a large number of attendees, likely due to timeouts or other limitations.
Deno.serve(async (req) => {
  try {
    const { data: jobs, error } = await supabaseAdmin
      .from("email_jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: "No emails to send" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const handleEmail = async (job: any) => {
      if (job.recipient_email.includes("linkzy")) {
        console.log(
          `Skipping test email ${job.email_job_id}`,
        );

        await supabaseAdmin
          .from("email_jobs")
          .update({
            status: "skipped",
          })
          .eq("email_job_id", job.email_job_id);

        return false;
      }

      try {
        console.log(
          `Sending ${job.email_job_id} to ${job.recipient_email}`,
        );
        const response = await fetch(
          "https://api.zeptomail.eu/v1.1/email",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: Deno.env.get("ZEPTOMAIL_API_KEY")!,
            },
            body: JSON.stringify({
              from: {
                address: "support@linkzyapp.com",
                name: "Linkzy",
              },
              to: [
                {
                  email_address: {
                    address: job.recipient_email,
                    name: "Linkzy",
                  },
                },
              ],
              subject: job.subject?.replace(/[\u0080-\uFFFF]/g, "") || "",
              htmlbody: job.body,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`ZeptoMail error ${response.status}: ${error}`);
        }

        const { error } = await supabaseAdmin
          .from("email_jobs")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("email_job_id", job.email_job_id);

        if (error) {
          console.error(
            `Failed to update job ${job.email_job_id}:`,
            error,
          );
          return false;
        }

        console.log(
          `Email job ${job.email_job_id} sent successfully`,
        );

        return true;
      } catch (error) {
        console.error(
          `Failed to send email job ${job.email_job_id}:`,
          error,
        );

        await supabaseAdmin
          .from("email_jobs")
          .update({
            status: "failed",
            error_message: error instanceof Error
              ? error.message
              : String(error),
          })
          .eq("email_job_id", job.email_job_id);

        return false;
      }
    };

    // Send the 10 emails concurrently
    const results = await Promise.all(
      jobs.map((job: any) => handleEmail(job)),
    );

    const sent = results.filter(Boolean).length;

    return new Response(
      JSON.stringify({
        message: "Email batch processed",
        total: jobs.length,
        sent,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Worker error:", error);

    return new Response(
      JSON.stringify({
        error: String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
});
