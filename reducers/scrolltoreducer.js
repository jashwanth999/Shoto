const initailState = {
  cord: [],
};
export const scrolltoreducer = (state = initailState, action) => {
  switch (action.type) {
    case "SCROLL_TO":
      return {
        cord: [...state.cord, action.payload],
      };
    case "CLEAR_CORD":
      return { ...state, cord: [] };
    default:
      return state;
  }
};
