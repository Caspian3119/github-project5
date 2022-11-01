const fs = require("fs");
const { parse } = require("path");

const getCart = (request, response) => {
  try {
    const data = fs.readFileSync("./routes/menu.json");
    response.status(200).send(data);
  } catch (err) {
    response.status(500).json(err);
  }
};

const addToCart = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const cart = parseData.cart;
  const addToCart = request.body;
  const cartCopy = [...cart];
  let updatedCart = [];
  const targetCart = cartCopy.filter((item) =>item.id === addToCart.id)

  if(targetCart.length > 0){
    updatedCart = cartCopy.map((item) => {
      if(item.id ===  addToCart.id){
        return {...item, quantity: item.quantity + 1}
      }
      return item
    })
  }
  else{
    updatedCart = [...cartCopy, {...addToCart, quantity: 1}]
  }
  const newCart = {...parseData, cart: updatedCart}
  fs.writeFile("./routes/menu.json", JSON.stringify(newCart, null, 2), (err) => {
    if (err) {
      response.send(err.message);
    } else {
      response.send("Item Updated");
    }
  });
}

const deleteItem = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const cart = parseData.cart;

  const selectedItem = cart.filter((item) => item.id != request.params.id);
  const deletedItem = { ...parseData, cart: selectedItem };

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

const incrementCart = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const cart = parseData.cart;

  const increment = cart.map((item) => {
    if(item.id == request.params.id){
      item = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity + 1
      }
    }
    return item 
  })
  const newQuantity = {
    ...parseData,
    cart:increment
  }
  fs.writeFile("./routes/menu.json", JSON.stringify(newQuantity, null, 2), (err) => {
    if (err) {
      response.send(err.message);
    } else {
      response.send("Item Updated");
    }
  });
}

const decrementCart = (request, response) => {
  const data = fs.readFileSync("./routes/menu.json");
  const parseData = JSON.parse(data);
  const cart = parseData.cart;

  const decrement = cart.map((item) => {
    if(item.id == request.params.id){
      item = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity - 1
      }
    }
    return item 
  })
  const newQuantity = {
    ...parseData,
    cart:decrement
  }
  fs.writeFile("./routes/menu.json", JSON.stringify(newQuantity, null, 2), (err) => {
    if (err) {
      response.send(err.message);
    } else {
      response.send("Item Updated");
    }
  });
}

module.exports = { getCart, addToCart, deleteItem, incrementCart, decrementCart};
