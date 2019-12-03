export const launchScreen = (
  state = {
    root: "" //loginReal // 'login' / 'after-login'
  },
  action = {}
) => {
  switch (action.type) {
    case "ROOT_CHANGED":
      return Object.assign({}, state, {
        root: action.root
      });
    default:
      return state;
  }
};

export const backHomeScreenIds = (state = "", action = {}) => {
  switch (action.type) {
    case "UPDATECURRSCREEN":
      return action.id;
    default:
      return state;
  }
};
