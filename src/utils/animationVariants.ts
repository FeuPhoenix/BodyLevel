// Animation variants for Framer Motion
// These can be reused across components for consistent animations

// Staggered children animation with customizable delay
export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

// Fade up animation for elements
export const fadeUp = {
  hidden: { 
    y: 30, 
    opacity: 0 
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

// Fade in animation with scale
export const fadeInScale = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

// Slide in from left
export const slideInLeft = {
  hidden: { 
    x: -60, 
    opacity: 0 
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

// Slide in from right
export const slideInRight = {
  hidden: { 
    x: 60, 
    opacity: 0 
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

// Pulse animation for attention
export const pulse = {
  hidden: { 
    scale: 1 
  },
  show: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Rotate animation
export const rotate = {
  hidden: { 
    rotate: 0 
  },
  show: {
    rotate: 360,
    transition: {
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// Bounce animation
export const bounce = {
  hidden: { 
    y: 0 
  },
  show: {
    y: [0, -15, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.5
    }
  }
};

// Hover animation for cards
export const cardHover = {
  rest: { 
    scale: 1,
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.1,
      type: "tween",
      ease: "easeOut"
    }
  }
};

// Page transition
export const pageTransition = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// Confetti animation
export const confetti = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: 0
  },
  show: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0.5],
    y: [0, -100, -200],
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
}; 