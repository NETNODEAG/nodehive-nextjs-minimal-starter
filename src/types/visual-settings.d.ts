export type SpacingSize = 'none' | 'small' | 'large' | 'extraLarge';
export type BackgroundColor =
  | 'white'
  | 'gray'
  | 'orange'
  | 'blue'
  | 'green'
  | 'red'
  | 'purple';
export interface VisualSettings {
  topSpacing?: SpacingSize;
  bottomSpacing?: SpacingSize;
  backgroundColor?: BackgroundColor;
  width?: 'full' | 'wide' | 'narrow';
  paddingx?: 'small' | 'none';
}
