interface AdminSession {
  sessionToken: string;
  expiresAt: string;
}

export function setAdminSession(sessionToken: string, expiresAt: string): void {
  const session: AdminSession = { sessionToken, expiresAt };
  localStorage.setItem("adminSession", JSON.stringify(session));
}

export function getAdminSession(): AdminSession | null {
  const stored = localStorage.getItem("adminSession");
  if (!stored) return null;
  
  try {
    const session: AdminSession = JSON.parse(stored);
    if (new Date(session.expiresAt) <= new Date()) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function clearAdminSession(): void {
  localStorage.removeItem("adminSession");
}

export function getAuthHeaders(): Record<string, string> {
  const session = getAdminSession();
  if (!session) {
    throw new Error("No valid admin session");
  }
  
  return {
    "Authorization": `Bearer ${session.sessionToken}`,
    "Content-Type": "application/json",
  };
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session !== null && new Date(session.expiresAt) > new Date();
}
