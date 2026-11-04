import { useState } from "react";
import { login } from "../lib/api";
import { saveAuth } from "../lib/auth";

export function LoginForm({
  role,
  onSuccess,
}: {
  role: string;
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await login(username, password);
      if (role !== "any" && user.role !== role) {
        setError(`Este usuario no tiene rol ${role}.`);
        return;
      }
      saveAuth({ token, user });
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="card login__card" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 4 }}>Iniciar sesión</h2>
        <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
          Ingresá tus credenciales de {role === "admin" ? "administrador" : "cocina"}.
        </p>

        <div className="field">
          <label className="label">Usuario</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
        >
          {loading ? "Ingresando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
