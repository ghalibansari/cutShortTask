import { connect } from "mongoose";

export const DB = async () => {
  try {
    await connect(
      "mongodb+srv://admin:43FD3sfb42FnmE9T@cluster1.o4bpvut.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("connected to DB");
  } catch (error) {
    console.log("error while connecting to DB", error);
    process.exit(1);
  }
};
