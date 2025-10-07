import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">OCR</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">OCR Hub</h3>
            </div>
            <p className="text-gray-400">
              Free, fast, and accurate image to text conversion
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Romio1310"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            
            <div className="flex items-center space-x-1 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for Welltoodit by Romio1310</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 OCR Hub. Built with React, Tesseract.js, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;