import { Routes, Route } from "react-router-dom";
import { SignIn } from "../pages/public/sign-in";
import { Landing } from "../pages/public/landing";
import { SignUp } from "../pages/public/sign-up";
import { RecoverPassword } from "../pages/public/recover-password";
import { RoleBasedRoute } from "./role-based-route";
import { LayoutUser } from "../components/layout-intern/layout-user";
import { LayoutOperational } from "../components/layout-intern/layout-operational";
import { PUBLIC_ROUTES, USER_ROUTES, OPERATIONAL_ROUTES } from "./route-paths";

// User pages
import { UserDashboard } from "../pages/user/dashboard";
import { MyRequests } from "../pages/user/my-requests";
import { NewRequest } from "../pages/user/new-request";
import { MyCompanies } from "../pages/user/my-companies";
import { NewCompany } from "../pages/user/new-company";
import { Profile } from "../pages/user/profile";

// Operational pages
import { OperationalDashboard } from "../pages/operational/dashboard";
import { AllRequests } from "../pages/operational/all-requests";
import { PendingRequests } from "../pages/operational/pending-requests";
import { ProcessedRequests } from "../pages/operational/processed-requests";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={PUBLIC_ROUTES.HOME} element={<Landing />} />
      <Route path={PUBLIC_ROUTES.SIGN_IN} element={<SignIn />} />
      <Route path={PUBLIC_ROUTES.SIGN_UP} element={<SignUp />} />
      <Route path={PUBLIC_ROUTES.RECOVER_PASSWORD} element={<RecoverPassword />} />

      {/* User Routes */}
      <Route
        path={USER_ROUTES.DASHBOARD}
        element={
          <RoleBasedRoute allowedRoles={['cliente']}>
            <LayoutUser>
              <UserDashboard />
            </LayoutUser>
          </RoleBasedRoute>
        }
      />
      <Route
        path={USER_ROUTES.MY_REQUESTS}
        element={
          <RoleBasedRoute allowedRoles={['cliente']}>
            <LayoutUser>
              <MyRequests />
            </LayoutUser>
          </RoleBasedRoute>
        }
      />
      <Route
        path={USER_ROUTES.NEW_REQUEST}
        element={
          <RoleBasedRoute allowedRoles={['cliente']}>
            <LayoutUser>
              <NewRequest />
            </LayoutUser>
          </RoleBasedRoute>
        }
      />
      <Route
        path={USER_ROUTES.MY_COMPANIES}
        element={
          <RoleBasedRoute allowedRoles={['cliente']}>
            <LayoutUser>
              <MyCompanies />
            </LayoutUser>
          </RoleBasedRoute>
        }
      />
      <Route
        path={USER_ROUTES.NEW_COMPANY}
        element={
          <RoleBasedRoute allowedRoles={['cliente']}>
            <LayoutUser>
              <NewCompany />
            </LayoutUser>
          </RoleBasedRoute>
        }
      />
      <Route
        path={USER_ROUTES.PROFILE}
        element={
          <RoleBasedRoute allowedRoles={['cliente']}>
            <LayoutUser>
              <Profile />
            </LayoutUser>
          </RoleBasedRoute>
        }
      />

      {/* Operational Routes */}
      <Route
        path={OPERATIONAL_ROUTES.DASHBOARD}
        element={
          <RoleBasedRoute allowedRoles={['operacional', 'admin']}>
            <LayoutOperational>
              <OperationalDashboard />
            </LayoutOperational>
          </RoleBasedRoute>
        }
      />
      <Route
        path={OPERATIONAL_ROUTES.ALL_REQUESTS}
        element={
          <RoleBasedRoute allowedRoles={['operacional', 'admin']}>
            <LayoutOperational>
              <AllRequests />
            </LayoutOperational>
          </RoleBasedRoute>
        }
      />
      <Route
        path={OPERATIONAL_ROUTES.PENDING_REQUESTS}
        element={
          <RoleBasedRoute allowedRoles={['operacional', 'admin']}>
            <LayoutOperational>
              <PendingRequests />
            </LayoutOperational>
          </RoleBasedRoute>
        }
      />
      <Route
        path={OPERATIONAL_ROUTES.PROCESSED_REQUESTS}
        element={
          <RoleBasedRoute allowedRoles={['operacional', 'admin']}>
            <LayoutOperational>
              <ProcessedRequests />
            </LayoutOperational>
          </RoleBasedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
