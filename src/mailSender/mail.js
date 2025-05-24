

import { createTransport } from "nodemailer";




export const sendEmails = async (email, userId) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: "mrahmmos@gmail.com",
            pass: "vfwefausytkbarfo",
        },
    });

    const info = await transporter.sendMail({
        from: '"Saraha WebApp" <mrahmmos@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Your Password", // Subject line
        html: ` <div class="container text-center my-5">
        <div class="user my-3">
            <h2>Click Here to reset your password</h2>
        </div>
        <div class="card p-5 w-50 m-auto">
            <h3 class="text-center">Hello,</h3>
            <p class="text-center">We have received a request to reset your password. click this link below to reset your password</p>
            <a href=http://localhost:3000/reset/${userId}>Reset Password</a>
            <p class="text-center">If you did not make this request, please ignore this email.</p>
            <p class="text-end">created by <span style="color:red; font-weight:bold">Ahmed Mostafa<span></p>
        </div>
    </div>`, // html body
    });
    console.log("Message sent: %s", info.messageId);

}

