export interface IAnimationConfig {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  timing?: number | KeyframeAnimationOptions | undefined;
}
