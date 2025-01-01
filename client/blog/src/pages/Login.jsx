import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OtpVerification from '../components/otpVarification';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // Redirect to backend Google login route
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Save the JWT token in cookies or localStorage
        document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;

        toast.success('Login successful! Please verify OTP.');
        setShowOtp(true);
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen login-geometric-background">
        <ToastContainer />
        {!showOtp ? (
          <div className="w-full max-w-md p-8 login-particles-background rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center page-title">Login</h2>
            
            <div className="my-4 text-center text-gray-600">
              <p className="mb-6">Only Google login is available at this time</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full px-4 py-2 text-gray-600 bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        ) : (
          <OtpVerification email={formData.email} />
        )}
      </div>
    </>
  );
};

export default Login;
