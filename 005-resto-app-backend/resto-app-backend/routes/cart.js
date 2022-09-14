const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const taskFile = "./cart.json";
const taskFilePath = path.resolve(__dirname, taskFile);