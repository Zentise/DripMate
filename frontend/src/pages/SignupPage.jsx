import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, getProfile } from "../api/dripMateAPI";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age_group: "",
    skin_colour: "",
    gender: "Male"
  });
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
      const data = await signup(formData);
      
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl font-bold mb-3">DripMate</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Create your account to get started
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="card slide-up">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', color: '#ff4444' }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Age Group
                </label>
                <select
                  name="age_group"
                  value={formData.age_group}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="">Select...</option>
                  <option value="Teen (under 18)">Teen</option>
                  <option value="Young Adult (18-25)">Young Adult</option>
                  <option value="Adult (26-40)">Adult</option>
                  <option value="Mature (40+)">Mature</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Skin Tone
              </label>
              <select
                name="skin_colour"
                value={formData.skin_colour}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select...</option>
                <option value="Fair/Light">Fair/Light</option>
                <option value="Tan/Medium">Tan/Medium</option>
                <option value="Dark/Deep">Dark/Deep</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold text-black rounded-xl transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
