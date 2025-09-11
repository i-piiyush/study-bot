const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
   await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("your database is connected");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDB
