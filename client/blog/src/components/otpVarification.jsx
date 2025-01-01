import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  useEffect(() => {
    // If the email is not passed as a prop, you can get it from the localStorage or context
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      email = savedEmail;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp;
    const token = localStorage.getItem('token'); // Ensure JWT token is available

    if (!email || !otpValue) {
      toast.error('Email and OTP are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token with the request
        },
        body: JSON.stringify({ email, otp: otpValue }), // Send email along with OTP
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP verified successfully!');
        window.location.href = '/profile'; // Redirect to the profile page or dashboard
      } else {
        toast.error(data.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
        <p className="mt-2 text-center text-gray-600">
          Please check your email for the OTP and enter it below.
        </p>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            Verify OTP
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive an OTP?{' '}
            <button
              onClick={() => toast.info('Feature not implemented yet.')}
              className="text-blue-500 hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
