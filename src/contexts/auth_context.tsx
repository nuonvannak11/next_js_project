"use client";

import { Provider } from "react-redux";
import { store, persistor } from "../auth/store";
import { PersistGate } from "redux-persist/integration/react";

interface ProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
