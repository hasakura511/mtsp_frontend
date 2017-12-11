import * as actionTypes from "../actions/actionTypes";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const INGREDIENT_LIMIT = {
  salad: 3,
  cheese: 3,
  meat: 3,
  bacon: 3
};

const initialState = {
  ingredients: null,
  totalPrice: 5,
  loading: false,
  error: false,
  building: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INGREDIENTS: {
      return {
        ...state,
        ingredients: action.ingredients,
        error: false,
        loading: false,
        building: true
      };
    }
    case actionTypes.UPDATE_INGREDIENT: {
      const ingredients = { ...state.ingredients };
      ingredients[action.ingredient] += action.delta;
      return {
        ...state,
        ingredients: ingredients,
        totalPrice:
          state.totalPrice +
          action.delta * INGREDIENT_PRICES[action.ingredient],
        loading: false
      };
    }
    case actionTypes.CLEAR_BURGER:
      return {...initialState};
    case actionTypes.LOADED:
      return {
        ...state,
        loading: false
      };
    case actionTypes.LOADING:
      return {
        ...state,
        loading: true
      };
    case actionTypes.ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      return state;
  }
};
