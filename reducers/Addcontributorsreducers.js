
const initialState = {
  contributorslist: [],
}
export const Addcontributorsreducers = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CONTRIBUTORS":
      return {...state, contributorslist: action.payload };
    default:
      return state;
  }
};
