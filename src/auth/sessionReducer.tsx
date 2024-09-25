"use client";

interface SessionState {
  user: any;
  isLoggedIn: boolean;
}

const initialState: SessionState = {
  user: null,
  isLoggedIn: false,
};

const sessionReducer = (
  state: SessionState = initialState,
  action: any
): SessionState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default sessionReducer;
