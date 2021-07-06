const initailState = {
  searchHeader: false,
};
export const SetSearchHeaderReducer = (state = initailState, action) => {
  switch (action.type) {
    case "SET_SEARCH_HEADER":
      return { searchHeader: action.payload };
    default:
      return state;
  }
};
