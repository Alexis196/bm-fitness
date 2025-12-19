import ReactDOM from "react-dom/client"
import App from "./App"
import { ClientProvider } from "./context/ClientContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClientProvider>
    <App />
  </ClientProvider>
)
