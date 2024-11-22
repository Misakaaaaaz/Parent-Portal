import React, { useState, useEffect,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signin } from './actions/userActions';
import axios from 'axios';
import companyLogo from './company_logo.png';
import './styles/SigninScreenStyle.css';
import emailjs from 'emailjs-com';
const SigninScreen = () => {
  const [view, setView] = useState('login'); // Possible views: 'login', 'signup', 'forgotPassword'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [linkingCode, setLinkingCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirect URL
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading: signinLoading, error: signinError } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    dispatch(signin(username, password));
  };

  const generateRandomPassword = () => {
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: username,
        email,
        password,
        linkingCode, 
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Registration successful!');
        setView('login'); // Change the view to 'login' after successful registration
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Generate a new random password
      const newPassword = generateRandomPassword();

      // Step 2: Update the user's password in the database
      const response = await axios.put('http://localhost:5000/api/users/reset-password', {
        email,
        newPassword,
      });

      if (response.status === 200) {
        // Step 3: Send the new password to the user's email
        const formData = {
          to: email, // This matches your EmailJS template field
          new_password: newPassword, // Add the new password in the email template
        };

        emailjs
          .send('service_doyi8sd', 'template_w02haf9', formData, 'jQfPAnV1GYZ1-K6UC')
          .then(
            () => {
              console.log('SUCCESS!');
              alert('A new password has been sent to your email address.');
            },
            (error) => {
              console.error('FAILED...', error);
              alert('Failed to send the reset email. Please try again.');
            }
          );
      } else {
        alert('Failed to update the password. Please check the email address.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      alert('Error occurred while resetting the password. Please try again.');
    }
  };

  // Function to determine the current title based on the view
  const getTitle = () => {
    switch (view) {
      case 'login':
        return 'Login';
      case 'signup':
        return 'Signup';
      case 'forgotPassword':
        return 'Forgot Password';
      default:
        return 'Login';
    }
  };

  return (
    <div className="signin-screen-container">
      <img src={companyLogo} alt="Company Logo" className="company-logo" />
      <div className="wrapper">
        {view !== 'forgotPassword' && (
          <>
            <div className="title-text">
              <div className={view === 'login' ? "title login" : "title"} onClick={() => setView('login')}>{getTitle()}</div>
              <div className={view === 'signup' ? "title signup" : "title"} onClick={() => setView('signup')}>{getTitle()}</div>
            </div>
            <div className="slide-controls">
              <input type="radio" name="slide" id="login" checked={view === 'login'} onChange={() => setView('login')} />
              <input type="radio" name="slide" id="signup" checked={view === 'signup'} onChange={() => setView('signup')} />
              <label htmlFor="login" className="slide login">Login</label>
              <label htmlFor="signup" className="slide signup">Signup</label>
              <div className="slider-tab" style={{ left: view === 'login' ? '0%' : '50%' }}></div>
            </div>
          </>
        )}
        <div className="form-container">
          <div className="form-inner">
            {view === 'login' && (
              <form onSubmit={handleLoginSubmit} className="login">
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {signinError && <div className="error-message">{signinError}</div>}
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value={signinLoading ? 'Logging in...' : 'Login'} disabled={signinLoading} />
                </div>
                <div className="forgot-password-link">
                  Forgot your password? <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setView('forgotPassword');
                  }}>Click here</a>
                </div>
              </form>
            )}
            {view === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="signup">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Linking code"  
                    required
                    value={linkingCode}
                    onChange={(e) => setLinkingCode(e.target.value)}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value={loading ? 'Registering...' : 'Signup'} disabled={loading} />
                </div>
                <div className="login-link">
                  Already a member? <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setView('login');
                  }}>Login here</a>
                </div>
              </form>
            )}
            {view === 'forgotPassword' && (
              <form ref={form} onSubmit={sendEmail}>
                <h2>Forgot Password?</h2>
                <p>Please enter the email address you'd like your password reset information sent to.</p>
                <div className="field">
                  <input
                    type="email"
                    name="to"
                    placeholder="Enter email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value="Request reset link" />
                </div>
                <div className="login-link">
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setView('login');
                  }}>Back to Login</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninScreen;
