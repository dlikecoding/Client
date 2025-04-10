import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import AuthGuard from "./pages/auth/AuthGuard";
import { AuthProvider } from "./context/AuthProvider";

const App = () => {
  const Homepage = lazy(() => import("./pages/homepage/Home"));

  // Summary each year (Library)
  const Library = lazy(() => import("./pages/library/Library"));
  const GroupView = lazy(() => import("./pages/library/GroupView"));

  // For viewing Albums and Ai recognition dataset (Collection)
  const Collection = lazy(() => import("./pages/collection/Collection"));
  const OverView = lazy(() => import("./pages/collection/OverView")); // Collection Summanry page

  // For Searching dataset (Search)
  const Search = lazy(() => import("./pages/search/Search"));

  // View medias (Use for Library and Collection)
  const PhotoView = lazy(() => import("./components/photoview/PhotoView"));

  // Admin Dashboard
  const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
  const Profile = lazy(() => import("./pages/user/Profile"));

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
      keyworks: /^[a-zA-Z0-9\s]*$/,
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
        <Route path="/" component={AuthGuard}>
          <Route path="/" component={Homepage}>
            <Route path="/" component={Search} />
            <Route path="/:pages/:keywords" component={PhotoView} matchFilters={filters.SEARCH} />

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
          </Route>
        </Route>

        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  );
};

export default App;
