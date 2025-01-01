import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Check password requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 201) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="flex items-center justify-center h-screen login-geometric-background">
      <ToastContainer />
      <div className="w-full max-w-md p-8 login-particles-background rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center page-title">Sign Up</h2>
        <div className="mt-6 text-center text-gray-600">
          <p>Only sign up with Google is available at this time</p>
        </div>
        <div className="my-4 text-center text-gray-600">
          <span className="font">Sign up with</span>
        </div>
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="flex items-center justify-center w-full px-4 py-2 text-gray-600 bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Register with Google
        </button>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
