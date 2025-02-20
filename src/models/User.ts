import { Document, Model, Schema, model } from "mongoose";

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  verified: boolean;
  oauth: {
    provider: string;
  }
}

const UserSchema = new Schema<IUser>({
  name: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false
  },
  oauth: {
    type: {
      provider: String
    }
  }
});

const User: Model<IUser> = model("User", UserSchema);

export default User;
