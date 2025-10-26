import { Routes, Route } from "react-router-dom";
import { SignIn } from "../pages/public/sign-in";
import { Landing } from "../pages/public/landing";
import { SignUp } from "../pages/public/sign-up";
import { RecoverPassword } from "../pages/public/recover-password";
import PrivateRoute from "./private-routes";
import { RoleBasedRoute } from "./role-based-route";
import { CreateNote } from "../pages/intern/nota-fiscal/create";
import Layout from "../components/layout/sidebar-provider";
import { ListNotes } from "../pages/intern/nota-fiscal/list";
import { CompanyManagement } from "../pages/intern/nota-fiscal/create-company";
import { Dashboard } from "../pages/intern/dashboard";
import { RequestedNotesPage } from "../pages/intern/requested-notes";
import { AdminPanel } from "../pages/intern/admin";
import { ClienteDashboard } from "../pages/intern/cliente/dashboard";
import { OperacionalDashboard } from "../pages/intern/operacional/dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route
        path="/company-management"
        element={
          <PrivateRoute>
            <Layout>
              <CompanyManagement />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/create-note"
        element={
          <PrivateRoute>
            <Layout>
              <CreateNote />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/list-notes"
        element={
          <PrivateRoute>
            <Layout>
              <ListNotes />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/requested-notes"
        element={
          <PrivateRoute>
            <Layout>
              <RequestedNotesPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminPanel />
            </Layout>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/cliente"
        element={
          <RoleBasedRoute allowedRoles={['cliente']} redirectTo="/operacional">
            <Layout>
              <ClienteDashboard />
            </Layout>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/operacional"
        element={
          <RoleBasedRoute allowedRoles={['operacional', 'admin']} redirectTo="/cliente">
            <Layout>
              <OperacionalDashboard />
            </Layout>
          </RoleBasedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
