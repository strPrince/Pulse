
    import React from 'react';
import Nav from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();
  const socialLinks = [
    {
      icon: 'fab fa-facebook-f', 
      link: 'https://www.facebook.com/your-page',
    },
    {
      icon: 'fab fa-twitter',
      link: 'https://twitter.com/your-page', 
    },
    {
      icon: 'fab fa-instagram',
      link: 'https://www.instagram.com/your-page',
    },
    {
      icon: 'fab fa-linkedin-in',
      link: 'https://www.linkedin.com/company/your-page',
    },
  ];

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-gray-900 to-gray-950 text-white flex flex-col items-center py-12">
      <button
        onClick={() => navigate('/')}
        className="absolute top-24 left-8 py-2 px-4 hover:bg-indigo-700 rounded-md text-white font-medium"
      >
        ←
      </button>
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
      <div className="mt-8 flex space-x-4">
        {socialLinks.map((link, index) => (
          <a key={index} href={link.link} className="text-gray-400 hover:text-white">
            <i className={`${link.icon} text-2xl`}></i>
          </a>
        ))}
      </div>
    </div>
    </>
  );
};

export default ContactUs;    