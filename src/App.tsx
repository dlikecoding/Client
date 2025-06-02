import { lazy } from "solid-js";
import { Navigate, Route, Router } from "@solidjs/router";

import AuthGuard from "./pages/auth/AuthGuard";
import { AuthProvider } from "./context/AuthProvider";

export const VIDEO_API_URL = import.meta.env.VITE_DEV_MODE === "dev" ? import.meta.env.VITE_VIDEO_URL : "";

const HomepageRedirect = () => <Navigate href="/library/" />;

const App = () => {
  const Layout = lazy(() => import("./pages/main_layout/Layout"));

  // Summary each year (Library)
  const Library = lazy(() => import("./pages/library/Library"));
  const GroupView = lazy(() => import("./pages/library/GroupView"));

  // For viewing Albums and Ai recognition dataset (Collection)
  const Collection = lazy(() => import("./pages/collection/Collection"));
  const OverView = lazy(() => import("./pages/collection/OverView")); // Collection Summanry page

  // For Searching dataset (Search)
  const ContextSearch = lazy(() => import("./pages/search/ContextSearch"));
  const Search = lazy(() => import("./pages/search/Search"));

  // View medias (Use for Library and Collection)
  const PhotoView = lazy(() => import("./components/photoview/PhotoView"));

  // Admin Dashboard
  const Profile = lazy(() => import("./pages/user/Profile"));
  const Dashboard = lazy(() => import("./pages/admin/Dashboard"));

  // Catch all unknown URL
  const NotFound = lazy(() => import("./components/extents/NotFound"));

  // Login and signup page
  const Login = lazy(() => import("./pages/auth/Login"));
  const Signup = lazy(() => import("./pages/auth/Signup"));
  const ForgetPW = lazy(() => import("./pages/auth/ForgetPW"));

  const filters = {
    COLLECTION: {
      pages: ["album", "dataset"],
      id: /^\d+$/,
    },
    UTILITIES: {
      pages: ["favorite", "deleted", "hidden", "duplicate"],
    },
    LIBRARY: {
      pages: ["all"],
    },
    SEARCH: {
      pages: ["search"],
      mediaId: /^\d+$/,
      // keywords: /^[a-zA-Z0-9 -]*$/,
    },
  };

  return (
    <Router>
      <Route component={AuthProvider}>
        {/* Unprotected Routes */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forget" component={ForgetPW} />

        {/* Protected Routes (Wrapped Inside a Route) */}
        <Route component={AuthGuard}>
          <Route component={Layout}>
            <Route path="/" component={HomepageRedirect} />

            <Route path="/user">
              <Route path="/" component={Profile} />
              <Route path="/admin" component={Dashboard} />
            </Route>

            <Route path="/library" component={Library}>
              <Route path="/" component={GroupView}>
                <Route path="/" />
                <Route path="/month" />
              </Route>
              <Route path="/:pages" component={PhotoView} matchFilters={filters.LIBRARY} />
            </Route>

            <Route path="/collection" component={Collection}>
              <Route path="/" component={OverView} />
              <Route path="/:pages/:id" component={PhotoView} matchFilters={filters.COLLECTION} />
              <Route path="/:pages" component={PhotoView} matchFilters={filters.UTILITIES} />
            </Route>

            <Route path="/:pages" component={ContextSearch} matchFilters={filters.SEARCH}>
              <Route path="/" component={Search} />
              <Route path="/:mediaId" component={PhotoView} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" component={NotFound} />
    </Router>
  );
};

export default App;
