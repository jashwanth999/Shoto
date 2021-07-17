const initialState  = {
  changed: false,
};
export const Changetrigger = (state = initialState , action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state,changed: action.payload };
    default:
      return state;
  }
};
