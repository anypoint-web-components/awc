export interface IAnimationConfig {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  timing?: number | KeyframeAnimationOptions | undefined;
}

export const DefaultListOpenAnimation: IAnimationConfig[] = [
  {
    keyframes: [
      { 
        opacity: 0,
        transform: 'scale(0.8)',
      },
      { 
        opacity: 1,
        transform: 'scale(1)',
      }
    ],
    timing: { 
      delay: 0, 
      duration: 120, 
      easing: 'cubic-bezier(0, 0, 0.2, 1)', 
      fill: 'both' 
    }
  },
];

export const DefaultListCloseAnimation: IAnimationConfig[] = [
  {
    keyframes: [
      { 
        opacity: 1,
        transform: 'scale(1)',
      },
      { 
        opacity: 0,
        transform: 'scale(0.8)',
      },
    ],
    timing: { 
      delay: 0, 
      duration: 120, 
      easing: 'cubic-bezier(0, 0, 0.2, 1)', 
      fill: 'both' 
    }
  },
];
