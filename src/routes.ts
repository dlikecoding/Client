import { lazy } from "solid-js";

const lazyImport = (path: string) => lazy(() => import(`./pages/${path}`));

// Main Pages
export const Homepage = lazyImport("Home");
export const NotFound = lazyImport("NotFound");

// Library Pages
export const Library = lazyImport("library/Library");
export const YearView = lazyImport("library/YearView");
export const MonthView = lazyImport("library/MonthView");

// Collection Pages
export const Collection = lazyImport("collection/Collection");
export const OverView = lazyImport("collection/OverView");
export const CollectionView = lazyImport("collection/CollectionView");

// Shared Media Viewer
export const PhotoView = lazyImport("PhotoView");

// Admin Dashboard
export const Dashboard = lazyImport("Dashboard");

// Authentication
export const Login = lazyImport("auth/Login");
export const Signup = lazyImport("auth/Signup");
