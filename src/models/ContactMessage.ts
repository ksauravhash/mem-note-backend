import { model, Schema } from "mongoose";


interface IContactMessage {
    name: string;
    email: string;
    message: string;
}

const contactMessageSchema = new Schema<IContactMessage>({
    name: {
        type: String,
        required: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email",
        },
    },
    message: {
        type: String,
        required: true
    }
})


const ContactMessage = model<IContactMessage>('Contact', contactMessageSchema);

export default ContactMessage;