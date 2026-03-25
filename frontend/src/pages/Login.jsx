import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --lavender-bg-1: #e8e0f5;
    --lavender-bg-2: #d4c8ee;
    --lavender-bg-3: #c4b5e8;
    --purple-dark: #6b4fa0;
    --purple-mid: #8b6fc0;
    --purple-border: #9b84cc;
    --pistachio: #8bbe6a;
    --pistachio-dark: #72a352;
    --pistachio-light: #a8d688;
    --card-bg: #f5f1fc;
    --text-dark: #3d2d6b;
    --text-mid: #7a6a9a;
    --text-light: #a89cc8;
    --input-bg: #faf8ff;
  }

  .login-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 20% 20%, var(--lavender-bg-3) 0%, var(--lavender-bg-2) 35%, var(--lavender-bg-1) 65%, #ede8f8 100%);
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139, 111, 192, 0.15) 0%, transparent 70%);
    top: -100px;
    right: -100px;
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(138, 190, 106, 0.12) 0%, transparent 70%);
    bottom: -80px;
    left: -80px;
    pointer-events: none;
  }

  .login-card {
    background: var(--card-bg);
    border: 1.5px solid var(--purple-border);
    border-radius: 24px;
    padding: 48px 44px 44px;
    width: 100%;
    max-width: 500px;
    padding: 50px 60px 60px;
    box-shadow:
      0 4px 24px rgba(107, 79, 160, 0.10),
      0 1px 4px rgba(107, 79, 160, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    position: relative;
    animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardIn {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .brand {
  position: absolute;
  top: 32px;
  left: 40px;
  display: flex;
  flex-direction: column;
}

  .brand-name {
    font-size: 80px;
    font-weight: 600;
    color: var(--text-dark);
    letter-spacing: -0.3px;
  }

  .brand-sub {
  font-size: 23px;
  font-weight: 400;
  color: var(--text-mid);
  letter-spacing: 0.1px;
  margin-top: 2px;
 }

  .brand-green {
  color: var(--pistachio);
 }

  .login-sub {
    font-size: 18px;
    color: var(--text-dark);
    font-weight: 500;
    margin-bottom: 20px;
    line-height: 1.5;
    opacity: 0.75;
  }

  .field {
    margin-bottom: 18px;
  }

  .field label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-mid);
    margin-bottom: 7px;
    letter-spacing: 0.1px;
  }

  .field input {
    width: 100%;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: var(--text-dark);
    background: var(--input-bg);
    border: 1.5px solid var(--purple-border);
    border-radius: 12px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .field input::placeholder {
    color: var(--text-light);
    font-weight: 300;
  }

  .field input:focus {
    border-color: var(--purple-mid);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(139, 111, 192, 0.12);
  }

  .field input.error-input {
    border-color: #e07070;
    box-shadow: 0 0 0 3px rgba(224, 112, 112, 0.1);
  }

  .error-msg {
    margin-top: 6px;
    font-size: 12.5px;
    color: #c05050;
    font-weight: 400;
  }

  .login-btn {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, var(--pistachio) 0%, var(--pistachio-dark) 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    letter-spacing: 0.1px;
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
    box-shadow: 0 2px 12px rgba(114, 163, 82, 0.35);
    position: relative;
    overflow: hidden;
  }

  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    border-radius: 12px;
  }

  .login-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(114, 163, 82, 0.45);
    filter: brightness(1.04);
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(114, 163, 82, 0.3);
  }

  .login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .login-btn.loading {
    color: transparent;
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }


`;

export default function Login() 
{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // If either input is empty, it stops immediately and shows an error.
    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    // Clear old error and start loading
    setError("");
    setLoading(true);
    try {
      //  sends a POST request to backend endpoint (username & pass)
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_code: username, password }),
      });
      // This converts the backend Json response into a JavaScript object.
      const data = await res.json();
      if (!res.ok)     //login fail
      {
        setError(data.detail || "Invalid credentials.");       
      }
       else           //login ok
      {
        // store token in memory for now
        window._authToken = data.access_token;
        sessionStorage.setItem('participant', username);
        sessionStorage.setItem('token', data.access_token);
        window.location.href = '/dashboard';
      }
    } 
    catch   //If request crashes
    {
      setError("Could not connect to server.");
    } 
    finally   //stop loading
    {
      setLoading(false);
    }
  };

  // pressing Enter in either input field will trigger login instead of login button
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{styles}</style>  { /* css styles */ }

        {/* full screen  */}
        <div className="login-root">

                {/* logo */}
                <div className="brand">
                  <span className="brand-name">Lonely<span className="brand-green">Less</span></span>
                  <p className="brand-sub">A Mental Health Monitoring Platform</p>
                </div>

                {/* login box */}
                <div className="login-card">
                       {/* prompt */}
                        <p className="login-sub">Sign in to access your personal dashboard.</p>

                       {/* username field*/}
                        <div className="field">
                          <label>Username</label>
                          <input
                            type="text"
                            placeholder="e.g. pers2001"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={error ? "error-input" : ""}
                            autoComplete="off"
                          />
                        </div>

                        {/* pass field */}
                        <div className="field">
                          <label>Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={error ? "error-input" : ""}
                          />
                          {error && <p className="error-msg">{error}</p>}
                        </div>

                        {/* login button */}
                        <button
                          className={`login-btn${loading ? " loading" : ""}`}
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          {loading && <span className="spinner" />}
                          Login
                        </button>
                </div>
        </div>
    </>
  );
}