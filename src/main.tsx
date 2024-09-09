import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Wrap with BrowserRouter
import store from "./redux/store/store";
import AppWrapper from "./AppWrapper"; 

const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  );
}
