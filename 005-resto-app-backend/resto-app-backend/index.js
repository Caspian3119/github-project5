const express = require("express");
const cors = require("cors");
const app = express(); //creates an express app
const port = 3000;

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const menuRouter = require("./routes/menu");
const cartRouter = require("./routes/cart");

app.use(
  cors({
    origin: "*",
  })
);

app.use("/menu", menuRouter);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log(`Express server running on port ${port}.`);
});

