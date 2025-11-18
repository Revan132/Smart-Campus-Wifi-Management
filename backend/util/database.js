import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const dbConnect = async()=>{

    try{
      const conn =  await mongoose.connect(process.env.MONGODB_URL);
      console.log(`Successfully connected to mongoDB: ${conn.connection.host}`);
    }

    catch(error)
    {
        console.log("Error connecting to MONGODB server");
        console.log(error);
        process.exit(0);

        //exit code 0 - failure, exit code 1 - success
    }
}




