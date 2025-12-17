import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./presentation/routes/app-routes";
import { DevRoleSwitcher } from "./presentation/components/dev-role-switcher";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <AppRoutes />
      <DevRoleSwitcher />
      <Toaster />
    </Router>
  );
}

export default App;
