export const cycleColorsByLevel = (level?: number) => {
  if (level === undefined) {
    return undefined;
  }

  const levelColors = [
    '#9D00FF',
    '#615CEA',
    '#147DF5',
    '#08BFCC',
    '#08CC7A',
    '#81CC08',
    '#E5BE00',
    '#FF8700',
    '#FF00B8',
  ];

  return levelColors[level % levelColors.length];
};
