import { useState, useEffect } from "react";
import {
  getUser,
  login,
  logout,
  acceptInvite,
  handleAuthCallback,
  onAuthChange,
  AuthError,
  MissingIdentityError,
} from "@netlify/identity";

// Palette aligned with the dashboard's design tokens.
const C = {
  gold: "#b8922a",
  goldDark: "#8a6a10",
  goldLight: "#f5e6c8",
  ink: "#111827",
  body: "#374151",
  muted: "#6b7280",
  border: "#e8eaed",
  white: "#ffffff",
  bg: "#f4f5f7",
  red: "#ef4444",
  redLight: "#fee2e2",
};

const messageForError = (err) => {
  if (err instanceof MissingIdentityError) {
    return 'Identity is not enabled. Run this site with "netlify dev" or enable Identity in project settings.';
  }
  if (err instanceof AuthError) {
    switch (err.status) {
      case 401:
        return "Invalid email or password.";
      case 403:
        return "This site is invite-only. Ask an administrator for an invitation.";
      case 422:
        return "Please check your email and password and try again.";
      case 404:
        return "No account found for that email.";
      default:
        return err.message;
    }
  }
  return "Something went wrong. Please try again.";
};

// ─── Centered auth screen shell ──────────────────────────
function AuthShell({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: C.white,
          borderRadius: "16px",
          border: `1px solid ${C.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)",
          padding: "36px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "11px",
              background: C.gold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            💧
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: C.ink, lineHeight: 1 }}>{title}</div>
            <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>{subtitle}</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: `1px solid ${C.border}`,
  fontSize: "14px",
  color: C.ink,
  background: C.white,
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
  marginBottom: "12px",
};

const buttonStyle = (disabled) => ({
  width: "100%",
  padding: "11px 16px",
  borderRadius: "8px",
  border: "none",
  background: C.gold,
  color: C.white,
  fontSize: "14px",
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
  fontFamily: "inherit",
});

function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <div
      style={{
        background: C.redLight,
        color: C.red,
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "13px",
        marginBottom: "12px",
      }}
    >
      {children}
    </div>
  );
}

// ─── Auth gate ───────────────────────────────────────────
export default function AuthGate({ children }) {
  // status: "loading" | "login" | "invite" | "authed"
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [inviteToken, setInviteToken] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // On load: process any auth callback (invite/recovery/etc.), then read session.
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const callback = await handleAuthCallback();
        if (!active) return;
        if (callback?.type === "invite" && callback.token) {
          setInviteToken(callback.token);
          setStatus("invite");
          return;
        }
      } catch (err) {
        if (active) setError(messageForError(err));
      }

      const current = await getUser();
      if (!active) return;
      if (current) {
        setUser(current);
        setStatus("authed");
      } else {
        setStatus("login");
      }
    })();

    const unsubscribe = onAuthChange((_event, nextUser) => {
      if (!active) return;
      if (nextUser) {
        setUser(nextUser);
        setStatus("authed");
      } else {
        setUser(null);
        setStatus("login");
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const loggedIn = await login(email.trim(), password);
      setUser(loggedIn);
      setStatus("authed");
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleAcceptInvite = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const accepted = await acceptInvite(inviteToken, password);
      setUser(accepted);
      setStatus("authed");
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // Ignore — onAuthChange / local state reset below still signs the UI out.
    }
    setUser(null);
    setPassword("");
    setStatus("login");
  };

  if (status === "loading") {
    return (
      <AuthShell title="Lipitrex" subtitle="Content Intelligence Platform">
        <div style={{ fontSize: "13px", color: C.muted, textAlign: "center", padding: "8px 0" }}>
          Checking your session…
        </div>
      </AuthShell>
    );
  }

  if (status === "invite") {
    return (
      <AuthShell title="Accept your invitation" subtitle="Set a password to activate your account">
        <form onSubmit={handleAcceptInvite}>
          <ErrorNote>{error}</ErrorNote>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            autoComplete="new-password"
            required
            minLength={8}
            style={fieldStyle}
          />
          <button type="submit" disabled={busy} style={buttonStyle(busy)}>
            {busy ? "Activating…" : "Activate account"}
          </button>
        </form>
      </AuthShell>
    );
  }

  if (status === "login") {
    return (
      <AuthShell title="Sign in" subtitle="Invite-only access · Lipitrex Platform">
        <form onSubmit={handleLogin}>
          <ErrorNote>{error}</ErrorNote>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            style={fieldStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            style={fieldStyle}
          />
          <button type="submit" disabled={busy} style={buttonStyle(busy)}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div style={{ fontSize: "12px", color: C.muted, textAlign: "center", marginTop: "16px", lineHeight: 1.5 }}>
          Access is by invitation only. Contact your administrator if you need an account.
        </div>
      </AuthShell>
    );
  }

  // Authenticated — render the app with a floating sign-out control.
  return (
    <>
      {children}
      <button
        onClick={handleSignOut}
        title={user?.email ? `Signed in as ${user.email}` : "Sign out"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "9px 16px",
          borderRadius: "999px",
          border: `1px solid ${C.border}`,
          background: C.white,
          color: C.body,
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        Sign out
      </button>
    </>
  );
}
