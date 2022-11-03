import axios from "axios";
import React from "react";
import ItemContainer from "./Container.module.css";

const ItemBox = ({
  id,
  name,
  price,
  image,
  deleteClick,
  editClick,
  dispatch,
}) => {
  return (
    <div className={ItemContainer.itemContainer}>
      <img className={ItemContainer.img} src={image} alt="item" />
      <div className="Details">
        <strong>{name}</strong>

        <p>
          <small>Php {price}</small>
        </p>
        <p>
          <button
            className="itemBtn"
            onClick={() =>
              axios
                .post("https://project-4-back-end.herokuapp.com/api/cart", {
                  id: id,
                  name: name,
                  price: price,
                  image: image,
                })
                .then((response) => {
                  dispatch({ type: "ADD-TO-CART", payload: { id: id } });
                })
            }
          >
            Order
          </button>
        </p>

        <p>
          <button className={ItemContainer.btn} onClick={() => deleteClick(id)}>
            Delete
          </button>
          <br />
          <button className={ItemContainer.btn} onClick={() => editClick(id)}>
            Edit
          </button>
          <br />
        </p>
      </div>
    </div>
  );
};

export default ItemBox;
