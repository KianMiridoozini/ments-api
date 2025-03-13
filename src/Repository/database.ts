import mongoose from "mongoose";

export async function testConnectionToDatabase() {
    try {
        await connectToDatabase();
        await disconnectFromDatabase();
        console.log("Database connection test successful (connect-disconnect)");
    } catch (error) {
        console.error("Error testing connection to database: " + error);
    }
}

export async function connectToDatabase() {
  try {
    if (!process.env.DBHOST) {
      throw new Error("DBHOST variable is not set");
    }
    await mongoose.connect(process.env.DBHOST);

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
     // console.log("Database connection established");
    } else {
      throw new Error("Database connection is not established");
    }
  } catch (error) {
    console.error("Error connecting to the database: " + error);
  }
}
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
   // console.log("Database connection closed");
  } catch (error) {
    console.error("Error disconnecting from the database: " + error);
  }
}