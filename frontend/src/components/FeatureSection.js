import React from 'react';
import { Camera, Upload, Copy, Download, FileText, Smartphone, Monitor, Zap } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Multiple Upload Methods",
      description: "Drag & drop, file browse, or camera capture - choose what works best for you."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Processing",
      description: "Powered by Tesseract.js for lightning-fast client-side OCR processing."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Multiple Formats",
      description: "Support for PNG, JPG, JPEG, GIF, BMP, WebP, and PDF files."
    },
    {
      icon: <Copy className="w-6 h-6" />,
      title: "Easy Export",
      description: "Copy to clipboard or download as text file with one click."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Friendly",
      description: "Fully responsive design works perfectly on phones and tablets."
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Desktop Optimized",
      description: "Enhanced experience for desktop users with advanced features."
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful OCR Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extract text from images with our advanced OCR technology. Fast, accurate, and completely free to use.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <div className="text-blue-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;