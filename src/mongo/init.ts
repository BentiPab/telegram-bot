const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;

const main = async () => {
  await mongoose.connect(mongoUrl);
};

main();
