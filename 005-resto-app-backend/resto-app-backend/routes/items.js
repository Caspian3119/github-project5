const express = require("express");
const router = express.Router();

const models = require("../models/item.model");

router.get("/", models.getData);
router.post("/", models.addNewItem);
router.put("/:id", models.updateItem);
router.delete("/:id", models.deleteItem);

module.exports = router;
