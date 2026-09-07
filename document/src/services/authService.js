/** Read the user object from the standard API envelope or a direct session. */
function getSessionUser(session) {
  return session?.data?.user || session?.user || null;
}

/** Determine whether a backend session is authenticated as an administrator. */
export function isAdminSession(session) {
  const payload = session?.data || session;
  const user = getSessionUser(session);
  const authenticated = payload?.authenticated === true || Boolean(user);
  const roleIds = user?.roleIds || payload?.roleIds || [];
  return authenticated && (
    user?.isAdmin === true
    || user?.role === "admin"
    || roleIds.includes("role-admin")
  );
}

/**
 * Create the authentication navigation service.
 *
 * Password verification and session cookies are handled by the backend. The
 * browser submits credentials only for the current request and never persists
 * a password or password hash.
 */
export function createAuthService() {
  return {
    /** Submit account credentials to the backend-managed session endpoint. */
    async login(request, credentials) {
      return request.post("/api/auth/login", credentials);
    },

    /** Create an account without persisting its password in browser storage. */
    async register(request, account) {
      return request.post("/api/auth/register", account);
    },

    /** @param {Object} request Shared request client. */
    async logout(request) {
      return request.post("/api/auth/logout");
    },
  };
}
