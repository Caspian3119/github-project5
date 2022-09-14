const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const taskFile = "./menu.json";
const taskFilePath = path.resolve(__dirname, taskFile);

//tasks endpoint
router.get("/", (request, response) => {
  const taskItems = fs.readFileSync(taskFilePath);
  response.send(taskItems);
});

router.post("/", (request, response) => {
  const tasksList = JSON.parse(fs.readFileSync(taskFilePath));
  const newMenu = {
    id: uuidv4(),
    name: request.body.name,
    price: request.body.price,
    category: request.body.category,
    image: request.body.image
  };

  //push/add to existing tasks
  tasksList.push(newMenu);
  //write to json file
  fs.writeFileSync(taskFilePath, JSON.stringify(tasksList));

  response.status(201).send();
});

router.delete("/:id", (request, response) => {
  const tasksList = JSON.parse(fs.readFileSync(taskFilePath));

  const filteredTasks = tasksList.filter(
    (task) => task.id != request.params.id
  );


  fs.writeFileSync(taskFilePath, JSON.stringify(filteredTasks));
  response.status(200).send();
});

router.put("/:id", (request, response) => {
  const tasksList = JSON.parse(fs.readFileSync(taskFilePath));

  const newMenu = {
    id: uuidv4(),
    name: request.body.name,
    price: request.body.price,
    category: request.body.category,
    image: request.body.image
  };

  //push/add to existing tasks
  tasksList.push(newMenu);
  //write to json file
  fs.writeFileSync(taskFilePath, JSON.stringify(tasksList));

  response.status(201).send();
});
module.exports = router;
