import { cycleColorsByLevel } from '../cycleColorsByLevel.js';

describe('fieldColorByLevel', () => {
  it('returns the correct color for a given level', () => {
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

    for (let i = 0; i < levelColors.length; i++) {
      expect(cycleColorsByLevel(i)).toBe(levelColors[i]);
    }

    expect(cycleColorsByLevel(levelColors.length)).toBe(levelColors[0]);
    expect(cycleColorsByLevel(levelColors.length + 1)).toBe(levelColors[1]);
    expect(cycleColorsByLevel(levelColors.length * 2)).toBe(levelColors[0]);
  });
});
