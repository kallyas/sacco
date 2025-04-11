import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layouts/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("setup", "routes/setup.tsx"),
  ]),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
