// import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Wrap with BrowserRouter
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import store from "./redux/store/store";
import AppWrapper from "./AppWrapper";
import "./index.css";
const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
        <Toaster
          position="top-center"
          containerStyle={{
            zIndex: 99999, // Very high z-index
            top: "1rem",
          }}
        />
      </ThemeProvider>
    </Provider>,
  );
}
