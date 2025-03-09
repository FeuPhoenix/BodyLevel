import { SkillCategory } from '../types';

/**
 * Filter skills by category
 * @param skills Array of skills to filter
 * @param category Category to filter by, or 'All' to show all skills
 * @returns Filtered array of skills
 */
export const filterSkillsByCategory = (skills: any[], category: SkillCategory | 'All') => {
  if (category === 'All') {
    return skills;
  }
  
  return skills.filter(skill => skill.category === category);
};

/**
 * Legacy hook for backward compatibility
 * @deprecated Use direct state management in components instead
 */
export const useSkillFilter = () => {
  console.warn('useSkillFilter is deprecated. Use direct state management in components instead.');
  
  return {
    activeCategory: 'All' as SkillCategory | 'All',
    setActiveCategory: () => {},
    filteredSkills: [],
    categories: ['All', 'Push', 'Pull', 'Legs', 'Core']
  };
}; 