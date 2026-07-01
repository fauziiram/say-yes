export interface PrankQuestion {
  question: string;
  memeId: string;
  customYesMsg?: string;
}

export interface MemePreset {
  id: string;
  name: string;
  emoji: string;
  gifUrl?: string; // Optional if we fall back to standard animated styles
  title: string;
  description: string;
  bgColor: string;
  animationType: 'cat' | 'heart' | 'star' | 'bear' | 'dino';
}
