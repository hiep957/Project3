import { wrapper } from "@/redux/store";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";

function App({ Component, ...rest }: AppProps) {
  const { store } = wrapper.useWrappedStore(rest);
  const persistor = (store as any).persistor;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...rest.pageProps} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(App);
