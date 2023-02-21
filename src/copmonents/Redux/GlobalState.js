const StateActionType = {
  SetProducts: "SetProducts",
  SetoneProduct: "SetoneProduct",
  DeleteProduct: "DeleteProduct",
};

class GlobalState {
  constructor() {
    this.products = [];
    this.oneProduct = {};
  }
}

export function SetProducts(products) {
  return {
    type: StateActionType.SetProducts,
    payload: products,
  };
}
export function SetoneProduct(oneProduct) {
  return {
    type: StateActionType.SetoneProduct,
    payload: oneProduct,
  };
}
export function DeleteProduct(products) {
  return {
    type: StateActionType.DeleteProduct,
    payload: products,
  };
}

export function stateReducer(currentState = new GlobalState(), action) {
  const newState = { ...currentState };
  switch (action.type) {
    case StateActionType.DeleteProduct:
      let i = newState.products.findIndex(
        (product) =>
          product.key1 === action.payload.key1 &&
          product.key2 === action.payload.key2
      );
      if (i !== -1) {
        newState.products.splice(i, 1);
        console.log(newState.products);
      }
      return currentState;

    case StateActionType.SetProducts:
      newState.products.push(action.payload);
      return currentState;
      break;
    case StateActionType.SetoneProduct:
      newState.oneProduct.name = action.payload.name;
      newState.oneProduct.num = action.payload.num;
    default:
      return currentState;
  }
}
