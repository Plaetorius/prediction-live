"use client";

import { PreRegisterForm } from "@/components/pre-register-form";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0B0518] via-[#1a0f2e] to-[#0B0518]">
      {/* Advanced Particle System */}
      <div className="absolute inset-0">
        {/* Floating particles - reduced for mobile */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#FF0052] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Animated background orbs with responsive sizes */}
        <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse scale-150"></div>
        <div className="absolute top-40 right-4 sm:right-20 w-64 sm:w-80 md:w-[500px] h-64 sm:h-80 md:h-[500px] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000 scale-150"></div>
        <div className="absolute bottom-20 left-1/4 w-80 sm:w-96 md:w-[600px] h-80 sm:h-96 md:h-[600px] bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500 scale-150"></div>
        
        {/* Matrix-style grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FF0052%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 animate-pulse"></div>
        
        {/* Energy waves - responsive sizes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-96 sm:w-[600px] md:w-[800px] h-96 sm:h-[600px] md:h-[800px] border border-[#FF0052]/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 w-80 sm:w-[500px] md:w-[600px] h-80 sm:h-[500px] md:h-[600px] border border-[#FF0052]/30 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 sm:w-80 md:w-[400px] h-64 sm:h-80 md:h-[400px] border border-[#FF0052]/40 rounded-full animate-ping delay-2000"></div>
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center">
        {/* Floating Navigation */}
        {/* <nav className="w-full flex justify-center p-6 animate-fade-in">
          <div className="w-full max-w-7xl flex justify-between items-center backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-3xl p-4">
            <div className="flex gap-8 items-center">
            </div>
          </div>
        </nav> */}

        {/* Hero Section with Pre-Registration Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 perspective-1000">
          <div className="text-center max-w-5xl mx-auto transform-gpu animate-fade-in-up">
            <div className="relative mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-[#f5f5f5] leading-none transform-gpu hover:scale-105 transition-transform duration-700">
                PREDICTION
                <span className="block text-[#FF0052] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] bg-clip-text text-transparent animate-pulse">
                  LIVE
                </span>
              </h1>
              {/* Glow effect */}
              <div className="absolute inset-0 text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-[#FF0052]/20 blur-xl -z-10 animate-pulse">
                PREDICTION LIVE
              </div>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#f5f5f5]/90 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of <span className="text-[#FF0052] font-bold">real-time gaming predictions</span>. 
              From drake spawns to epic team fights, predict outcomes and earn rewards as the action unfolds.
            </p>
            
            {/* Pre-Registration Form */}
            <div className="mb-12 sm:mb-16 md:mb-20">
              <PreRegisterForm />
            </div>
          </div>
        </div>

        {/* Immersive Footer */}
        {/* <footer className="w-full border-t border-[#f5f5f5]/20 backdrop-blur-2xl bg-gradient-to-br from-[#f5f5f5]/10 via-[#f5f5f5]/5 to-[#f5f5f5]/10">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[#f5f5f5]/60 text-sm font-semibold">
                © 2024 PredictionLive. All rights reserved.
              </div>
              <div className="flex items-center gap-8 text-[#f5f5f5]/60 text-sm font-semibold">
                <a href="#" className="hover:text-[#FF0052] transition-colors duration-300 hover:scale-110 transform">Privacy</a>
                <a href="#" className="hover:text-[#FF0052] transition-colors duration-300 hover:scale-110 transform">Terms</a>
                <a href="#" className="hover:text-[#FF0052] transition-colors duration-300 hover:scale-110 transform">Support</a>
              </div>
            </div>
          </div>
        </footer> */}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}
