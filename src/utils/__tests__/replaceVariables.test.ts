import { replaceVariables } from '../replaceVariables.js';

describe('replaceVariables', () => {
  test('should return the same URL when there are no variables', () => {
    const server = {
      url: 'https://api.example.com',
    };
    expect(replaceVariables(server)).toBe('https://api.example.com');
  });

  test('should replace variables in the URL with their default values', () => {
    const server = {
      url: 'https://api.example.com/{version}/endpoint',
      variables: {
        version: {
          default: 'v1',
        },
      },
    };
    expect(replaceVariables(server)).toBe('https://api.example.com/v1/endpoint');
  });

  test('should replace multiple variables in the URL with their default values', () => {
    const server = {
      url: 'https://api.example.com/{version}/{resource}',
      variables: {
        version: {
          default: 'v1',
        },
        resource: {
          default: 'users',
        },
      },
    };
    expect(replaceVariables(server)).toBe('https://api.example.com/v1/users');
  });

  test('should handle multiple occurrences of the same variable in the URL', () => {
    const server = {
      url: 'https://api.example.com/{version}/endpoint/{version}',
      variables: {
        version: {
          default: 'v1',
        },
      },
    };
    expect(replaceVariables(server)).toBe('https://api.example.com/v1/endpoint/v1');
  });
});
