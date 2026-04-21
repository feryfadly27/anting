import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("parent/dashboard", "routes/parent.dashboard.tsx"),
  route("m/parent/dashboard", "routes/m.parent.dashboard.tsx"),
  route("cadre/dashboard", "routes/cadre.dashboard.tsx"),
  route("puskesmas/dashboard", "routes/puskesmas.dashboard.tsx"),

  // Auth API Routes
  route("api/auth/login", "routes/api.auth.login.tsx"),
  route("api/auth/register", "routes/api.auth.register.tsx"),
  route("api/auth/logout", "routes/api.auth.logout.tsx"),
  route("api/auth/me", "routes/api.auth.me.tsx"),
  route("api/wilayah", "routes/api.wilayah.tsx"),

  // Dashboard API Routes
  route("api/parent/dashboard", "routes/api.parent.dashboard.tsx"),
  route("api/cadre/dashboard", "routes/api.cadre.dashboard.tsx"),
  route("api/puskesmas/dashboard", "routes/api.puskesmas.dashboard.tsx"),
] satisfies RouteConfig;
