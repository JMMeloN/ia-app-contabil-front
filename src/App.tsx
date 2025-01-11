import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./presentation/routes/app-routes";
import { AuthProvider } from "./presentation/hooks/use-auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
