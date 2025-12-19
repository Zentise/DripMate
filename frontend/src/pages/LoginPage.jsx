import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getProfile } from "../api/dripMateAPI";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(formData);
      
      if (data.error) {
        setError(data.error);
      } else {
        // Fetch user profile
        const profile = await getProfile();
        if (profile && !profile.error) {
          localStorage.setItem("user", JSON.stringify(profile));
        }
        navigate("/chat");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl font-bold mb-3">DripMate</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Welcome back! Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card slide-up">
          <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', color: '#ff4444' }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold text-black rounded-xl transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
