
const initailState = {
  contributorslist: [],
}
export const Addcontributorsreducers = (state = initailState, action) => {
  switch (action.type) {
    case "ADD_CONTRIBUTORS":
      return { contributorslist: action.payload };
    default:
      return state;
  }
};
