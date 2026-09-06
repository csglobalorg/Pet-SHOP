import React from 'react';

export type SamsungEmojiKey =
  | 'cat'
  | 'dog'
  | 'paw'
  | 'rabbit'
  | 'bird'
  | 'yarn'
  | 'toilet'
  | 'hospital'
  | 'shirt'
  | 'stethoscope'
  | 'house'
  | 'scissors'
  | 'truck'
  | 'coffee'
  | 'sparkles'
  | 'meat'
  | 'soap'
  | 'tennis'
  | 'pill'
  | 'star'
  | 'cash'
  | 'phone'
  | 'mobile_arrow'
  | 'lightning'
  | 'credit_card'
  | 'shield'
  | 'bulb'
  | 'fish'
  | 'package'
  | 'check'
  | 'warning'
  | 'heart';

export const EMOJI_TO_SAMSUNG_MAP: Record<string, SamsungEmojiKey> = {
  '🐱': 'cat',
  '🐶': 'dog',
  '🐾': 'paw',
  '🐰': 'rabbit',
  '🦜': 'bird',
  '🧶': 'yarn',
  '🚽': 'toilet',
  '🏥': 'hospital',
  '👕': 'shirt',
  '🩺': 'stethoscope',
  '🏡': 'house',
  '✂️': 'scissors',
  '✂': 'scissors',
  '🚚': 'truck',
  '☕': 'coffee',
  '✨': 'sparkles',
  '🥩': 'meat',
  '🧼': 'soap',
  '🎾': 'tennis',
  '💊': 'pill',
  '⭐': 'star',
  '💵': 'cash',
  '📱': 'phone',
  '📲': 'mobile_arrow',
  '⚡': 'lightning',
  '💳': 'credit_card',
  '🛡️': 'shield',
  '🛡': 'shield',
  '💡': 'bulb',
  '🐟': 'fish',
  '📦': 'package',
  '✅': 'check',
  '⚠️': 'warning',
  '⚠': 'warning',
  '❤️': 'heart',
  '❤': 'heart'
};

export interface SamsungEmojiProps {
  emoji?: string;
  name?: SamsungEmojiKey;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
}

const SIZE_CLASSES = {
  xs: 'w-3.5 h-3.5 inline-block align-text-bottom',
  sm: 'w-4 h-4 inline-block align-text-bottom',
  md: 'w-5 h-5 inline-block align-middle',
  lg: 'w-6 h-6 inline-block align-middle',
  xl: 'w-8 h-8 inline-block align-middle'
};

export const SamsungEmoji: React.FC<SamsungEmojiProps> = ({
  emoji,
  name,
  className = '',
  size = 'sm',
  alt
}) => {
  const key: SamsungEmojiKey | undefined = name || (emoji ? EMOJI_TO_SAMSUNG_MAP[emoji] : undefined);

  if (!key) {
    return <span className={className}>{emoji}</span>;
  }

  const baseSize = SIZE_CLASSES[size] || SIZE_CLASSES.sm;
  const computedAlt = alt || emoji || key;

  return (
    <img
      src={`/samsung-emojis/${key}.png`}
      alt={computedAlt}
      loading="lazy"
      draggable={false}
      className={`${baseSize} object-contain select-none shrink-0 ${className}`}
    />
  );
};

/**
 * Utility function to convert any string containing emojis into React elements
 * using the authentic Samsung One UI emoji pack icons.
 */
export function renderWithSamsungEmojis(
  text: string, 
  size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
  extraClassName = ''
): React.ReactNode {
  if (!text) return text;

  // Split string by emoji tokens while preserving them
  const emojiRegex = /(\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)/gu;
  const tokens = text.split(emojiRegex);

  return tokens.map((token, idx) => {
    const matchedKey = EMOJI_TO_SAMSUNG_MAP[token] || EMOJI_TO_SAMSUNG_MAP[token.replace(/\uFE0F|\uFE0E/g, '')];
    if (matchedKey) {
      return (
        <SamsungEmoji 
          key={idx} 
          name={matchedKey} 
          size={size} 
          className={extraClassName} 
          alt={token} 
        />
      );
    }
    return token;
  });
}
