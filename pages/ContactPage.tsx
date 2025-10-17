
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Innovation Drive, Tech City, 54321</p>
          <p className="text-gray-700 mb-2"><strong>Phone:</strong> (123) 456-7890</p>
          <p className="text-gray-700 mb-2"><strong>Email:</strong> support@noklity.com</p>
        </div>
        <div>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <button type="submit" className="w-full bg-noklity-red text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
