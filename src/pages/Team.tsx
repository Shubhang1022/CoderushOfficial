import React from 'react';
import { Users, Linkedin, Github, Mail, Crown, ShieldCheck } from 'lucide-react';
import { TeamService } from '../services/teamService';

export const Team: React.FC = () => {
  const team = TeamService.getActiveTeam();

  // 1. Top 2 Leaders
  const topLeaders = team.filter((m) => m.is_top_leader).slice(0, 2);
  const remainingTeam = team.filter((m) => !topLeaders.some(top => top.id === m.id));

  // 2. Department & Domain Leads
  const leadMembers = remainingTeam.filter((m) => m.featured || m.role.toLowerCase().includes('lead') || m.role.toLowerCase().includes('coordinator'));
  
  // 3. Core Members
  const coreMembers = remainingTeam.filter((m) => !leadMembers.some(lead => lead.id === m.id));

  // Fallback if no explicit top leaders flagged yet
  const displayTopLeaders = topLeaders.length > 0 ? topLeaders : team.slice(0, 2);
  const displayLeads = topLeaders.length > 0 ? leadMembers : team.slice(2).filter(m => m.featured);
  const displayCore = topLeaders.length > 0 ? coreMembers : team.slice(2).filter(m => !m.featured);

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
          <Users className="w-3.5 h-3.5" />
          ORGANIZING TEAM
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-white">
          Meet the Minds Behind CodeRush
        </h1>
        <p className="text-text-secondary text-sm">
          A dedicated group of student developers, engineers, and faculty mentors powering technical culture at BBDNIIT.
        </p>
      </div>

      {/* Tier 1: Top 2 Community Leaders Spotlight */}
      {displayTopLeaders.length > 0 && (
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Community Leadership
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">Top Community Leads</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {displayTopLeaders.map((member) => (
              <div
                key={member.id}
                className="card-dark rounded-3xl p-8 text-center space-y-5 border border-amber-500/30 bg-gradient-to-b from-[#121927] to-[#0A0E1A] relative group hover:border-amber-400/60 shadow-glow-blue/20 transition-all duration-300"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-brand-cyan p-1 animate-pulse opacity-75" />
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover relative z-10 border-2 border-[#0A0E1A]"
                  />
                  <div className="absolute -bottom-2 right-1 z-20 p-1.5 rounded-full bg-amber-500 text-black shadow-lg">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-brand-cyan transition-colors">
                    {member.name}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-blue/20 text-brand-cyan border border-brand-blue/40">
                    {member.role}
                  </div>
                  <p className="text-xs text-text-muted font-mono">{member.department} • {member.year}</p>
                </div>

                {member.bio && (
                  <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto line-clamp-3">
                    {member.bio}
                  </p>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="p-2.5 rounded-full bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier 2: Domain & Department Lead Members */}
      {displayLeads.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-heading font-bold text-white text-center">Lead Members & Coordinators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayLeads.map((member) => (
              <div key={member.id} className="card-dark rounded-3xl p-6 text-center space-y-4 border border-white/10 hover:border-brand-blue/40 group">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white/10 group-hover:border-brand-cyan transition-colors"
                />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-cyan transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono font-semibold text-brand-blue">{member.role}</p>
                  <p className="text-[11px] text-text-muted">{member.department} • {member.year}</p>
                </div>

                {member.bio && <p className="text-xs text-text-secondary line-clamp-2">{member.bio}</p>}

                <div className="flex items-center justify-center gap-2 pt-1">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier 3: Core Members */}
      {displayCore.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-heading font-bold text-white text-center">Core Team Members</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {displayCore.map((member) => (
              <div key={member.id} className="card-dark rounded-2xl p-5 text-center space-y-3 border border-white/5 hover:border-white/20 transition-all">
                <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto border border-white/10" />
                <div>
                  <h4 className="font-heading font-bold text-white text-xs sm:text-sm line-clamp-1">{member.name}</h4>
                  <p className="text-[11px] text-brand-cyan font-mono mt-0.5">{member.role}</p>
                  <p className="text-[10px] text-text-muted">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
