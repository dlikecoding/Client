import { Route, Router } from "@solidjs/router";

import { lazy } from "solid-js";

const App = () => {
  const Homepage = lazy(() => import("./pages/Home"));
  const Library = lazy(() => import("./pages/Library"));
  const Collection = lazy(() => import("./pages/Collection"));

  const YearView = lazy(() => import("./pages/groups/YearView"));
  const MonthView = lazy(() => import("./pages/groups/MonthView"));
  const PhotoView = lazy(() => import("./pages/PhotoView"));

  const OverView = lazy(() => import("./pages/OverView")); // Collection Summanry page
  const CollectionView = lazy(() => import("./pages/groups/CollectionView"));

  const NotFound = lazy(() => import("./pages/NotFound"));

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
          <Route path="/album" component={CollectionView}>
            <Route path="/album/:id" component={PhotoView} />
          </Route>
          <Route path="/dataset" component={CollectionView}>
            <Route path="/dataset/:id" component={PhotoView} />
          </Route>

          <Route path="/favorite" component={PhotoView} />
          <Route path="/deleted" component={PhotoView} />
          <Route path="/hidden" component={PhotoView} />
          <Route path="/duplicate" component={PhotoView} />
        </Route>
      </Route>

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      <Route path="*404" component={NotFound} />
    </Router>
  );
};

export default App;
