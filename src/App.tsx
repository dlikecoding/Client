import { Route, Router } from "@solidjs/router";

import { lazy } from "solid-js";

const App = () => {
  const Homepage = lazy(() => import("./pages/Home"));

  const Library = lazy(() => import("./pages/library/Library"));

  //Summary each year (Library)
  const YearView = lazy(() => import("./pages/library/YearView"));
  const MonthView = lazy(() => import("./pages/library/MonthView"));

  const Collection = lazy(() => import("./pages/collection/Collection"));

  // For viewing Albums and Ai recognition dataset (Collection)
  const OverView = lazy(() => import("./pages/collection/OverView")); // Collection Summanry page
  const CollectionView = lazy(
    () => import("./pages/collection/CollectionView")
  );

  // View medias (Use for Library and Collection)
  const PhotoView = lazy(() => import("./pages/PhotoView"));

  // Admin Dashboard
  const Dashboard = lazy(() => import("./pages/Dashboard"));

  // Catch all unknown URL
  const NotFound = lazy(() => import("./pages/NotFound"));

  // Login and signup page
  const Login = lazy(() => import("./pages/auth/Login"));
  const Signup = lazy(() => import("./pages/auth/Signup"));

  return (
    <Router>
      <Route path="/" component={Homepage}>
        <Route path="/" />

        <Route path="/library" component={Library}>
          <Route path="/" component={YearView} />
          <Route path="/month" component={MonthView} />
          <Route path="/view" component={PhotoView} />
        </Route>

        <Route path="/collection" component={Collection}>
          <Route path="/" component={OverView} />

          <Route path="/album">
            <Route path="/" component={CollectionView} />
            <Route path="/:id" component={PhotoView} />
          </Route>

          <Route path="/dataset">
            <Route path="/" component={CollectionView} />
            <Route path="/:id" component={PhotoView} />
          </Route>

          <Route path="/favorite" component={PhotoView} />
          <Route path="/deleted" component={PhotoView} />
          <Route path="/hidden" component={PhotoView} />
          <Route path="/duplicate" component={PhotoView} />
        </Route>

        <Route path="/admin">
          <Route path="/" component={Dashboard} />
        </Route>
      </Route>

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      <Route path="*404" component={NotFound} />
    </Router>
  );
};

export default App;
