import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./presentation/routes/app-routes";
import { AuthInitializer } from "./components/shared/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <Router>
        <AppRoutes />
      </Router>
    </AuthInitializer>
  );
}

export default App;
