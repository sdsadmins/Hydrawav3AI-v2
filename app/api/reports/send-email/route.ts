import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";

/* =========================================================
   POST: Generate PDF + Send Email
========================================================= */
export async function POST(req: NextRequest) {
    // Use 'any' instead of 'puppeteer.Browser' to avoid TS2503:
    let browser: any = null;

    try {
        const body = await req.json();
        const { to, subject, message, report } = body;

        /* -------------------- Validation -------------------- */
        if (!to || !to.includes("@")) {
            return NextResponse.json(
                { success: false, error: "Valid recipient email is required" },
                { status: 400 }
            );
        }

        if (!report) {
            return NextResponse.json(
                { success: false, error: "Report data is required" },
                { status: 400 }
            );
        }

        /* -------------------- SMTP Config -------------------- */
        const smtpHost = process.env.SMTP_HOST || process.env.SMTP_SERVER;
        const smtpPort = Number(process.env.SMTP_PORT || 587);
        const smtpUser = process.env.SMTP_LOGIN_EMAIL || process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_SERVER_KEY || process.env.SMTP_PASSWORD;
        const fromEmail =
            process.env.SMTP_FROM_EMAIL || smtpUser || "no-reply@hydrawav3.com";

        if (!smtpHost || !smtpUser || !smtpPass) {
            return NextResponse.json(
                { success: false, error: "SMTP configuration missing" },
                { status: 500 }
            );
        }

        /* -------------------- Generate PDF -------------------- */
        const pdfHTML = generatePDFHTML(report);

        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(pdfHTML, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "2cm",
                bottom: "2cm",
                left: "2cm",
                right: "2cm",
            },
        });

        await browser.close();
        browser = null;

        /* -------------------- Email Setup -------------------- */
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user: smtpUser, pass: smtpPass },
            tls: { rejectUnauthorized: false },
        });

        const recipientName =
            report?.personal_snapshot?.name?.split(" ")[0] || "there";

        const htmlEmail = buildEmailHTML(recipientName, message);
        const textEmail = buildTextEmail(recipientName, message);

        /* -------------------- Send Email -------------------- */
        const info = await transporter.sendMail({
            from: `"Hydrawav3" <${fromEmail}>`,
            to,
            subject: subject || "Your Hydrawav3 Diagnostic Report",
            text: textEmail,
            html: htmlEmail,
            attachments: [
                {
                    filename: `Hydrawav3_Report_${new Date()
                        .toISOString()
                        .slice(0, 10)}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });

        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
            messageId: info.messageId,
        });
    } catch (err: any) {
        if (browser) await browser.close();
        console.error("EMAIL ERROR:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Failed to send email" },
            { status: 500 }
        );
    }
}

/* =========================================================
   EMAIL HTML (GMAIL SAFE – NO CLIPPING)
========================================================= */
function buildEmailHTML(name: string, customMessage?: string) {
    return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1a2b33;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
  
          <!-- Card -->
          <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
  
            <!-- Header -->
            <tr>
              <td style="background:#1f343d;padding:28px 20px;text-align:center;">
                <img src="https://hydrawavai.sumerudigital.com/logo.png"
                     alt="Hydrawav3 Logo"
                     width="140"
                     style="display:block;margin:0 auto 14px;" />
                <div style="color:#ffffff;font-size:20px;font-weight:600;">
                  Diagnostic Protocol Report
                </div>
              </td>
            </tr>
  
            <!-- Body -->
            <tr>
              <td style="padding:32px 34px;font-size:15px;line-height:1.8;">
                <p style="margin:0 0 18px;font-size:17px;font-weight:600;">
                  Dear ${name},
                </p>
  
                <p style="margin:0 0 22px;">
                  ${customMessage ||
        "Please find attached your diagnostic protocol report."
        }
                </p>
  
                <!-- Highlight box -->
                <table width="100%" cellpadding="0" cellspacing="0"
                       style="background:#fbfaf8;border-left:4px solid #d6b59c;border-radius:8px;margin:26px 0;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-weight:600;font-size:16px;margin-bottom:6px;">
                        📄 Your Report is Attached
                      </div>
                      <div style="color:#4b5563;font-size:14px;line-height:1.7;">
                        Please find your detailed diagnostic protocol report attached as a PDF.
                        This document contains your personalized insights, movement observations,
                        and recovery recommendations.
                      </div>
                    </td>
                  </tr>
                </table>
  
                <p style="margin:0 0 20px;">
                  This report has been carefully prepared to provide you with actionable insights
                  into your movement patterns and recovery needs. We recommend reviewing it with
                  your healthcare practitioner to develop a comprehensive recovery plan.
                </p>
  
                <p style="margin:0;">
                  If you have any questions or need further clarification, please don’t hesitate
                  to reach out to us.
                </p>
              </td>
            </tr>
  
            <!-- Divider -->
            <tr>
              <td style="padding:0 34px;">
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;">
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="padding:22px 30px;text-align:center;background:#fbfbfb;">
                <p style="margin:0 0 6px;font-weight:600;">
                  Best regards,
                </p>
                <p style="margin:0 0 14px;font-weight:600;">
                  The Hydrawav3 Team
                </p>
                <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
                  This is an automated email. Please do not reply directly to this message.<br />
                  For inquiries, please contact us through our official channels.
                </p>
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  </body>
  </html>
  `.trim();
}


/* =========================================================
   EMAIL TEXT
========================================================= */
function buildTextEmail(name: string, customMessage?: string) {
    return `
Dear ${name},

${customMessage ||
        "Your personalized diagnostic protocol report is attached as a PDF."}

Please review the report at your convenience.
If you have questions, our team is happy to help.

— Hydrawav3 Team
`.trim();
}

/* =========================================================
   PDF HTML (UNCHANGED LOGIC, SAFE STYLES)
========================================================= */
function generatePDFHTML(report: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
body {
  font-family: Arial, sans-serif;
  color: #1a2b33;
  line-height: 1.6;
}
h1, h2 {
  color: #1a2b33;
}
.section {
  margin-bottom: 25px;
}
</style>
</head>

<body>
<h1>Diagnostic Protocol Report</h1>

${report.personal_snapshot
            ? `
<div class="section">
<h2>Personal Snapshot</h2>
<p><strong>Name:</strong> ${report.personal_snapshot.name || "-"}</p>
<p><strong>Age:</strong> ${report.personal_snapshot.age || "-"}</p>
<p><strong>Primary Concern:</strong> ${report.personal_snapshot.primary_concern || "-"
            }</p>
</div>`
            : ""
        }

${report.movement_observations
            ? `
<div class="section">
<h2>Movement Observations</h2>
<p>${JSON.stringify(report.movement_observations)}</p>
</div>`
            : ""
        }

<p style="font-size:12px;color:#777;margin-top:40px">
This report is informational and intended to support professional guidance.
</p>

</body>
</html>
`.trim();
}
