import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  label?: string;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownProps> = ({ targetDate, label, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-xs font-mono text-brand-cyan uppercase tracking-wider">
        Event Session Reached
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-mono text-white">
        {label && <span className="text-text-muted text-[10px] uppercase font-sans mr-1">{label}:</span>}
        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{timeLeft.days}d</span>
        <span>:</span>
        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span>:</span>
        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.minutes).padStart(2, '0')}m</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {label && <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{label}</div>}
      <div className="grid grid-cols-4 gap-2 text-center font-mono">
        <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-xl p-2">
          <div className="text-lg md:text-xl font-bold text-white leading-tight">{timeLeft.days}</div>
          <div className="text-[10px] text-text-muted uppercase font-sans">Days</div>
        </div>
        <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-xl p-2">
          <div className="text-lg md:text-xl font-bold text-white leading-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-text-muted uppercase font-sans">Hours</div>
        </div>
        <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-xl p-2">
          <div className="text-lg md:text-xl font-bold text-white leading-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-text-muted uppercase font-sans">Mins</div>
        </div>
        <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-xl p-2">
          <div className="text-lg md:text-xl font-bold text-brand-cyan leading-tight">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-text-muted uppercase font-sans">Secs</div>
        </div>
      </div>
    </div>
  );
};
