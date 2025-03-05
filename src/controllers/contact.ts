import { Request, Response } from "express";
import z from "zod";
import { createTransporter } from "../utility/mailer";
import ContactMessage from "../models/ContactMessage";


const contactMessageSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    message: z.string().nonempty()
})

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const validationOb = contactMessageSchema.safeParse(req.body);
        if (validationOb.success) {
            const { name, email, message } = validationOb.data;
            const transporter = await createTransporter();
            const contactMessage = await ContactMessage.create({
                name: name,
                email: email,
                message: message
            })
            await transporter.sendMail({
                from: email,
                to: process.env.USER_EMAIL,
                replyTo: email,
                subject: `Received a New Message (ID: ${contactMessage._id})`,
                ...({
                    template: "contact-team-notification",
                    context: { name, email, message, id: contactMessage._id },
                } as any)
            });
            await transporter.sendMail({
                from: `MemNote" <${process.env.FROM_EMAIL}>`,
                to: email,
                subject: `[MemNote] Your Message Has Been Received!`,
                ...({
                    template: "contact-confirmation",
                    context: { name, email, message, id: contactMessage._id },
                } as any)
            });
            res.sendStatus(204);
        } else {
            res.status(400).json(validationOb.error);
        }
    } catch (err) {
        res.sendStatus(500);
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        );
    }
}