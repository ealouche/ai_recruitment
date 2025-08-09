import React from 'react';
import { Briefcase, Sparkles, Users, Award } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Recruiting</h1>
                <p className="text-emerald-100 text-sm">Votre carrière, notre expertise</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#process" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
                Notre processus
              </a>
              <a href="#avantages" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
                Avantages
              </a>
              <a href="#contact" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
                Contact
              </a>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">Plateforme IA de dernière génération</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Trouvez votre
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                opportunité idéale
              </span>
            </h1>
            
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Notre intelligence artificielle analyse votre profil en profondeur pour vous connecter 
              aux meilleures opportunités. Déposez votre CV et laissez la magie opérer ! ✨
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                <div className="text-emerald-100">Candidats accompagnés</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-emerald-100">Taux de satisfaction</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-emerald-100">Entreprises partenaires</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;
