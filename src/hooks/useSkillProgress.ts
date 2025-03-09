import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './';
import { updateSkillProgress } from '../features/skills/skillsSlice';

export const useSkillProgress = (skillId: string) => {
  const dispatch = useAppDispatch();
  const skill = useAppSelector(state => 
    state.skills.skills.find(s => s.id === skillId)
  );
  const progress = useAppSelector(state => state.skills.progress[skillId]);
  
  const [sets, setSets] = useState(progress?.currentSets || 0);
  const [reps, setReps] = useState(progress?.currentReps || 0);
  
  // Update local state when progress changes in the store
  useEffect(() => {
    if (progress) {
      setSets(progress.currentSets);
      setReps(progress.currentReps);
    }
  }, [progress]);
  
  const updateProgress = (newSets: number, newReps: number) => {
    setSets(newSets);
    setReps(newReps);
    dispatch(updateSkillProgress({ skillId, sets: newSets, reps: newReps }));
  };
  
  const incrementSets = () => {
    const newSets = Math.min(sets + 1, skill?.requirements.sets || 0);
    updateProgress(newSets, reps);
  };
  
  const decrementSets = () => {
    const newSets = Math.max(sets - 1, 0);
    updateProgress(newSets, reps);
  };
  
  const incrementReps = () => {
    const newReps = Math.min(reps + 1, skill?.requirements.reps || 0);
    updateProgress(sets, newReps);
  };
  
  const decrementReps = () => {
    const newReps = Math.max(reps - 1, 0);
    updateProgress(sets, newReps);
  };
  
  const isCompleted = progress?.completed || false;
  const percentComplete = skill ? 
    Math.round(((sets / skill.requirements.sets) + (reps / skill.requirements.reps)) * 50) : 0;
  
  return {
    skill,
    progress,
    sets,
    reps,
    updateProgress,
    incrementSets,
    decrementSets,
    incrementReps,
    decrementReps,
    isCompleted,
    percentComplete
  };
}; 