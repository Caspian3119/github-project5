import React, { useReducer, useEffect} from "react";
import ItemBox from "./components/ItemBox";
import FilterCartItem from "./components/FilterCartItem";
import NewItem from "./components/NewItem";
import EditItem from "./components/EditItemForm";
import { v4 as uuidv4 } from "uuid";
import CartItems from "./components/CartItems";
import Logo from "./components/image/bamboo.png"
import Styles from './App.module.css'
import axios from "axios"

const initialState= {
  items: [],
  newItems: false,
  editForm: false,
  cartItems: [],
  category: "",
  editItem: {
    id: "",
    name: "",
    price: 0,
    category: "",
    image: "",
  }
}

const reducer = (state, action) => {
  switch(action.type){
    case 'CATEGORIES':
      return { ...state, category: action.payload.category };
    case 'TOGGLE-ADD-ITEM-FORM': 
      return state.newItems ? {...state, newItems: false} : {...state, newItems: true}

    case 'TOGGLE-EDIT-ITEM-FORM': 
      return state.editForm ? {...state, editForm: false} : {...state, editForm: true}

    case 'ADD-ITEM-SUBMIT': 
      const item = {
        id: uuidv4(),
        ...action.payload.newItem
      };
      return {...state, items:[...state.items, item], newItems: false}

    case 'DELETE-ITEM': 
      const deleteItems = state.items.filter((item) => item.id !== action.payload.id) 
      const deleteCartItems = state.cartItems.filter((item) => item.id !== action.payload.id) 
      return {...state, items: deleteItems, cartItems: deleteCartItems};
    
    case 'CART-ITEM-DELETE': 
      const deleteItem = state.cartItems.filter((item) => item.id !== action.payload.id) 
      return {...state, cartItems: deleteItem};

    case 'TOGGLE-EDIT-FORM':
      const editForm = state.items.findIndex((item) => item.id === action.payload.id);
      const itemEdit = state.items[editForm];
      return {...state, editForm: true, editItem: itemEdit}

    case 'SAVE-EDIT-FORM':
      const updatedItem = state.items.map((item) => {
        if (item.id === action.payload.editedItem.id) {
          return action.payload.editedItem;
        } 
          return item;
      });
      const updateCartItems = state.cartItems.map((item) => {
        if (item.id === action.payload.editedItem.id) {
        return {...action.payload.editedItem, quantity: item.quantity}
        }
        return item;
      })
      return {...state, items: updatedItem, editForm: false, cartItems: updateCartItems};

    case 'ORDERS':
      let cartItems = [];
      let exist = true;
      const orders = state.cartItems.filter((item) => item.id === action.payload.id) 
      if (orders.length !== 0) {
        if (action.payload.type === 'INCREMENT') {
          cartItems = state.cartItems.map((item) => {
          if (item.id === action.payload.id) {
            return {...item, quantity: item.quantity++}
          }
            return item;
          });
        }

      else if (action.payload.type === 'DECREMENT') {
        exist = false
          cartItems = state.cartItems.map((item) => {
            if (item.id === action.payload.id) {
              if(item.quantity-1){
              return {...item, quantity: item.quantity-1}
            } 
            exist = true
            return item
          }
          return item;
          });

          if (exist === true) {
            cartItems = cartItems.filter((item) => item.id !== action.payload.id);
          }
          return {...state, cartItems: cartItems};
        }
      }
        
      else {
        let newItem = state.items.filter((item) => item.id === action.payload.id) 
        newItem = Object.assign({}, ...newItem)
        
        const item = {...newItem, quantity: 1}
        cartItems.push(...state.cartItems, {...item});
        } 
      return {...state, cartItems: cartItems};
  
    case 'QUANTITY': 
      let quantityOfCarts = [];
      if (action.payload.type === 'INCREMENT') {
        quantityOfCarts = state.cartItems.map((item) => {
          if (item.id === action.payload.id) {
            return {...item, quantity: item.quantity + 1}
          }
          return item;
        });
      } 
      else if (action.payload.type === 'DECREMENT') {
        let exist = false;
        quantityOfCarts = state.cartItems.map((item) => {
          if (item.id === action.payload.id) {
            if (item.quantity-1) {
            return {...item, quantity: item.quantity - 1}
            }  
            exist = true;
            return item;
          }
          return item;
        });
        if (exist === true) {
          quantityOfCarts = quantityOfCarts.filter((item) => item.id !== action.payload.id);
        }
      } 
      return {...state, cartItems: quantityOfCarts};

      case "MENU": {
        return {
          ...state,
          items: action.payload,
        };
      }

    default:
      return {...state}
    }
}

