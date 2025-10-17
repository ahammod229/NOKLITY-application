import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle sending a password reset email here.
    alert('If an account exists for this email, a password reset link has been sent.');
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Forgot Password</h1>
        <p className="text-center text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" autoComplete="email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-noklity-red focus:border-noklity-red" required />
          </div>
          <button type="submit" className="w-full bg-noklity-red text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors">
            Send Reset Link
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-noklity-red hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;