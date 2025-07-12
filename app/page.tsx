"use client";

import { DeployButton } from "@/components/deploy-button";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0B0518] via-[#1a0f2e] to-[#0B0518]">
      {/* Advanced Particle System */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
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
        
        {/* Animated background orbs with advanced effects */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse scale-150"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000 scale-150"></div>
        <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500 scale-150"></div>
        
        {/* Matrix-style grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FF0052%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 animate-pulse"></div>
        
        {/* Energy waves */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-[#FF0052]/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-[#FF0052]/30 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-[#FF0052]/40 rounded-full animate-ping delay-2000"></div>
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center">
        {/* Floating Navigation */}
        <nav className="w-full flex justify-center p-6 animate-fade-in">
          <div className="w-full max-w-7xl flex justify-between items-center backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-3xl p-4">
            <div className="flex gap-8 items-center">
              <Link 
                href={"/"} 
                className="text-[#f5f5f5] font-black text-3xl tracking-tight hover:text-[#FF0052] transition-all duration-500 transform hover:scale-110"
              >
                PredictionLive
              </Link>
              <div className="flex items-center gap-4">
                <DeployButton />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AuthButton />
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Hero Section with 3D Effects */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 perspective-1000">
          <div className="text-center max-w-5xl mx-auto transform-gpu animate-fade-in-up">
            <div className="relative mb-8">
              <h1 className="text-7xl md:text-9xl font-black text-[#f5f5f5] leading-none transform-gpu hover:scale-105 transition-transform duration-700">
                PREDICT
                <span className="block text-[#FF0052] bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] bg-clip-text text-transparent animate-pulse">
                  LIVE
                </span>
              </h1>
              {/* Glow effect */}
              <div className="absolute inset-0 text-7xl md:text-9xl font-black text-[#FF0052]/20 blur-xl -z-10 animate-pulse">
                PREDICT LIVE
              </div>
            </div>
            
            <p className="text-2xl md:text-3xl text-[#f5f5f5]/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of <span className="text-[#FF0052] font-bold">real-time gaming predictions</span>. 
              From drake spawns to epic team fights, predict outcomes and earn rewards as the action unfolds.
            </p>
            
            {/* Advanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] rounded-3xl text-[#f5f5f5] font-bold text-xl shadow-2xl hover:shadow-[#FF0052]/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 overflow-hidden">
                <span className="relative z-10">START PREDICTING</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF0052] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </button>
              <button className="px-12 py-6 border-2 border-[#f5f5f5]/30 rounded-3xl text-[#f5f5f5] font-bold text-xl backdrop-blur-xl bg-[#f5f5f5]/10 hover:bg-[#f5f5f5]/20 hover:border-[#FF0052]/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                WATCH DEMO
              </button>
            </div>
          </div>

          {/* Immersive Live Stream Preview */}
          <div className="w-full max-w-7xl mt-20 perspective-1000">
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#f5f5f5]/10 via-[#f5f5f5]/5 to-[#f5f5f5]/10 border border-[#f5f5f5]/20 rounded-3xl p-8 transform-gpu hover:scale-105 transition-all duration-700 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-4 h-4 bg-[#FF0052] rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-[#FF0052] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-[#f5f5f5] font-bold text-xl">LIVE: T1 vs GenG - MSI 2025</span>
                </div>
                <div className="text-[#f5f5f5]/80 text-lg font-semibold">2.4K viewers</div>
              </div>
              
              {/* Advanced Challenge Overlay */}
              <div className="bg-gradient-to-br from-[#FF0052]/30 via-[#ff4d7d]/20 to-[#FF0052]/30 border-2 border-[#FF0052]/50 rounded-3xl p-8 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF0052]/10 to-transparent animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-[#f5f5f5] font-black text-2xl mb-4 flex items-center gap-3">
                    🔥 Drake Spawned! 
                    <div className="w-3 h-3 bg-[#FF0052] rounded-full animate-ping"></div>
                  </div>
                  <div className="text-[#f5f5f5]/90 text-lg mb-6 font-medium">Which team will secure the next drake?</div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <button className="group bg-gradient-to-r from-[#f5f5f5]/20 to-[#f5f5f5]/10 hover:from-[#FF0052]/30 hover:to-[#FF0052]/20 border-2 border-[#f5f5f5]/30 hover:border-[#FF0052]/50 rounded-2xl py-6 px-6 text-[#f5f5f5] font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                      <div className="text-2xl mb-2">T1</div>
                      <div className="text-[#FF0052] text-sm">2.1x Multiplier</div>
                    </button>
                    <button className="group bg-gradient-to-r from-[#f5f5f5]/20 to-[#f5f5f5]/10 hover:from-[#FF0052]/30 hover:to-[#FF0052]/20 border-2 border-[#f5f5f5]/30 hover:border-[#FF0052]/50 rounded-2xl py-6 px-6 text-[#f5f5f5] font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                      <div className="text-2xl mb-2">GenG</div>
                      <div className="text-[#FF0052] text-sm">1.8x Multiplier</div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[#f5f5f5]/80">
                    <span className="text-lg font-semibold">⏱️ 1:23 remaining</span>
                    <span className="text-lg font-semibold">💰 $2.4K total wagered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mt-24">
            {[
              { value: "$847K", label: "Total Wagers", change: "+23.1%", icon: "💰" },
              { value: "12.4K", label: "Active Predictors", change: "+15.7%", icon: "👥" },
              { value: "94.2%", label: "Accuracy Rate", change: "Real-time", icon: "🎯" }
            ].map((stat, index) => (
              <div key={index} className="backdrop-blur-2xl bg-gradient-to-br from-[#f5f5f5]/10 via-[#f5f5f5]/5 to-[#f5f5f5]/10 border border-[#f5f5f5]/20 rounded-3xl p-8 hover:bg-[#f5f5f5]/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-[#FF0052] text-5xl font-black mb-3 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                <div className="text-[#f5f5f5]/80 text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-[#FF0052] text-sm font-bold">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Immersive Features Section */}
        <div className="w-full max-w-8xl px-6 py-32">
          <h2 className="text-6xl font-black text-[#f5f5f5] text-center mb-20 bg-gradient-to-r from-[#f5f5f5] via-[#FF0052] to-[#f5f5f5] bg-clip-text text-transparent">
            CORE FEATURES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Real-Time Events",
                description: "Automatic challenge creation triggered by in-game events via Riot API integration.",
                icon: "⚡"
              },
              {
                title: "Fan Token Rewards",
                description: "Win fan tokens from your favorite teams. Convert losing bets to winning rewards instantly.",
                icon: "🏆"
              },
              {
                title: "Twitch Integration",
                description: "Seamless overlay integration with Twitch streams. Predict without leaving your favorite content.",
                icon: "📺"
              }
            ].map((feature, index) => (
              <div key={index} className="backdrop-blur-2xl bg-gradient-to-br from-[#f5f5f5]/10 via-[#f5f5f5]/5 to-[#f5f5f5]/10 border border-[#f5f5f5]/20 rounded-3xl p-10 hover:bg-[#f5f5f5]/15 transition-all duration-700 transform hover:scale-110 hover:-translate-y-4 group">
                <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-[#f5f5f5] text-2xl font-black mb-6">{feature.title}</h3>
                <p className="text-[#f5f5f5]/80 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Immersive How It Works */}
        <div className="w-full max-w-8xl px-6 py-32">
          <h2 className="text-6xl font-black text-[#f5f5f5] text-center mb-20 bg-gradient-to-r from-[#f5f5f5] via-[#FF0052] to-[#f5f5f5] bg-clip-text text-transparent">
            HOW IT WORKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "1", title: "Event Detection", desc: "Riot API detects in-game events like drake spawns", icon: "🎮" },
              { step: "2", title: "Challenge Created", desc: "30-second challenges appear in Twitch overlay", icon: "⚡" },
              { step: "3", title: "Place Your Bet", desc: "Choose your prediction and wager fan tokens", icon: "💰" },
              { step: "4", title: "Instant Rewards", desc: "Winners receive fan tokens immediately", icon: "🏆" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full flex items-center justify-center mx-auto text-[#f5f5f5] font-black text-3xl group-hover:scale-125 transition-transform duration-500 shadow-2xl">
                    {item.step}
                  </div>
                  <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-[#FF0052] to-[#ff4d7d] rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-[#f5f5f5] text-xl font-black mb-4">{item.title}</h3>
                <p className="text-[#f5f5f5]/70 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Immersive Footer */}
        <footer className="w-full border-t border-[#f5f5f5]/20 backdrop-blur-2xl bg-gradient-to-br from-[#f5f5f5]/10 via-[#f5f5f5]/5 to-[#f5f5f5]/10">
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
        </footer>
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
