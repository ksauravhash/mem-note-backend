import mongoose from "mongoose";

const name = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;
const clusterUrl = process.env.DB_CLUSTER_URL;

const connectionURL = `mongodb+srv://${username}:${password}@${clusterUrl}/${name}?retryWrites=true&w=majority&appName=Cluster0`;

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(connectionURL);
    console.log(`${new Date().toTimeString()} ${new Date().toDateString()} | Database connection established.`);
  } catch (err) {
    console.error(`${new Date().toTimeString()} ${new Date().toDateString()}`, err);
  }
};
