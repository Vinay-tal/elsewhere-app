import { Topic, ChallengeType, OfflineCategory } from '@/types';
import { NewsCategory } from '@/types/content';

export interface NatureTone {
  badge: string;
  dot: string;
  accentBorder: string;
  surfaceTint: string;
}

export function getTopicTone(topic: Topic | string): NatureTone {
  switch (topic) {
    case 'Science':
    case 'Nature & Space':
    case 'Health & Focus':
      return {
        badge: 'bg-[#71816B]/12 text-[#4D5A48] border-[#71816B]/25',
        dot: 'bg-[#71816B]',
        accentBorder: 'border-l-[#71816B]',
        surfaceTint: 'bg-[#71816B]/[0.07]',
      };
    case 'Psychology':
    case 'Philosophy':
    case 'Creativity & Design':
      return {
        badge: 'bg-[#C5B99F]/28 text-[#63563D] border-[#C5B99F]/60',
        dot: 'bg-[#9E8B66]',
        accentBorder: 'border-l-[#C5B99F]',
        surfaceTint: 'bg-[#C5B99F]/15',
      };
    case 'History':
    case 'World Affairs':
    case 'Business & Economics':
      return {
        badge: 'bg-[#A67F68]/12 text-[#715241] border-[#A67F68]/25',
        dot: 'bg-[#A67F68]',
        accentBorder: 'border-l-[#A67F68]',
        surfaceTint: 'bg-[#A67F68]/[0.07]',
      };
    case 'Technology & AI':
    case 'Programming':
    default:
      return {
        badge: 'bg-[#647678]/12 text-[#475658] border-[#647678]/25',
        dot: 'bg-[#647678]',
        accentBorder: 'border-l-[#647678]',
        surfaceTint: 'bg-[#647678]/[0.07]',
      };
  }
}

export function getChallengeTone(category: ChallengeType): NatureTone {
  switch (category) {
    case 'logic':
    case 'riddle':
      return {
        badge: 'bg-[#C5B99F]/30 text-[#5C4E34] border-[#C5B99F]/65',
        dot: 'bg-[#8C7A56]',
        accentBorder: 'border-l-[#C5B99F]',
        surfaceTint: 'bg-[#C5B99F]/15',
      };
    case 'code':
    case 'memory':
      return {
        badge: 'bg-[#647678]/12 text-[#455355] border-[#647678]/25',
        dot: 'bg-[#647678]',
        accentBorder: 'border-l-[#647678]',
        surfaceTint: 'bg-[#647678]/[0.07]',
      };
    case 'quiz':
    case 'general':
    default:
      return {
        badge: 'bg-[#71816B]/12 text-[#4D5A48] border-[#71816B]/25',
        dot: 'bg-[#71816B]',
        accentBorder: 'border-l-[#71816B]',
        surfaceTint: 'bg-[#71816B]/[0.07]',
      };
  }
}

export function getOfflineTone(category: OfflineCategory): NatureTone {
  switch (category) {
    case 'Mind':
    case 'Unplug':
      return {
        badge: 'bg-[#71816B]/14 text-[#4B5846] border-[#71816B]/30',
        dot: 'bg-[#71816B]',
        accentBorder: 'border-l-[#71816B]',
        surfaceTint: 'bg-[#71816B]/[0.08]',
      };
    case 'Body':
    case 'Social':
      return {
        badge: 'bg-[#C5B99F]/30 text-[#5F5238] border-[#C5B99F]/65',
        dot: 'bg-[#9E8B66]',
        accentBorder: 'border-l-[#C5B99F]',
        surfaceTint: 'bg-[#C5B99F]/18',
      };
    case 'Create':
    default:
      return {
        badge: 'bg-[#A67F68]/14 text-[#6B4D3C] border-[#A67F68]/30',
        dot: 'bg-[#A67F68]',
        accentBorder: 'border-l-[#A67F68]',
        surfaceTint: 'bg-[#A67F68]/[0.08]',
      };
  }
}

export function getNewsTone(category: NewsCategory | string): NatureTone {
  switch (category) {
    case 'Climate & Nature':
      return {
        badge: 'bg-[#71816B]/12 text-[#4B5846] border-[#71816B]/25',
        dot: 'bg-[#71816B]',
        accentBorder: 'border-l-[#71816B]',
        surfaceTint: 'bg-[#71816B]/[0.07]',
      };
    case 'Economy & Tech':
    case 'Science & Space':
      return {
        badge: 'bg-[#647678]/12 text-[#475658] border-[#647678]/25',
        dot: 'bg-[#647678]',
        accentBorder: 'border-l-[#647678]',
        surfaceTint: 'bg-[#647678]/[0.07]',
      };
    case 'Geopolitics':
    case 'Global Society':
    default:
      return {
        badge: 'bg-[#C5B99F]/28 text-[#5F5238] border-[#C5B99F]/60',
        dot: 'bg-[#8C7A56]',
        accentBorder: 'border-l-[#C5B99F]',
        surfaceTint: 'bg-[#C5B99F]/16',
      };
  }
}
