import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle user registration here.
    alert('Signup functionality would be handled here!');
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="fullname" autoComplete="name" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-noklity-red focus:border-noklity-red" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" autoComplete="email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-noklity-red focus:border-noklity-red" required />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" autoComplete="new-password" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-noklity-red focus:border-noklity-red" required />
          </div>
          <button type="submit" className="w-full bg-noklity-red text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-noklity-red hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;