import './index.css'
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/context.jsx";

function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Root />
);
