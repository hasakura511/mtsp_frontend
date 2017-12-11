import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const updateIngredients = (ingredient, delta) => {
  return {
    type: actionTypes.UPDATE_INGREDIENT,
    ingredient: ingredient,
    delta: delta
  };
};

export const setIngredients = ingredients => ({
  type: actionTypes.SET_INGREDIENTS,
  ingredients: ingredients
});

export const initIngredients = () => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.LOADING
    });
    axios
      .get("/ingredients.json")
      .then(response => {
        dispatch(setIngredients(response.data));
        dispatch({
          type: actionTypes.LOADED
        })
      })
      .catch(error => {
        dispatch({
          type: actionTypes.LOADED
        });
        dispatch({
          type: actionTypes.ERROR
        });
      });
  };
};

export const clearBurger = () => ({
  type: actionTypes.CLEAR_BURGER
})
