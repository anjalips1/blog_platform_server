const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    const DB_URL = process.env.DB_URL;
    const DB_NAME = process.env.DB_NAME;

    mongoose.set("strictQuery", false);

    await mongoose.connect(DB_URL, {
      dbName: DB_NAME,
    });

    console.log(`Connected to the database ${DB_NAME}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return false;
  }
};
