// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { SignIn } from "../pages/public/sign-in";
import { Landing } from "../pages/public/landing";
import { SignUp } from "../pages/public/sign-up";
import { RecoverPassword } from "../pages/public/recover-password";
import PrivateRoute from "./private-routes";
import { Home } from "../pages/intern/home";
import Layout from "../components/layout/sidebar-provider";

const AppRoutes = () => {
  const isAuthenticated = true

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/recover-password" element={<RecoverPassword />} />

       <Route
        path="/home"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
            <Home />
            </Layout>
          </PrivateRoute>
        }
      /> 
    </Routes>
  );
};

export default AppRoutes;
