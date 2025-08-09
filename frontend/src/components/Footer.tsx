import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Shield, Clock, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AI Recruiting</h3>
                <p className="text-gray-400">Votre partenaire carrière</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Nous révolutionnons le recrutement grâce à l'intelligence artificielle. 
              Notre mission : connecter les talents exceptionnels aux opportunités qui leur correspondent parfaitement.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">contact@ai-recruiting.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Paris, France</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Lun-Ven 9h-18h</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Nos Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Analyse de CV par IA
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Matching intelligent
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Coaching carrière
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Préparation entretiens
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Suivi personnalisé
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-6 w-6 text-emerald-400" />
              <span className="text-gray-300">Données 100% sécurisées</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-6 w-6 text-emerald-400" />
              <span className="text-gray-300">Réponse sous 24h</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Heart className="h-6 w-6 text-emerald-400" />
              <span className="text-gray-300">Support humain dédié</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 AI Recruiting. Tous droits réservés. Fait avec ❤️ à Paris.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                CGU
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
