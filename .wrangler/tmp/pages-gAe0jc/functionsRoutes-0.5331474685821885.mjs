import { onRequestGet as __api_admin_stats_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\admin\\stats.js"
import { onRequestOptions as __api_admin_stats_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\admin\\stats.js"
import { onRequestGet as __api_admin_users_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\admin\\users.js"
import { onRequestOptions as __api_admin_users_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\admin\\users.js"
import { onRequestPatch as __api_admin_users_js_onRequestPatch } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\admin\\users.js"
import { onRequestOptions as __api_auth_google_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\auth\\google.js"
import { onRequestPost as __api_auth_google_js_onRequestPost } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\auth\\google.js"
import { onRequestOptions as __api_auth_logout_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\auth\\logout.js"
import { onRequestPost as __api_auth_logout_js_onRequestPost } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\auth\\logout.js"
import { onRequestGet as __api_auth_me_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\auth\\me.js"
import { onRequestOptions as __api_auth_me_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\auth\\me.js"
import { onRequestOptions as __api_progress_migrate_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\progress\\migrate.js"
import { onRequestPost as __api_progress_migrate_js_onRequestPost } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\progress\\migrate.js"
import { onRequestGet as __api_users_achievements_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\achievements.js"
import { onRequestOptions as __api_users_achievements_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\achievements.js"
import { onRequestGet as __api_users_certificate_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\certificate.js"
import { onRequestOptions as __api_users_certificate_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\certificate.js"
import { onRequestDelete as __api_users_delete_js_onRequestDelete } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\delete.js"
import { onRequestOptions as __api_users_delete_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\delete.js"
import { onRequestGet as __api_users_export_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\export.js"
import { onRequestOptions as __api_users_export_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\export.js"
import { onRequestDelete as __api_users_me_js_onRequestDelete } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\me.js"
import { onRequestGet as __api_users_me_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\me.js"
import { onRequestOptions as __api_users_me_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\me.js"
import { onRequestPatch as __api_users_me_js_onRequestPatch } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\users\\me.js"
import { onRequestOptions as __api_progress__day__js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\progress\\[day].js"
import { onRequestPost as __api_progress__day__js_onRequestPost } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\progress\\[day].js"
import { onRequestGet as __api_progress_index_js_onRequestGet } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\progress\\index.js"
import { onRequestOptions as __api_progress_index_js_onRequestOptions } from "C:\\Users\\dell\\Desktop\\New Coders\\Web New Coders\\functions\\api\\progress\\index.js"

export const routes = [
    {
      routePath: "/api/admin/stats",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_stats_js_onRequestGet],
    },
  {
      routePath: "/api/admin/stats",
      mountPath: "/api/admin",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_admin_stats_js_onRequestOptions],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_users_js_onRequestGet],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_admin_users_js_onRequestOptions],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "PATCH",
      middlewares: [],
      modules: [__api_admin_users_js_onRequestPatch],
    },
  {
      routePath: "/api/auth/google",
      mountPath: "/api/auth",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_auth_google_js_onRequestOptions],
    },
  {
      routePath: "/api/auth/google",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_google_js_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestOptions],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestGet],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestOptions],
    },
  {
      routePath: "/api/progress/migrate",
      mountPath: "/api/progress",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_progress_migrate_js_onRequestOptions],
    },
  {
      routePath: "/api/progress/migrate",
      mountPath: "/api/progress",
      method: "POST",
      middlewares: [],
      modules: [__api_progress_migrate_js_onRequestPost],
    },
  {
      routePath: "/api/users/achievements",
      mountPath: "/api/users",
      method: "GET",
      middlewares: [],
      modules: [__api_users_achievements_js_onRequestGet],
    },
  {
      routePath: "/api/users/achievements",
      mountPath: "/api/users",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_users_achievements_js_onRequestOptions],
    },
  {
      routePath: "/api/users/certificate",
      mountPath: "/api/users",
      method: "GET",
      middlewares: [],
      modules: [__api_users_certificate_js_onRequestGet],
    },
  {
      routePath: "/api/users/certificate",
      mountPath: "/api/users",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_users_certificate_js_onRequestOptions],
    },
  {
      routePath: "/api/users/delete",
      mountPath: "/api/users",
      method: "DELETE",
      middlewares: [],
      modules: [__api_users_delete_js_onRequestDelete],
    },
  {
      routePath: "/api/users/delete",
      mountPath: "/api/users",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_users_delete_js_onRequestOptions],
    },
  {
      routePath: "/api/users/export",
      mountPath: "/api/users",
      method: "GET",
      middlewares: [],
      modules: [__api_users_export_js_onRequestGet],
    },
  {
      routePath: "/api/users/export",
      mountPath: "/api/users",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_users_export_js_onRequestOptions],
    },
  {
      routePath: "/api/users/me",
      mountPath: "/api/users",
      method: "DELETE",
      middlewares: [],
      modules: [__api_users_me_js_onRequestDelete],
    },
  {
      routePath: "/api/users/me",
      mountPath: "/api/users",
      method: "GET",
      middlewares: [],
      modules: [__api_users_me_js_onRequestGet],
    },
  {
      routePath: "/api/users/me",
      mountPath: "/api/users",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_users_me_js_onRequestOptions],
    },
  {
      routePath: "/api/users/me",
      mountPath: "/api/users",
      method: "PATCH",
      middlewares: [],
      modules: [__api_users_me_js_onRequestPatch],
    },
  {
      routePath: "/api/progress/:day",
      mountPath: "/api/progress",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_progress__day__js_onRequestOptions],
    },
  {
      routePath: "/api/progress/:day",
      mountPath: "/api/progress",
      method: "POST",
      middlewares: [],
      modules: [__api_progress__day__js_onRequestPost],
    },
  {
      routePath: "/api/progress",
      mountPath: "/api/progress",
      method: "GET",
      middlewares: [],
      modules: [__api_progress_index_js_onRequestGet],
    },
  {
      routePath: "/api/progress",
      mountPath: "/api/progress",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_progress_index_js_onRequestOptions],
    },
  ]