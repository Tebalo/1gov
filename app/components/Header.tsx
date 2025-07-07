import React from 'react';
import { GraduationCap, Award, BookOpen, Users } from 'lucide-react';

const TeacherRegistrationHeader = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden rounded-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full opacity-10 translate-x-1/2 translate-y-1/2"></div>
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-sm mx-auto">
          {/* Top Section */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                <GraduationCap className="w-8 h-8 text-blue-100" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              <span className="bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Teacher Registration
              </span>
            </h1>
            <p className="text-sm text-blue-100 font-light">
              Professional Educator Certification Application
            </p>
          </div>
          
          {/* Stats/Features Section */}
          <div className="space-y-3 mb-6">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Award className="w-6 h-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Professional Standards</h3>
                <p className="text-blue-100 text-xs">Maintaining excellence in education</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-green-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Comprehensive Review</h3>
                <p className="text-blue-100 text-xs">Thorough evaluation process</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Users className="w-6 h-6 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Community Impact</h3>
                <p className="text-blue-100 text-xs">Shaping future generations</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Application Portal Active</span>
            </div>
          </div>
          
          {/* Bottom Banner */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-blue-100">
              <div className="h-px bg-blue-300 w-8"></div>
              <span className="text-xs font-medium px-2">Begin Your Teaching Journey</span>
              <div className="h-px bg-blue-300 w-8"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </div>
  );
};

export default TeacherRegistrationHeader;