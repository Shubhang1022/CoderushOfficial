import React from 'react';
import { Layers, ShieldCheck, Target, Heart, Award, Cpu, Code2, Users } from 'lucide-react';
import { SettingsService } from '../services/settingsService';

export const About: React.FC = () => {
  const settings = SettingsService.getSettings();

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
          <Layers className="w-3.5 h-3.5" />
          ABOUT CODERUSH
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
          Official Technical Community of BBDNIIT
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Established to represent engineering innovation at Babu Banarasi Das Northern India Institute of Technology, Lucknow.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-dark rounded-3xl p-8 border border-brand-blue/30 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white">Our Mission</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            To provide every student developer with hands-on technical exposure, mentorship, and opportunities to build production-grade software and compete at national hackathons.
          </p>
        </div>

        <div className="card-dark rounded-3xl p-8 border border-brand-cyan/30 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white">Our Vision</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            To make CodeRush one of BBDNIIT's top technical student organizations — recognized alongside Google Developer Groups and Major League Hacking ecosystems.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="text-2xl font-heading font-bold text-white text-center">Community Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl card-dark space-y-3">
            <Cpu className="w-8 h-8 text-brand-blue" />
            <h4 className="font-heading font-bold text-white text-lg">Engineering First</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              We prioritize build quality, code architecture, and practical engineering over superficial theory.
            </p>
          </div>
          <div className="p-6 rounded-2xl card-dark space-y-3">
            <Code2 className="w-8 h-8 text-brand-cyan" />
            <h4 className="font-heading font-bold text-white text-lg">Open Source Culture</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Encouraging students to contribute to public repositories and showcase their portfolios globally.
            </p>
          </div>
          <div className="p-6 rounded-2xl card-dark space-y-3">
            <Users className="w-8 h-8 text-emerald-400" />
            <h4 className="font-heading font-bold text-white text-lg">Peer Mentorship</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Senior lead developers mentoring junior students in full-stack, AI, web3, and DevOps domains.
            </p>
          </div>
          <div className="p-6 rounded-2xl card-dark space-y-3">
            <Award className="w-8 h-8 text-emerald-100" />
            <h4 className="font-heading font-bold text-white text-lg">Hackathons</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              To provide students with a platform to build innovative solutions and compete at national hackathons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
