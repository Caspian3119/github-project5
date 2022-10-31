const express = require("express");
const router = express.Router();

const models = require("../models/cart.model");

router.get("/", models.getCart);
//router.put("/:id", models.updateItem);
//router.delete("/:id", models.deleteItem);
router.post("/", models.addToCart)

module.exports = router;
