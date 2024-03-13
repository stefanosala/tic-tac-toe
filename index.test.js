import { describe, expect, it, vi } from 'vitest';
import { input, confirm } from '@inquirer/prompts';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  confirm: vi.fn()
}));

describe('index', () => {
  it('should run the game and get to a winning state', async () => {
    const inputs = [
      'John',
      'Jane',
      '1 1',
      '2 1',
      '2 2',
      '3 1',
      '3 3'
    ];

    for (const value of inputs) {
      input.mockResolvedValueOnce(value);
    }

    const confirms = [
      true,
      false
    ];

    for (const value of confirms) {
      confirm.mockResolvedValueOnce(value);
    }

    let output = '';

    console.log = vi.fn((message) => {
      output += message + '\n';
    });

    await import('./index.js');

    vi.resetAllMocks();

    const expectedOutputs = [
      'Welcome John and Jane!',
      'You won'
    ];

    for (const expected of expectedOutputs) {
      expect(output).toContain(expected);
    }
  });

  it('should run the game and get to a draw state', async () => {
    vi.resetModules();

    const inputs = [
      'Foo',
      'Bar',
      '1 1',
      '2 1',
      '3 1',
      '1 2',
      '1 3',
      '2 2',
      '2 3',
      '3 3',
      '3 2'
    ];

    for (const value of inputs) {
      input.mockResolvedValueOnce(value);
    }

    const confirms = [
      true,
      false
    ];

    for (const value of confirms) {
      confirm.mockResolvedValueOnce(value);
    }

    let output = '';

    console.log = vi.fn((message) => {
      output += message + '\n';
    });

    await import('./index.js');

    const expectedOutputs = [
      'Welcome Foo and Bar!',
      'a draw'
    ];

    for (const expected of expectedOutputs) {
      expect(output).toContain(expected);
    }
  });
});
