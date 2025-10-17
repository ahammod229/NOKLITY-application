import React from 'react';
import { Icon } from '../components/Icon';

const HelpPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Support</h1>
      <p className="text-center text-gray-600 mb-12">
        Have questions or need assistance with your order? Reach out to us through one of the channels below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* WhatsApp Card */}
        <a 
          href="https://wa.me/8801713812668"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg hover:bg-green-50 transition-all duration-300"
        >
          <Icon name="whatsapp" className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">WhatsApp</h2>
          <p className="text-lg text-gray-600 mt-2">+8801713812668</p>
          <p className="mt-4 text-sm text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Chat with us &rarr;</p>
        </a>

        {/* Email Card */}
        <a 
          href="mailto:support@noklity.com"
          className="group flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg hover:bg-blue-50 transition-all duration-300"
        >
          <Icon name="email" className="w-16 h-16 text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Email</h2>
          <p className="text-lg text-gray-600 mt-2">support@noklity.com</p>
           <p className="mt-4 text-sm text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Send us an email &rarr;</p>
        </a>
      </div>
    </div>
  );
};

export default HelpPage;