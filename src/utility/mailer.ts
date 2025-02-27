import nodemailer from 'nodemailer';
import path from 'path';

export const createTransporter = async () => {
    
    const transport = nodemailer.createTransport({
        pool: true,
        secure: true,
        service: "gmail",
        auth: {
            type: 'LOGIN',
            user: process.env.USER_EMAIL,
            pass: process.env.APP_PASSWORD
        }
    })
    const templatesPath = path.resolve(
        __dirname,
        "../email-templates"
    );
    const { default: hbs } = await import('nodemailer-express-handlebars');
    
    transport.use(
        "compile",
        hbs({
            viewEngine: {
                extname: ".hbs",
                partialsDir: templatesPath, // Path to templates
                defaultLayout: false,
            },
            viewPath: templatesPath,
            extName: ".hbs",
        })
    );
    return transport;
}