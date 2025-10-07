import React from 'react';
import { Upload, Cpu, FileText, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "1. Upload Image",
      description: "Drag & drop, browse files, or use camera to capture an image containing text."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "2. AI Processing",
      description: "Our advanced OCR technology analyzes your image and extracts all readable text."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "3. Review Text",
      description: "Edit and review the extracted text in our user-friendly text editor."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "4. Export Results",
      description: "Copy to clipboard or download as a text file for further use."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert images to text in just four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="text-blue-600">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 transform translate-x-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;