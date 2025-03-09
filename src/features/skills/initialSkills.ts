import { Skill } from '../../types';
import { getExerciseMedia } from '../../utils/mediaUtils';

export const initialSkills: Skill[] = [
  // Push Category - Level 1
  {
    id: 'push-wall-pushup',
    title: 'Wall Push-Up',
    description: 'A beginner push exercise performed against a wall.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 15,
      description: 'Complete 3 sets of 15 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Push', 1).videoUrl,
    imageUrl: getExerciseMedia('Push', 1).imageUrl,
    formTips: [
      'Keep your body straight from head to heels',
      'Position hands at shoulder height',
      'Lower your chest toward the wall by bending your elbows'
    ],
    level: 1,
    position: { x: 0, y: 0 }
  },
  
  // Additional Push Level 1 exercise
  {
    id: 'push-elevated-pushup',
    title: 'Elevated Push-Up',
    description: 'Push-up with hands on an elevated surface for beginners.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 12,
      description: 'Complete 3 sets of 12 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Push', 1).videoUrl,
    imageUrl: getExerciseMedia('Push', 1).imageUrl,
    formTips: [
      'Place hands on a stable elevated surface',
      'Keep your body in a straight line',
      'Lower your chest toward the surface'
    ],
    level: 1,
    position: { x: 0.5, y: 0 }
  },
  
  // Another Push Level 1 exercise
  {
    id: 'push-box-pushup',
    title: 'Box Push-Up',
    description: 'Push-up performed on knees for beginners.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Push', 1).videoUrl,
    imageUrl: getExerciseMedia('Push', 1).imageUrl,
    formTips: [
      'Start on hands and knees',
      'Keep your back straight',
      'Lower your chest toward the ground'
    ],
    level: 1,
    position: { x: 1, y: 0 }
  },
  
  // Push Category - Level 2
  {
    id: 'push-incline-pushup',
    title: 'Incline Push-Up',
    description: 'Push-up performed with hands elevated on a stable surface.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 12,
      description: 'Complete 3 sets of 12 reps'
    },
    prerequisites: ['push-wall-pushup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Push', 2).videoUrl,
    imageUrl: getExerciseMedia('Push', 2).imageUrl,
    formTips: [
      'Keep your body in a straight line',
      'Lower your chest to the edge of the surface',
      'Push through your palms to return to starting position'
    ],
    level: 2,
    position: { x: 0, y: 1 }
  },
  
  // Push Category - Level 3
  {
    id: 'push-knee-pushup',
    title: 'Knee Push-Up',
    description: 'Push-up performed with knees on the ground for support.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps'
    },
    prerequisites: ['push-incline-pushup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Push', 3).videoUrl,
    imageUrl: getExerciseMedia('Push', 3).imageUrl,
    formTips: [
      'Keep your back straight',
      'Lower your chest to the ground',
      'Keep elbows at a 45-degree angle from your body'
    ],
    level: 3,
    position: { x: 0, y: 2 }
  },
  
  // Push Category - Level 4
  {
    id: 'push-full-pushup',
    title: 'Full Push-Up',
    description: 'Standard push-up with proper form.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 8,
      description: 'Complete 3 sets of 8 reps'
    },
    prerequisites: ['push-knee-pushup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Push', 4).videoUrl,
    imageUrl: getExerciseMedia('Push', 4).imageUrl,
    formTips: [
      'Maintain a straight line from head to heels',
      'Hands should be slightly wider than shoulder-width',
      'Lower until your chest nearly touches the ground'
    ],
    level: 4,
    position: { x: 0, y: 3 }
  },
  
  // Push Category - Level 5
  {
    id: 'push-diamond-pushup',
    title: 'Diamond Push-Up',
    description: 'Push-up with hands close together forming a diamond shape.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 8,
      description: 'Complete 3 sets of 8 reps'
    },
    prerequisites: ['push-full-pushup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Push', 5).videoUrl,
    imageUrl: getExerciseMedia('Push', 5).imageUrl,
    formTips: [
      'Form a diamond shape with your index fingers and thumbs',
      'Keep elbows close to your body',
      'Lower your chest to your hands'
    ],
    level: 5,
    position: { x: 0, y: 4 }
  },
  
  // Push Category - Level 6
  {
    id: 'push-decline-pushup',
    title: 'Decline Push-Up',
    description: 'Push-up with feet elevated for increased difficulty.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 8,
      description: 'Complete 3 sets of 8 reps'
    },
    prerequisites: ['push-full-pushup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Push', 6).videoUrl,
    imageUrl: getExerciseMedia('Push', 6).imageUrl,
    formTips: [
      'Elevate your feet on a stable surface',
      'Maintain a straight line from head to heels',
      'Lower your chest to the ground'
    ],
    level: 6,
    position: { x: 0, y: 5 }
  },
  
  // Pull Category - Level 1
  {
    id: 'pull-wall-angel',
    title: 'Wall Angels',
    description: 'A beginner pulling movement performed against a wall.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 12,
      description: 'Complete 3 sets of 12 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Pull', 1).videoUrl,
    imageUrl: getExerciseMedia('Pull', 1).imageUrl,
    formTips: [
      'Keep your back, head, and arms against the wall',
      'Slide arms up and down while maintaining contact',
      'Keep your lower back pressed against the wall'
    ],
    level: 1,
    position: { x: 1, y: 0 }
  },
  
  // Pull Category - Level 2
  {
    id: 'pull-doorway-row',
    title: 'Doorway Row',
    description: 'Pulling exercise using a doorway for resistance.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps'
    },
    prerequisites: ['pull-wall-angel'],
    status: 'locked',
    videoUrl: getExerciseMedia('Pull', 2).videoUrl,
    imageUrl: getExerciseMedia('Pull', 2).imageUrl,
    formTips: [
      'Stand at an angle to the doorway',
      'Pull your body toward the doorframe',
      'Keep your body straight and core engaged'
    ],
    level: 2,
    position: { x: 1, y: 1 }
  },
  
  // Pull Category - Level 3
  {
    id: 'pull-inverted-row',
    title: 'Inverted Row',
    description: 'Horizontal pulling exercise using a table or bar.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 8,
      description: 'Complete 3 sets of 8 reps'
    },
    prerequisites: ['pull-doorway-row'],
    status: 'locked',
    videoUrl: getExerciseMedia('Pull', 3).videoUrl,
    imageUrl: getExerciseMedia('Pull', 3).imageUrl,
    formTips: [
      'Keep your body straight from head to heels',
      'Pull your chest toward the bar',
      'Lower with control to starting position'
    ],
    level: 3,
    position: { x: 1, y: 2 }
  },
  
  // Pull Category - Level 4
  {
    id: 'pull-australian-pullup',
    title: 'Australian Pull-Up',
    description: 'Horizontal pulling exercise with elevated feet for increased difficulty.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 8,
      description: 'Complete 3 sets of 8 reps'
    },
    prerequisites: ['pull-inverted-row'],
    status: 'locked',
    videoUrl: getExerciseMedia('Pull', 4).videoUrl,
    imageUrl: getExerciseMedia('Pull', 4).imageUrl,
    formTips: [
      'Elevate your feet to increase difficulty',
      'Pull your chest to the bar',
      'Keep your body rigid throughout the movement'
    ],
    level: 4,
    position: { x: 1, y: 3 }
  },
  
  // Pull Category - Level 5
  {
    id: 'pull-negative-pullup',
    title: 'Negative Pull-Up',
    description: 'Lowering yourself slowly from the top of a pull-up position.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 5,
      description: 'Complete 3 sets of 5 slow negatives'
    },
    prerequisites: ['pull-australian-pullup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Pull', 5).videoUrl,
    imageUrl: getExerciseMedia('Pull', 5).imageUrl,
    formTips: [
      'Jump or use a step to reach the top position',
      'Lower yourself as slowly as possible',
      'Aim for a 5-second descent'
    ],
    level: 5,
    position: { x: 1, y: 4 }
  },
  
  // Pull Category - Level 6
  {
    id: 'pull-full-pullup',
    title: 'Full Pull-Up',
    description: 'Complete pull-up from dead hang to chin over the bar.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 3,
      description: 'Complete 3 sets of 3 reps'
    },
    prerequisites: ['pull-negative-pullup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Pull', 6).videoUrl,
    imageUrl: getExerciseMedia('Pull', 6).imageUrl,
    formTips: [
      'Start from a dead hang with arms fully extended',
      'Pull until your chin is over the bar',
      'Lower with control to starting position'
    ],
    level: 6,
    position: { x: 1, y: 5 }
  },
  
  // Legs Category - Level 1
  {
    id: 'legs-assisted-squat',
    title: 'Assisted Squat',
    description: 'Squat performed with support for balance.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 15,
      description: 'Complete 3 sets of 15 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Legs', 1).videoUrl,
    imageUrl: getExerciseMedia('Legs', 1).imageUrl,
    formTips: [
      'Hold onto a stable surface for support',
      'Lower until thighs are parallel to the ground',
      'Keep your weight in your heels'
    ],
    level: 1,
    position: { x: 2, y: 0 }
  },
  
  // Legs Category - Level 2
  {
    id: 'legs-bodyweight-squat',
    title: 'Bodyweight Squat',
    description: 'Standard squat using only bodyweight for resistance.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 15,
      description: 'Complete 3 sets of 15 reps'
    },
    prerequisites: ['legs-assisted-squat'],
    status: 'locked',
    videoUrl: getExerciseMedia('Legs', 2).videoUrl,
    imageUrl: getExerciseMedia('Legs', 2).imageUrl,
    formTips: [
      'Keep feet shoulder-width apart',
      'Maintain a neutral spine',
      'Drive through your heels to stand up'
    ],
    level: 2,
    position: { x: 2, y: 1 }
  },
  
  // Legs Category - Level 3
  {
    id: 'legs-split-squat',
    title: 'Split Squat',
    description: 'Squat performed with one foot in front of the other.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps per leg'
    },
    prerequisites: ['legs-bodyweight-squat'],
    status: 'locked',
    videoUrl: getExerciseMedia('Legs', 3).videoUrl,
    imageUrl: getExerciseMedia('Legs', 3).imageUrl,
    formTips: [
      'Position one foot in front and one behind',
      'Lower until back knee nearly touches the ground',
      'Keep front knee aligned with front foot'
    ],
    level: 3,
    position: { x: 2, y: 2 }
  },
  
  // Legs Category - Level 4
  {
    id: 'legs-lunge',
    title: 'Bodyweight Lunge',
    description: 'Dynamic movement stepping forward into a lunge position.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps per leg'
    },
    prerequisites: ['legs-split-squat'],
    status: 'locked',
    videoUrl: getExerciseMedia('Legs', 4).videoUrl,
    imageUrl: getExerciseMedia('Legs', 4).imageUrl,
    formTips: [
      'Step forward into a lunge position',
      'Lower until back knee nearly touches the ground',
      'Push through front heel to return to starting position'
    ],
    level: 4,
    position: { x: 2, y: 3 }
  },
  
  // Legs Category - Level 5
  {
    id: 'legs-pistol-progression',
    title: 'Pistol Squat Progression',
    description: 'Assisted single-leg squat to build strength for the pistol squat.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 5,
      description: 'Complete 3 sets of 5 reps per leg'
    },
    prerequisites: ['legs-lunge'],
    status: 'locked',
    videoUrl: getExerciseMedia('Legs', 5).videoUrl,
    imageUrl: getExerciseMedia('Legs', 5).imageUrl,
    formTips: [
      'Hold onto a support for balance',
      'Extend one leg forward',
      'Lower as far as possible on the supporting leg'
    ],
    level: 5,
    position: { x: 2, y: 4 }
  },
  
  // Legs Category - Level 6
  {
    id: 'legs-jump-squat',
    title: 'Jump Squat',
    description: 'Explosive squat with a jump at the top of the movement.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps'
    },
    prerequisites: ['legs-bodyweight-squat'],
    status: 'locked',
    videoUrl: getExerciseMedia('Legs', 6).videoUrl,
    imageUrl: getExerciseMedia('Legs', 6).imageUrl,
    formTips: [
      'Lower into a squat position',
      'Jump explosively upward',
      'Land softly with knees slightly bent'
    ],
    level: 6,
    position: { x: 2, y: 5 }
  },
  
  // Core Category - Level 1
  {
    id: 'core-dead-bug',
    title: 'Dead Bug',
    description: 'Core stabilization exercise performed on your back.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps per side'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Core', 1).videoUrl,
    imageUrl: getExerciseMedia('Core', 1).imageUrl,
    formTips: [
      'Press your lower back into the floor',
      'Extend opposite arm and leg simultaneously',
      'Breathe steadily throughout the movement'
    ],
    level: 1,
    position: { x: 3, y: 0 }
  },
  
  // Core Category - Level 2
  {
    id: 'core-plank',
    title: 'Plank',
    description: 'Isometric core exercise that strengthens the abdominals and back.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 30,
      description: 'Hold for 30 seconds, 3 times'
    },
    prerequisites: ['core-dead-bug'],
    status: 'locked',
    videoUrl: getExerciseMedia('Core', 2).videoUrl,
    imageUrl: getExerciseMedia('Core', 2).imageUrl,
    formTips: [
      'Keep your body in a straight line',
      'Engage your core and glutes',
      'Don\'t let your hips sag or pike up'
    ],
    level: 2,
    position: { x: 3, y: 1 }
  },
  
  // Core Category - Level 3
  {
    id: 'core-side-plank',
    title: 'Side Plank',
    description: 'Lateral core exercise that targets the obliques.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 20,
      description: 'Hold for 20 seconds per side, 3 times'
    },
    prerequisites: ['core-plank'],
    status: 'locked',
    videoUrl: getExerciseMedia('Core', 3).videoUrl,
    imageUrl: getExerciseMedia('Core', 3).imageUrl,
    formTips: [
      'Stack your feet or stagger them for balance',
      'Keep your body in a straight line',
      'Reach your top arm toward the ceiling'
    ],
    level: 3,
    position: { x: 3, y: 2 }
  },
  
  // Core Category - Level 4
  {
    id: 'core-hollow-hold',
    title: 'Hollow Body Hold',
    description: 'Advanced core exercise that creates tension throughout the entire body.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 20,
      description: 'Hold for 20 seconds, 3 times'
    },
    prerequisites: ['core-plank'],
    status: 'locked',
    videoUrl: getExerciseMedia('Core', 4).videoUrl,
    imageUrl: getExerciseMedia('Core', 4).imageUrl,
    formTips: [
      'Press your lower back into the floor',
      'Extend arms overhead and legs out straight',
      'Lift shoulders and legs off the ground'
    ],
    level: 4,
    position: { x: 3, y: 3 }
  },
  
  // Core Category - Level 5
  {
    id: 'core-l-sit-progression',
    title: 'L-Sit Progression',
    description: 'Progression toward the full L-sit, a challenging static hold.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Hold for 10 seconds, 3 times'
    },
    prerequisites: ['core-hollow-hold'],
    status: 'locked',
    videoUrl: getExerciseMedia('Core', 5).videoUrl,
    imageUrl: getExerciseMedia('Core', 5).imageUrl,
    formTips: [
      'Support your weight on your hands',
      'Keep your legs straight and together',
      'Lift your legs to form an L shape with your torso'
    ],
    level: 5,
    position: { x: 3, y: 4 }
  },
  
  // Core Category - Level 6
  {
    id: 'core-dragon-flag-progression',
    title: 'Dragon Flag Progression',
    description: 'Progression toward the dragon flag, an advanced core exercise.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 5,
      description: 'Complete 3 sets of 5 reps'
    },
    prerequisites: ['core-hollow-hold'],
    status: 'locked',
    videoUrl: getExerciseMedia('Core', 6).videoUrl,
    imageUrl: getExerciseMedia('Core', 6).imageUrl,
    formTips: [
      'Lie on your back and grip a stable surface behind your head',
      'Raise your legs and lower back off the ground',
      'Lower your body slowly while keeping it straight'
    ],
    level: 6,
    position: { x: 3, y: 5 }
  },
  
  // Add after the existing Push Level 2 exercise
  {
    id: 'push-wide-pushup',
    title: 'Wide Push-Up',
    description: 'Push-up with hands placed wider than shoulder width.',
    category: 'Push',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps'
    },
    prerequisites: ['push-elevated-pushup'],
    status: 'locked',
    videoUrl: getExerciseMedia('Push', 2).videoUrl,
    imageUrl: getExerciseMedia('Push', 2).imageUrl,
    formTips: [
      'Place hands wider than shoulder width',
      'Keep elbows at 45-degree angle',
      'Maintain a straight body line'
    ],
    level: 2,
    position: { x: 0.5, y: 1 }
  },
  
  // Add after the existing Pull Level 1 exercise
  {
    id: 'pull-band-pull-apart',
    title: 'Band Pull Apart',
    description: 'Resistance band exercise for upper back and shoulders.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 15,
      description: 'Complete 3 sets of 15 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Pull', 1).videoUrl,
    imageUrl: getExerciseMedia('Pull', 1).imageUrl,
    formTips: [
      'Hold band with arms extended in front',
      'Pull band apart by squeezing shoulder blades',
      'Control the movement as you return to start'
    ],
    level: 1,
    position: { x: 1.5, y: 0 }
  },
  
  // Add after the existing Pull Level 2 exercise
  {
    id: 'pull-seated-row',
    title: 'Seated Row with Band',
    description: 'Seated rowing exercise using resistance bands.',
    category: 'Pull',
    requirements: {
      sets: 3,
      reps: 12,
      description: 'Complete 3 sets of 12 reps'
    },
    prerequisites: ['pull-wall-angel'],
    status: 'locked',
    videoUrl: getExerciseMedia('Pull', 2).videoUrl,
    imageUrl: getExerciseMedia('Pull', 2).imageUrl,
    formTips: [
      'Sit with legs extended and band around feet',
      'Pull band toward your torso while keeping back straight',
      'Squeeze shoulder blades at the end of the movement'
    ],
    level: 2,
    position: { x: 1.5, y: 1 }
  },
  
  // Add after the existing Legs Level 1 exercise
  {
    id: 'legs-calf-raise',
    title: 'Standing Calf Raise',
    description: 'Exercise targeting the calf muscles.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 20,
      description: 'Complete 3 sets of 20 reps'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Legs', 1).videoUrl,
    imageUrl: getExerciseMedia('Legs', 1).imageUrl,
    formTips: [
      'Stand with feet hip-width apart',
      'Rise up onto the balls of your feet',
      'Lower with control to starting position'
    ],
    level: 1,
    position: { x: 2.5, y: 0 }
  },
  
  // Add after the existing Legs Level 2 exercise
  {
    id: 'legs-glute-bridge',
    title: 'Glute Bridge',
    description: 'Exercise targeting the glutes and hamstrings.',
    category: 'Legs',
    requirements: {
      sets: 3,
      reps: 15,
      description: 'Complete 3 sets of 15 reps'
    },
    prerequisites: ['legs-assisted-squat'],
    status: 'locked',
    videoUrl: getExerciseMedia('Legs', 2).videoUrl,
    imageUrl: getExerciseMedia('Legs', 2).imageUrl,
    formTips: [
      'Lie on your back with knees bent',
      'Push through heels to lift hips toward ceiling',
      'Squeeze glutes at the top of the movement'
    ],
    level: 2,
    position: { x: 2.5, y: 1 }
  },
  
  // Add after the existing Core Level 1 exercise
  {
    id: 'core-bird-dog',
    title: 'Bird Dog',
    description: 'Core stabilization exercise on hands and knees.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 10,
      description: 'Complete 3 sets of 10 reps per side'
    },
    prerequisites: [],
    status: 'unlocked',
    videoUrl: getExerciseMedia('Core', 1).videoUrl,
    imageUrl: getExerciseMedia('Core', 1).imageUrl,
    formTips: [
      'Start on hands and knees',
      'Extend opposite arm and leg simultaneously',
      'Keep your back flat and core engaged'
    ],
    level: 1,
    position: { x: 3.5, y: 0 }
  },
  
  // Add after the existing Core Level 2 exercise
  {
    id: 'core-mountain-climber',
    title: 'Mountain Climber',
    description: 'Dynamic core exercise in plank position.',
    category: 'Core',
    requirements: {
      sets: 3,
      reps: 20,
      description: 'Complete 3 sets of 20 reps per side'
    },
    prerequisites: ['core-dead-bug'],
    status: 'locked',
    videoUrl: getExerciseMedia('Core', 2).videoUrl,
    imageUrl: getExerciseMedia('Core', 2).imageUrl,
    formTips: [
      'Start in a plank position',
      'Alternate bringing knees toward chest',
      'Keep hips stable and core engaged'
    ],
    level: 2,
    position: { x: 3.5, y: 1 }
  }
]; 