import { SkillCategory } from '../types';

// Base URLs for media resources
const IMAGE_BASE_URL = 'https://wger.de/api/v2/exerciseimage/?format=json&limit=20&exercise=';
const VIDEO_BASE_URL = 'https://www.youtube.com/embed/';

// Exercise IDs from wger.de API for different categories
const EXERCISE_IDS: Record<SkillCategory, number[]> = {
  'Push': [97, 83, 163, 168, 167, 172],  // Various push-ups and dips
  'Pull': [109, 129, 181, 105, 106, 107], // Pull-ups and rows
  'Legs': [111, 112, 177, 113, 130, 154], // Squats and lunges
  'Core': [91, 93, 128, 174, 176, 59]     // Planks, crunches, etc.
};

// YouTube video IDs for different exercises
const VIDEO_IDS: Record<SkillCategory, string[]> = {
  'Push': [
    'IODxDxX7oi4', // Wall push-up
    '4dF1DOWzf20', // Incline push-up
    'EgIMk-PZwo0', // Knee push-up
    'IODxDxX7oi4', // Full push-up
    'JREjbX6PEBU', // Diamond push-up
    'AszpgGXVuGU'  // Decline push-up
  ],
  'Pull': [
    'FnWrvQUdOTU', // Wall angel
    'rloXYB8yOYo', // Doorway row
    'TKP0QFrPUi0', // Inverted row
    'eGo4IYlbE5g', // Australian pull-up
    'P9aNHIoOJgw', // Pull-up negative
    'eGo4IYlbE5g'  // Full pull-up
  ],
  'Legs': [
    'aclhrxfidGc', // Assisted squat
    'YaXPRqUwItQ', // Bodyweight squat
    'xqvCmoLULNY', // Split squat
    'eZHi-8oCnzY', // Lunge
    'PWPzvKScJ7Q', // Pistol squat progression
    'vq5-4k_jZ1k'  // Jump squat
  ],
  'Core': [
    'JB2oyawG9KI', // Dead bug
    'ASdvN_XEl_c', // Plank
    'Xyd_fa5zoEU', // Side plank
    '1foQV065_Sk', // Hollow hold
    'pSHjTRCQxIw', // L-sit progression
    'kICxJien7xM'  // Dragon flag progression
  ]
};

// Fallback images in case API fails
const FALLBACK_IMAGES: Record<SkillCategory, string[]> = {
  'Push': [
    'https://www.fitnesseducation.edu.au/wp-content/uploads/2020/10/Wall-Push-Up.jpg',
    'https://cdn.shopify.com/s/files/1/1876/4703/articles/shutterstock_1030850871_1000x.jpg',
    'https://cdn.shopify.com/s/files/1/1876/4703/articles/shutterstock_721744635_1000x.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/push-up-variations.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/diamond-push-up-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/decline-push-up-1024x675.jpg'
  ],
  'Pull': [
    'https://www.spotebi.com/wp-content/uploads/2015/01/wall-angels-exercise-illustration.jpg',
    'https://www.verywellfit.com/thmb/aNPMKuOOJZgupJhxZYHBnVq48fM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Doorwayrow-56a2b5735f9b58b7d0cdf766.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/inverted-row-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/australian-pull-up-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/04/negative-pull-up-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/pull-up-variations-1024x675.jpg'
  ],
  'Legs': [
    'https://www.spotebi.com/wp-content/uploads/2015/04/assisted-squat-exercise-illustration.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/bodyweight-squat-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/split-squat-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/bodyweight-lunge-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/pistol-squat-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/jump-squat-1024x675.jpg'
  ],
  'Core': [
    'https://www.spotebi.com/wp-content/uploads/2015/02/dead-bug-exercise-illustration.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/plank-exercise-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/side-plank-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/hollow-body-hold-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/l-sit-1024x675.jpg',
    'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/dragon-flag-1024x675.jpg'
  ]
};

/**
 * Get an image URL for a specific exercise
 * @param category The exercise category
 * @param level The exercise level (1-based index)
 * @returns A URL to an image for the exercise
 */
export const getExerciseImageUrl = (category: SkillCategory, level: number): string => {
  // Adjust level to 0-based index and ensure it's within bounds
  const index = Math.min(level - 1, FALLBACK_IMAGES[category].length - 1);
  return FALLBACK_IMAGES[category][index];
};

/**
 * Get a video URL for a specific exercise
 * @param category The exercise category
 * @param level The exercise level (1-based index)
 * @returns A URL to a YouTube embed for the exercise
 */
export const getExerciseVideoUrl = (category: SkillCategory, level: number): string => {
  // Adjust level to 0-based index and ensure it's within bounds
  const index = Math.min(level - 1, VIDEO_IDS[category].length - 1);
  return `${VIDEO_BASE_URL}${VIDEO_IDS[category][index]}`;
};

/**
 * Get both image and video URLs for a specific exercise
 * @param category The exercise category
 * @param level The exercise level (1-based index)
 * @returns An object containing image and video URLs
 */
export const getExerciseMedia = (category: SkillCategory, level: number): { imageUrl: string, videoUrl: string } => {
  return {
    imageUrl: getExerciseImageUrl(category, level),
    videoUrl: getExerciseVideoUrl(category, level)
  };
}; 