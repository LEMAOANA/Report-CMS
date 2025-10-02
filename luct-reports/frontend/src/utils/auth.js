// src/utils/auth.js

// Save auth info with lastActivity timestamp
export const saveAuth = (data) => {
  const lastActivity = Date.now(); // timestamp in ms
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("lastActivity", lastActivity);
};

// Clear auth info
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("lastActivity");
};

// Check if auth is valid based on inactivity timeout (1 hour)
export const isAuthValid = () => {
  const token = localStorage.getItem("token");
  const lastActivity = localStorage.getItem("lastActivity");

  if (!token || !lastActivity) {
    clearAuth();
    return false;
  }

  const now = Date.now();
  const elapsed = now - Number(lastActivity);
  const hour = 60 * 60 * 1000; // 1 hour in ms

  if (elapsed > hour) {
    clearAuth();
    return false;
  }

  // Update lastActivity timestamp on each check
  localStorage.setItem("lastActivity", now);
  return true;
};
