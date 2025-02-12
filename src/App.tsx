import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import AuthGuard from "./pages/auth/AuthGuard";

const App = () => {
  const Homepage = lazy(() => import("./pages/homepage/Home"));

  //Summary each year (Library)
  const Library = lazy(() => import("./pages/library/Library"));
  const YearView = lazy(() => import("./pages/library/YearView"));
  const MonthView = lazy(() => import("./pages/library/MonthView"));

  // For viewing Albums and Ai recognition dataset (Collection)
  const Collection = lazy(() => import("./pages/collection/Collection"));
  const OverView = lazy(() => import("./pages/collection/OverView")); // Collection Summanry page

  // View medias (Use for Library and Collection)
  const PhotoView = lazy(() => import("./components/photoview/PhotoView"));

  // Admin Dashboard
  const Dashboard = lazy(() => import("./pages/admin/Dashboard"));

  // Catch all unknown URL
  const NotFound = lazy(() => import("./components/extents/NotFound"));

  // Login and signup page
  const Login = lazy(() => import("./pages/auth/Login"));
  const Signup = lazy(() => import("./pages/auth/Signup"));

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
    },
  };

  return (
    <Router>
      {/* Unprotected Routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="*" component={NotFound} />

      {/* Protected Routes (Wrapped Inside a Route) */}
      <Route path="/" component={AuthGuard}>
        <Route path="/" component={Homepage}>
          <Route path="/" />

          <Route path="/library" component={Library}>
            <Route path="/" component={YearView} />
            <Route path="/month" component={MonthView} />
            <Route path="/:pages" component={PhotoView} matchFilters={filters.LIBRARY} />
          </Route>

          <Route path="/collection" component={Collection}>
            <Route path="/" component={OverView} />
            <Route path="/:pages/:id" component={PhotoView} matchFilters={filters.COLLECTION} />
            <Route path="/:pages" component={PhotoView} matchFilters={filters.UTILITIES} />
          </Route>

          <Route path="/:pages" component={PhotoView} matchFilters={filters.SEARCH} />

          <Route path="/admin">
            <Route path="/" component={Dashboard} />
          </Route>
        </Route>
      </Route>
    </Router>
  );
};

export default App;
