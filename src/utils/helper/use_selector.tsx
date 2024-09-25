import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../auth/store";
import { convertEncryptData } from "../../utils/glable_function";

const selectSessionData = createSelector(
  (state: RootState) => state.session,
  (session) => ({
    isLoggedIn: session.isLoggedIn,
    user: session.user ? convertEncryptData(session.user) : null,
  })
);

export const useSessionData = () => {
  const sessionData = useSelector(selectSessionData);
  return sessionData;
};
