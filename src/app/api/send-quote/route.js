import nodemailer from "nodemailer";

export async function POST(req) {

    try {

        const body = await req.json();

        const { fullName, email, phone, shipmentDetails } = body;

        const transporter = nodemailer.createTransport({

            host: "smtp.office365.com",

            port: 587,

            secure: false,

            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },

            tls: {
                rejectUnauthorized: false
            }

        });

        await transporter.sendMail({

            from: `"ADR Website" <${process.env.SMTP_USER}>`,

            to: "stuart@adrcarriers.net",

            subject: "New Quote Request",

            html: `
        <h2>New Quote Request</h2>

        <p><strong>Name:</strong> ${fullName}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Phone:</strong> ${phone}</p>

        <p><strong>Details:</strong><br/>${shipmentDetails}</p>
      `

        });

        return Response.json({ success: true });

    }

    catch (error) {

        console.error(error);

        return Response.json(

            { error: "Email failed" },

            { status: 500 }

        );

    }

}