const App = () => {
  // RESTO APP
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    axios.get("http://localhost:3000/menu").then((response) => {
      dispatch({
        type: "MENU",
        payload: response.data,
      })
    });
  }, []);

  const categories = state.items.reduce((categories, item) => {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
    return categories;
  }, []);

  const handleOrderClick = (id) => {
    dispatch({type:'ORDERS', payload:{id}})
  };

  const addItem = (newItem) => {
    dispatch({type: 'ADD-ITEM-SUBMIT', payload: {newItem}})
  };

  const filterCategory = (category) => {
    dispatch ({type: 'CATEGORIES', payload: {category: category}});
  };

  const showAddItemForm = () => {
    dispatch({type: 'TOGGLE-ADD-ITEM-FORM', payload: {newItems: true} })
  };
  
  const editCurrItem = (editedItem) => {
    axios.put(`http://localhost:3000/menu/${editedItem}`).then((response) => {
      dispatch({type: 'SAVE-EDIT-FORM', payload:{editedItem}})
    });
  };

  const cancelEditItem = () => {
    dispatch({type: 'TOGGLE-EDIT-ITEM-FORM', payload: {editForm: false} })
  };

  const handleDeleteClick = (id) => {
    axios.delete(`http://localhost:3000/menu/${id}`).then((response) => {
      dispatch({type: 'DELETE-ITEM', payload: {id}})
    });
  };

  const handleEditClick = (id) => {
    dispatch({type: 'TOGGLE-EDIT-FORM', payload:{id}})
  };

  const hideEditButton = () => {
    dispatch ({ type: 'TOGGLE-EDIT-FORM', payload: {editForm: true}})
  };
  
  const listCartItems = state.cartItems.map((item, index) => (
    <CartItems
      key={index}
      dispatch={dispatch}
      id={item.id}
      name={item.name}
      price={item.price}
      image={item.image}
      quantity={item.quantity}
    />
  ));

  let filteredItems =
    state.category === ""
      ? state.items
      : state.items.filter((item) => {
          return item.category === state.category;
        });

  const listItems =
    filteredItems.length === 0 ? (
      <p>No item available.</p>
    ) : (
      filteredItems.map((item, index) => (
        //data transformation
        <ItemBox
          key={index}
          id={item.id}
          name={item.name}
          price={item.price}
          image={item.image}
          dispatch={dispatch}
          orderClick={handleOrderClick}
          deleteClick={handleDeleteClick}
          editClick={handleEditClick}
          editButton={state.editForm}
        />
      ))
    );   
    
    const getTotal = () => {
      let totalSum = 0
      state.cartItems.map((item) => {
        totalSum += item.price * item.quantity;
        })
        return totalSum;
    };
    
    const totalAmount = getTotal();
  return (
    <div className={Styles.App}> 
      {/* RESTO APP */}
      <div className={Styles.header}>
       <img src={Logo} alt="logo"/><p className={Styles.projName}>Bamboo Cafe</p>
      </div>

      <br />
        <button className={Styles.addItem} onClick={showAddItemForm}>Add Item</button>
      <br />

      {state.newItems ? <NewItem submit={addItem} cancel={showAddItemForm} /> : ""}
      {state.editForm ? <EditItem submit={editCurrItem} cancel={cancelEditItem} hideEditButton={hideEditButton} {...state.editItem} /> : ""}

      <br />
        <FilterCartItem filterCategory={filterCategory} categories={categories}/>
      <br />

      <div className={Styles.ItemList}>{listItems}</div>
        <p className={Styles.totalAmount}>Total Amount: Php {totalAmount}</p>
      <div className={Styles.ItemList}>{listCartItems}</div>
    </div>
  );
};

export default App;
