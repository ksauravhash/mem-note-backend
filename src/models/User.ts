import { Document, Model, Schema, model } from "mongoose";

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

const User:Model<IUser> = model('User', UserSchema);

export default User;