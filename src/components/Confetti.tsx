import React, { useMemo } from 'react';

interface ParticleData {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'emoji' | 'circle';
  emoji?: string;
  drift: number;
  rotation: number;
}

const COLORS = ['#ff6584', '#ff8fa3', '#ffb7c5', '#9c88ff', '#fbc531', '#4cd137', '#00a8ff', '#e84118'];
const EMOJIS = ['🎉', '🥳', '🥰', '🎈', '✨', '🔥', '💃', '🚀', '😍', '🍭'];
const PARTICLE_COUNT = 60;

function generateParticles(type: string): ParticleData[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const isHeart = type === 'heart' || (type === 'all' && Math.random() > 0.6);
    const isStar = !isHeart && Math.random() > 0.5;
    const isEmoji = !isHeart && !isStar && Math.random() > 0.6;

    let pType: 'heart' | 'circle' | 'star' | 'emoji' = 'circle';
    if (isHeart) pType = 'heart';
    else if (isStar) pType = 'star';
    else if (isEmoji) pType = 'emoji';

    return {
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      size: 10 + Math.random() * 18,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: pType,
      emoji: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
      drift: (Math.random() - 0.5) * 120,
      rotation: (Math.random() - 0.5) * 720,
    };
  });
}

export default function ConfettiEffect({ type = 'all' }: { type?: string }) {
  const particles = useMemo(() => generateParticles(type), [type]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-particle"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            fontSize: `${p.size}px`,
            color: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rotation': `${p.rotation}deg`,
          } as React.CSSProperties}
        >
          {p.type === 'heart' && '❤️'}
          {p.type === 'star' && '✨'}
          {p.type === 'emoji' && p.emoji}
          {p.type === 'circle' && (
            <svg width={p.size} height={p.size} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill={p.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
