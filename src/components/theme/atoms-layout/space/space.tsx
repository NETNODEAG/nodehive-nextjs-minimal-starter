export type SpaceProps = {
  size: keyof typeof spacingClasses;
};

const spacingClasses = {
  sm: 'py-1 md:py-2',
  md: 'py-2 md:py-4',
  lg: 'py-4 md:py-6',
  xl: 'py-6 md:py-10',
  '2xl': 'py-10 md:py-20',
  '3xl': 'py-20 md:py-40',
} as const;

export default function Space({ size = 'md' }: SpaceProps) {
  return <div className={spacingClasses[size]} />;
}
