const express = require("express");
//const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");

const app = express();

dotenv.config();

//Middleware
app.use(express.json({ extended: true }));
app.use("/uploads", express.static("uploads"));

//Route middlewares
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is up and running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Что-то пошло не так:", error.message);
    process.exit(1);
  }
}

start();
