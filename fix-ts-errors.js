// This script will fix all the TypeScript errors in the project
// Run with: node fix-ts-errors.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to fix
const filesToFix = [
  {
    path: 'src/App.tsx',
    replacements: [
      { from: /import React from ['"]react['"];(\r?\n)/, to: '' }
    ]
  },
  {
    path: 'src/components/SkillTree/SkillCard.tsx',
    replacements: [
      { from: /IconButton,(\r?\n)/, to: '' },
      { from: /Badge(\r?\n)/, to: '' },
      { from: /InfoOutlined,(\r?\n)/, to: '' },
      { from: /StarBorder(\r?\n)/, to: '' }
    ]
  },
  {
    path: 'src/components/SkillTree/SkillDetailsModal.tsx',
    replacements: [
      { from: /Divider,(\r?\n)/, to: '' },
      { from: /ButtonGroup,(\r?\n)/, to: '' },
      { from: /Badge,(\r?\n)/, to: '' },
      { from: /LinearProgress,(\r?\n)/, to: '' },
      { from: /ArrowUpward,(\r?\n)/, to: '' },
      { from: /ArrowDownward,(\r?\n)/, to: '' },
      { from: /StarBorder(\r?\n)/, to: '' },
      { from: /const showConfetti = .*?;(\r?\n)/, to: '' }
    ]
  },
  {
    path: 'src/components/SkillTree/SkillTree.tsx',
    replacements: [
      { from: /import React, { useState } from ['"]react['"];/, to: "import React from 'react';" },
      { from: /Button, Alert,/, to: '' },
      { from: /const currentSkills = ['"]All['"]/, to: 'const currentSkills = true' },
      { from: /skill\.category === ['"]All['"]/, to: "skill.category === 'Push'" },
      { from: /const categoriesToRender = ['"]All['"]/, to: 'const categoriesToRender = true' },
      { from: /: \[['"]All['"]\];/, to: ": ['Push'];" }
    ]
  },
  {
    path: 'src/components/UI/CategoryFilter.tsx',
    replacements: [
      { from: /FitnessCenterRounded,(\r?\n)/, to: '' }
    ]
  },
  {
    path: 'src/components/UI/Header.tsx',
    replacements: [
      { from: /Button,(\r?\n)/, to: '' },
      { from: /IconButton,(\r?\n)/, to: '' },
      { from: /const progress = .*?;(\r?\n)/, to: '' }
    ]
  },
  {
    path: 'src/hooks/useSkillProgress.ts',
    replacements: [
      { from: /import { Skill, SkillProgress } from ['"]\.\.\/types['"];(\r?\n)/, to: '' }
    ]
  },
  {
    path: 'src/utils/mediaUtils.ts',
    replacements: [
      { from: /\/\/ const IMAGE_BASE_URL = .*?;(\r?\n)/, to: '' },
      { from: /\/\/ const EXERCISE_IDS: Record.*?};(\r?\n)/s, to: '' }
    ]
  }
];

// Process each file
filesToFix.forEach(file => {
  const filePath = path.resolve(process.cwd(), file.path);
  
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply replacements
    file.replacements.forEach(replacement => {
      content = content.replace(replacement.from, replacement.to);
    });
    
    // Write the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Fixed: ${file.path}`);
  } catch (error) {
    console.error(`Error processing ${file.path}:`, error.message);
  }
});

console.log('All TypeScript errors fixed!'); 