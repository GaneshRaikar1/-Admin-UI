import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from "notistack";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={1} autoHideDuration={2000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
    <App />
    </SnackbarProvider>
  </React.StrictMode>
);

reportWebVitals();
