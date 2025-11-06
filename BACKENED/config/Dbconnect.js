const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_URL;

async function dbconnect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}

module.exports = dbconnect;
