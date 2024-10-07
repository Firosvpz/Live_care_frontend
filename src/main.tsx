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
import { GoogleOAuthProvider } from "@react-oauth/google";
const rootElement = document.getElementById("root") as HTMLElement;

const clientId =
  "776565001342-1aa2ip7rku1mm54r82dvkh39pe5g5d8q.apps.googleusercontent.com";

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={clientId}>
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
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>,
  );
}
