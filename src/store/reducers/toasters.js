import * as actionTypes from "../actions/actionTypes";

/**
 * @constant initialState defines initialState of toasters store which array of toasters.
 * @example An example toaster would be toaster: {id: 'sample-id', text: 'Hello Toaster World.'}
 */
const initialState = {
  toasters: [{id: '1', text: 'Hello Toaster World.'}]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOASTER:
      return{
        ...state,
        toasters: state.toasters.concat([action.toaster])
      };
    case actionTypes.REMOVE_TOASTER: {
      return {
        ...state,
        toasters: state.toasters.filter(toaster => toaster.id !== action.id)
      };
    }
    default:
      return state;
  }
};

export default reducer;