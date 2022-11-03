import React from "react";
import ItemContainer from "./Container.module.css";
import axios from "axios";
const CartItems = ({ name, price, image, quantity, dispatch, id }) => {
  return (
    <div className={ItemContainer.itemContainer}>
      <img className={ItemContainer.img} src={image} alt="item" />

      <div className="Details">
        <strong>{name}</strong>
        <p>
          <small>Php {price}</small>
        </p>
        <p>
          <small>SubTotal: {price * quantity}</small>
        </p>
        <p>
          <small>Quantity: {quantity}</small>
        </p>
        <p>
          <button
            className="quantity-buttons"
            onClick={() =>
              axios.put(`https://project-4-back-end.herokuapp.com/api/cart/decrement/${id}`).then((response) => {
                dispatch({
                  type: "QUANTITY",
                  payload: { type: "DECREMENT", id: id },
                })
              })
            }
          >
            {" "}
            -{" "}
          </button>
          <button
            className="quantity-buttons"
            onClick={() =>
              axios.put(`http://localhost:4000/api/cart/increment/${id}`).then((response) => {
                dispatch({
                  type: "QUANTITY",
                  payload: { type: "INCREMENT", id: id },
                })
              })
            }
          >
            {" "}
            +{" "}
          </button>
        </p>
        <p>
          <button
            className="buttons"
            onClick={() =>
              axios
                .delete(`http://localhost:4000/api/cart/${id}`)
                .then((response) => {
                  dispatch({ type: "CART-ITEM-DELETE", payload: { id: id } });
                })
            }
          >
            Delete
          </button>
        </p>
      </div>
    </div>
  );
};

export default CartItems;
