/**
 * Reusable Framer Motion animation variants for the enterprise authentication UI.
 */

export const pageTransitions = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const cardRevealVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const featureCardVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  hover: {
    y: -4,
    scale: 1.015,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export const buttonAnimations = {
  hover: {
    scale: 1.015,
    boxShadow: '0 10px 25px -5px rgba(43, 71, 255, 0.3)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.985,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};

export const secondaryButtonAnimations = {
  hover: {
    scale: 1.015,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.985,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};

export const floatingShapeVariants = {
  shape1: {
    animate: {
      y: [0, -25, 0],
      x: [0, 15, 0],
      rotate: [0, 10, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  shape2: {
    animate: {
      y: [0, 30, 0],
      x: [0, -20, 0],
      rotate: [0, -15, 0],
      transition: {
        duration: 11,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  shape3: {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.35, 0.55, 0.35],
      transition: {
        duration: 9,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

export const focusInputVariants = {
  initial: { scale: 1 },
  focus: {
    scale: 1.005,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export const inputErrorVariants = {
  initial: { opacity: 0, y: -6, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -6,
    height: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};
