import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Database, Shield, Zap, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useLanguage();

  const techStack = [
    { title: 'Frontend Framework', desc: 'React.js, Vite scaffolding, React Router DOM, Axios.', icon: Zap },
    { title: 'Styling & Motion', desc: 'Tailwind CSS, Outfit font typography, glassmorphism cards, Framer Motion animations.', icon: Calendar },
    { title: 'Backend Servers', desc: 'Node.js runtime, Express.js MVC routing API, Helmet headers security policies.', icon: Shield },
    { title: 'Database Models', desc: 'MongoDB Atlas instance, Mongoose schemas, relational ObjectId references, $inc atomic counters.', icon: Database },
    { title: 'Socket Syncing', desc: 'Socket.IO client/server bindings to trigger instant seat counters updates upon bookings/cancellations.', icon: RefreshCw },
    { title: 'Responsive Shell', desc: 'Mobile-first layout design structures tailored for screens of all resolutions.', icon: Smartphone },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">About EventPulse</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          EventPulse is a premium university portal built to catalog workshops, fests, hackathons, and sports tournaments.
        </p>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Target Learning Objectives</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            This project serves as a showcase of modern full-stack engineering design patterns. It explores Express MVC REST APIs, Mongoose document references, database counters syncing under concurrent bookings, and instant server push events via Socket.IO.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            By combining light/dark styling systems, multi-language context translation hubs, QR-encoded tickets, and automatic PDF certificate issuance, it delivers a production-grade user experience.
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 h-64 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
            alt="Collab Team"
            className="w-full h-full object-cover opacity-75"
          />
        </div>
      </div>

      {/* Tech Grid */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-bold text-center">Technical Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex gap-4"
              >
                <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 h-fit">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{tech.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{tech.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
