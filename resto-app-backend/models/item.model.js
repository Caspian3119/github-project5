const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const getData = (request, response) => {
  try {
    const data = fs.readFileSync("./routes/menu.json");
    response.status(200).send(data);
  } catch (err) {
    response.status(500).json(err);
  }
};

const addNewItem = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const items = parseData.items;
  const itemBody = request.body;

  const newItem = {
    id: uuidv4(),
    name: itemBody.name,
    price: itemBody.price,
    category: itemBody.category,
    image: itemBody.image,
  };

  let checkExisting = false;
  items.forEach((item) => {
    if (item.name == request.body.name) {
      checkExisting = true;
    }
  });

  if (!checkExisting) {
    items.push(newItem);
    const newMenu = { ...parseData, items: items };
    fs.writeFile(
      "./routes/menu.json",
      JSON.stringify(newMenu, null, 2),
      (err) => {
        if (err) {
          response.send(err.message);
        } else {
          response.send("Item Added");
        }
      }
    );
  }
};

const updateItem = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const items = parseData.items;
  const cart = parseData.cart;
  const itemBody = request.body;

  const updatedItems = items.map((item) => {
    if (item.id == request.params.id) {
      item = {
        id: item.id,
        name: itemBody.name,
        price: itemBody.price,
        image: itemBody.image,
        category: itemBody.category,
      };
    }
    return item;
  });

  const updatedCart = cart.map((item) => {
    if (item.id == request.params.id) {
      item = {
        id: item.id,
        name: itemBody.name,
        price: itemBody.price,
        image: itemBody.image,
        quantity: item.quantity,
      };
      return item;
    }
  });
  const newData = {
    ...parseData,
    items: updatedItems,
    cart: updatedCart,
  };

  fs.writeFile(
    "./routes/menu.json",
    JSON.stringify(newData, null, 2),
    (err) => {
      if (err) {
        response.send(err.message);
      } else {
        response.send("Item Updated");
      }
    }
  );
};

const deleteItem = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const items = parseData.items;
  const cart = parseData.cart;

  const selectedItem = items.filter((item) => item.id != request.params.id);
  const selectedCart = cart.filter((item) => item.id != request.params.id);

  const deletedItem = { ...parseData, items: selectedItem, cart: selectedCart };

  fs.writeFile(
    "./routes/menu.json",
    JSON.stringify(deletedItem, null, 2),
    (err) => {
      if (err) {
        response.send(err.message);
      } else {
        response.send("Item Deleted");
      }
    }
  );
};
module.exports = { getData, deleteItem, addNewItem, updateItem };
