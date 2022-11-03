const express = require("express");
const cors = require("cors");
const app = express(); //creates an express app
const bodyParser = require("body-parser");
const menuRouter = require("./routes/items");
const cartRouter = require("./routes/cart");
const port = 4000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.use("/api/menu", menuRouter);
app.use("/api/cart", cartRouter);

app.listen(port, () => {
  console.log(`Express server running on port ${port}.`);
});

module.exports = app;