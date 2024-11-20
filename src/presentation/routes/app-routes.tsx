// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { SignIn } from "../pages/public/sign-in";
import { Landing } from "../pages/public/landing";
import { SignUp } from "../pages/public/sign-up";
import { RecoverPassword } from "../pages/public/recover-password";
import PrivateRoute from "./private-routes";
import { CreateNote } from "../pages/intern/nota-fiscal/create";
import Layout from "../components/layout/sidebar-provider";
import { ListNotes } from "../pages/intern/nota-fiscal/list";

const AppRoutes = () => {
  const isAuthenticated = true;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/recover-password" element={<RecoverPassword />} />

      <Route
        path="/create-note"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <CreateNote />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/list-notes"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <ListNotes />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
