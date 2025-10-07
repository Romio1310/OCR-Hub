import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { Camera, Upload, Copy, Download, FileText, Loader, CheckCircle, XCircle, Image as ImageIcon, ArrowDown } from 'lucide-react';
import FeatureSection from './components/FeatureSection';
import HowItWorks from './components/HowItWorks';
import DemoSection from './components/DemoSection';
import Footer from './components/Footer';
import './App.css';

const OCRHub = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Scroll to upload section
  const scrollToUpload = () => {
    const uploadElement = document.getElementById('upload-section');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // File upload handler
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      processImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  // Camera functionality
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
      showNotification('Camera started successfully!');
    } catch (error) {
      console.error('Error accessing camera:', error);
      showNotification('Camera access denied or unavailable', 'error');
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);
      processImage(file);
      stopCamera();
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // Image processing with Tesseract.js
  const processImage = async (file) => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: ({ status, progress: progressValue }) => {
          if (status === 'recognizing text') {
            setProgress(Math.round(progressValue * 100));
          }
        }
      });

      const text = result.data.text.trim();
      setExtractedText(text);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        fileName: file.name,
        text: text,
        timestamp: new Date().toLocaleString(),
        imageUrl: URL.createObjectURL(file)
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items
      
      showNotification('Text extraction completed successfully!');
    } catch (error) {
      console.error('OCR Error:', error);
      showNotification('Failed to extract text from image', 'error');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Text copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      showNotification('Failed to copy text', 'error');
    }
  };

  // Download text as file
  const downloadText = (text, fileName = 'extracted_text.txt') => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Text file downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OCR Hub</h1>
                <p className="text-sm text-gray-500">Image to Text Converter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Camera Capture</h3>
              <button
                onClick={stopCamera}
                className="text-gray-500 hover:text-gray-700"
                data-testid="close-camera-btn"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <video
                ref={videoRef}
                autoPlay
                className="w-full rounded-lg bg-black"
                data-testid="camera-video"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={captureImage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  data-testid="capture-image-btn"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Convert Images to Text
            <span className="block text-blue-200">Instantly & Free</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Extract text from images, receipts, documents, and handwritten notes using our powerful OCR technology. Works on any device, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToUpload}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              data-testid="get-started-btn"
            >
              <Upload className="w-5 h-5" />
              <span>Get Started Free</span>
            </button>
            <button
              onClick={scrollToUpload}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowDown className="w-5 h-5" />
              <span>See How It Works</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <FeatureSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Demo Section */}
      <DemoSection onScrollToUpload={scrollToUpload} />

      {/* Main Upload Section */}
      <div id="upload-section" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Converting Images to Text
            </h2>
            <p className="text-xl text-gray-600">
              Upload your image and get accurate text extraction in seconds
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h3>
                
                {/* Upload Methods */}
                <div className="space-y-4">
                  {/* Drag & Drop Area */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    data-testid="dropzone-area"
                  >
                    <input {...getInputProps()} data-testid="file-input" />
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {isDragActive ? 'Drop image here...' : 'Drag & drop an image'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Or click to browse files (PNG, JPG, PDF supported)
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      data-testid="browse-files-btn"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Browse Files</span>
                    </button>
                    
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      data-testid="camera-btn"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Camera</span>
                    </button>
                  </div>
                </div>

                {/* Selected File Preview */}
                {selectedFile && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg" data-testid="file-preview">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    {selectedFile.type.startsWith('image/') && (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="mt-3 max-w-full h-48 object-contain rounded-lg bg-gray-100"
                        data-testid="image-preview"
                      />
                    )}
                  </div>
                )}

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg" data-testid="processing-indicator">
                    <div className="flex items-center space-x-3">
                      <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">Processing Image...</p>
                        <div className="mt-2 bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-blue-700 mt-1">{progress}% Complete</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Extracted Text</h3>
                  {extractedText && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(extractedText)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                        data-testid="copy-text-btn"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => downloadText(extractedText)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                        data-testid="download-text-btn"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px]">
                  {extractedText ? (
                    <div>
                      <textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="w-full h-64 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Extracted text will appear here..."
                        data-testid="extracted-text-area"
                      />
                      <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <span>Characters: {extractedText.length}</span>
                        <span>Words: {extractedText.split(/\s+/).filter(word => word.length > 0).length}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Upload an image to extract text</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* History Section */}
              {history.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Extractions</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto" data-testid="history-list">
                    {history.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.fileName}</p>
                            <p className="text-sm text-gray-500">{item.timestamp}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.text.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="flex space-x-1 ml-3">
                            <button
                              onClick={() => copyToClipboard(item.text)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy"
                              data-testid={`copy-history-${item.id}`}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadText(item.text, `${item.fileName}_text.txt`)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Download"
                              data-testid={`download-history-${item.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedFile(file);
            processImage(file);
          }
        }}
        accept="image/*,.pdf"
        className="hidden"
      />
    </div>
  );
};

export default OCRHub;