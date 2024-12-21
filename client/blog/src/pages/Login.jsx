// Login.js
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Form submitted:', formData);
  };


  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // Redirect to backend Google login route
  };

  return (
    <div className="flex items-center justify-center h-screen login-geometric-background">
      <div className="w-full max-w-md p-8 login-particles-background rounded-lg shadow-lg ">
        <h2 className="text-2xl font-bold text-center page-title">Login</h2>
        <form className="mt-6 " onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium font "
            >
              Email
            </label>
            <input
        disabled
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500  bg-gray-300 cursor-not-allowed"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium font "
            >
              Password
            </label>
            <input
            disabled
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-300 cursor-not-allowed"
            />
          </div>
          
          <button
  type="submit"
  disabled
  title="Currently not available"
  className="w-full px-4 py-2 font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
>          Login
          </button>
          <Alert severity="info" sx={{ mt: 2 }}>Only Google login is available for now</Alert>
        </form>
        <div className="my-4 text-center text-gray-600">
          <span className='font'>Or</span>
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
    </div>
  );
};

export default Login;
