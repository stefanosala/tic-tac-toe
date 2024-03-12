import { describe, beforeEach, it, expect, vi } from 'vitest';
import { input } from '@inquirer/prompts';

import { Game } from './game';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn()
}));

describe('lib/game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
    console.log = vi.fn();
  });

  describe('init', () => {
    it('should initialize the board and players on first game', async () => {
      input.mockResolvedValueOnce('John');
      input.mockResolvedValueOnce('Jane');

      await game.init();

      expect(game.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]);

      expect(game.currentPlayer).toBeGreaterThan(0);
      expect(game.currentPlayer).toBeLessThan(3);

      expect(game.player1name).toBe('John');
      expect(game.player2name).toBe('Jane');
    });
  });

  describe('getCurrentPlayerName', () => {
    it('should return the name of the current player', () => {
      game.player1name = 'John';
      game.player2name = 'Jane';
      game.currentPlayer = 1;

      expect(game.getCurrentPlayerName()).toBe('John');

      game.currentPlayer = 2;

      expect(game.getCurrentPlayerName()).toBe('Jane');
    });
  });

  describe('hasWon', () => {
    const cases = [
      {
        board: [
          ['X', 'X', 'X'],
          [null, null, null],
          [null, null, null]
        ],
        expected: true
      },
      {
        board: [
          ['X', null, null],
          ['X', null, null],
          ['X', null, null]
        ],
        expected: true
      },
      {
        board: [
          ['X', null, null],
          [null, 'X', null],
          [null, null, 'X']
        ],
        expected: true
      },
      {
        board: [
          ['X', null, null],
          [null, 'O', null],
          [null, null, 'X']
        ],
        expected: false
      }
    ];

    cases.forEach(({ board, expected }) => {
      it(`should return ${expected} for board ${JSON.stringify(board)}`, () => {
        game.board = board;
        expect(game.hasWon()).toBe(expected);
      });
    });
  });

  describe('isBoardFull', () => {
    const cases = [
      {
        board: [
          ['X', 'X', 'O'],
          ['O', 'O', 'X'],
          ['X', 'O', 'X']
        ],
        expected: true
      },
      {
        board: [
          ['X', 'X', 'O'],
          ['O', 'O', 'X'],
          ['X', 'O', null]
        ],
        expected: false
      }
    ];

    cases.forEach(({ board, expected }) => {
      it(`should return ${expected} for board ${JSON.stringify(board)}`, () => {
        game.board = board;
        expect(game.isBoardFull()).toBe(expected);
      });
    });
  });

  describe('playNextMove', () => {
    beforeEach(async () => {
      input.mockResolvedValueOnce('John');
      input.mockResolvedValueOnce('Jane');

      await game.init();
    });

    it('should throw an error if game is not inited', async () => {
      game.inited = false;

      try {
        await game.playNextMove();
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toMatch(/Game not initialized/);
      }
    });

    it('should return false if the game is won', async () => {
      game.currentPlayer = 1;
      game.board = [
        ['X', 'X', null],
        [null, 'O', null],
        [null, null, null]
      ];

      input.mockResolvedValueOnce('1 3');

      expect(await game.playNextMove()).toBe(false);
      expect(console.log).toHaveBeenCalledWith('Congratulations John! You won!');
      expect(game.player1score).toBe(1);
      expect(game.player2score).toBe(0);

      expect(game.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]);
    });

    it('should return false if the game is finished', async () => {
      game.currentPlayer = 1;
      game.board = [
        ['X', 'O', null],
        ['O', 'O', 'X'],
        ['O', 'X', 'O']
      ];

      input.mockResolvedValueOnce('1 3');

      expect(await game.playNextMove()).toBe(false);
      expect(console.log).toHaveBeenCalledWith("It's a draw!");
      expect(game.player1score).toBe(0);
      expect(game.player2score).toBe(0);

      expect(game.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]);
    });
  });
});
