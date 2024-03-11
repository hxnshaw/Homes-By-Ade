require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//routers
const buyerRouter = require("./routers/buyerRouter");
const sellerRouter = require("./routers/sellerRouter");
const adminRouter=require("./routers/adminRouter");

//NotFound and ErrorHandler Middlewares
const notFoundMiddleware = require("./middlewares/not-found");

//npm packages
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser(process.env.JWT_SECRET_TOKEN));

//setup routers
app.use("/api/v1/ade-homes", buyerRouter);
app.use("/api/v1/ade-homes", sellerRouter);
app.use("/api/v1/ade-homes", adminRouter);

app.use(notFoundMiddleware);

const PORT = 2006;

app.listen(PORT, async () => {
  console.log(`Server is live on port ${PORT}`);
  await sequelize.authenticate();
  console.log(`Database Connected Successfully.`);
});
