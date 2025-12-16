import { alphabeticallyByProp } from '../sort.js';

describe('alphabeticallyByProp', () => {
  test('should sort objects by property in ascending order', () => {
    const testData = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }, { name: 'David' }];

    const comparator = alphabeticallyByProp<{ name: string }>('name');
    const sorted = [...testData].sort(comparator);

    expect(sorted.map((item) => item.name)).toEqual(['Alice', 'Bob', 'Charlie', 'David']);
  });

  test('should sort objects by property in descending order when property starts with dash', () => {
    const testData = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }, { name: 'David' }];

    const comparator = alphabeticallyByProp<{ name: string }>('-name');
    const sorted = [...testData].sort(comparator);

    expect(sorted.map((item) => item.name)).toEqual(['David', 'Charlie', 'Bob', 'Alice']);
  });
});
