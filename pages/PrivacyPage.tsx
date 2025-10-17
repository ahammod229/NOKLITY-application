
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy & Terms</h1>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy Policy</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Your privacy is important to us. It is NOKLITY's policy to respect your privacy regarding any information we may collect from you across our website. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Terms & Conditions</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        By accessing this website, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law.
      </p>
    </div>
  );
};

export default PrivacyPage;
