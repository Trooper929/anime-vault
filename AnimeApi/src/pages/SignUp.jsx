import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerUser({ username, email, password });
      login(res.data.token, res.data.username);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="guild-plaque auth-form-box">
          <h1>Create Account</h1>
          <p className="meta">Join the adventurer guild.</p>

          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rimuru_tempest"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-right auth-right--signup">
        <div className="guild-plaque">
          <h2>Your Vault. Your List.</h2>
          <p className="meta">
            Track what you're watching, what's planned, and what you've
            conquered. Rate anime your way and browse thousands of titles from
            the guild archives.
          </p>
          <ul className="signup-perks">
            <li>★ Personal watchlist</li>
            <li>★ Watching / Planned / Completed status</li>
            <li>★ Rate anime 1–10</li>
            <li>★ Browse top & seasonal anime</li>
            <li>★ Vault statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
