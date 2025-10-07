import React, { useState } from 'react';
import { PlayCircle, ArrowRight, FileText, Zap, CheckCircle } from 'lucide-react';

const DemoSection = ({ onScrollToUpload }) => {
  const [activeDemo, setActiveDemo] = useState(0);
  
  const demoItems = [
    {
      title: "Receipt Processing",
      description: "Extract text from receipts, invoices, and bills",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      features: ["Item extraction", "Total amounts", "Date recognition"]
    },
    {
      title: "Document Scanning", 
      description: "Convert printed documents to editable text",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
      features: ["Multi-language support", "Format preservation", "High accuracy"]
    },
    {
      title: "Handwritten Notes",
      description: "Digitize handwritten notes and letters",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop", 
      features: ["Handwriting recognition", "Text enhancement", "Easy editing"]
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See OCR Hub in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how our powerful OCR technology can transform your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Selector */}
          <div className="space-y-4">
            {demoItems.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeDemo === index
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => setActiveDemo(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeDemo === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {activeDemo === index ? (
                      <PlayCircle className="w-6 h-6 text-white" />
                    ) : (
                      <FileText className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {demoItems[activeDemo].title}
                </h3>
                <p className="text-blue-100">
                  {demoItems[activeDemo].description}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 mb-6">
                <img
                  src={demoItems[activeDemo].image}
                  alt={demoItems[activeDemo].title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <button
                onClick={onScrollToUpload}
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <Zap className="w-5 h-5" />
                <span>Try It Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;