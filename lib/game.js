import { input } from '@inquirer/prompts';
import { MOVE_REGEX, movePrompt, namePrompt } from './prompts.js';

export class Game {
  constructor () {
    this.player1score = 0;
    this.player2score = 0;
  }

  async init () {
    this.resetGame();

    this.player1name = await input(namePrompt(1));
    this.player2name = await input(namePrompt(2));

    console.log(`Welcome ${this.player1name} and ${this.player2name}! ${this.player1name} you will take X and ${this.player2name} you will take 0. Let's start!`);

    this.inited = true;
  }

  getCurrentPlayerName () {
    return this.currentPlayer === 1 ? this.player1name : this.player2name;
  }

  async playNextMove () {
    if (!this.inited) throw new Error('Game not initialized, please call the game.init() method first.');

    const rowColumn = await input(movePrompt(this.getCurrentPlayerName()));
    const [match] = [...rowColumn.matchAll(MOVE_REGEX)];

    const row = match[1] - 1;
    const column = match[2] - 1;

    if (this.board[row][column] !== null) {
      console.log('This cell is already taken!');
      return true;
    }

    this.board[row][column] = this.currentPlayer === 1 ? 'X' : 'O';

    if (this.hasWon()) {
      console.log(`Congratulations ${this.getCurrentPlayerName()}! You won!`);

      if (this.currentPlayer === 1) {
        this.player1score += 1;
      } else {
        this.player2score += 1;
      }

      console.log(`${this.player1name} score: ${this.player1score}`);
      console.log(`${this.player2name} score: ${this.player2score}`);

      this.resetGame();

      return false;
    }

    if (this.isBoardFull()) {
      console.log("It's a draw!");

      this.resetGame();

      return false;
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;

    return true;
  }

  hasWon () {
    for (let i = 0; i < 3; i++) {
      if (
        // Check rows
        (this.board[i][0] !== null && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) ||
        // Check columns
        (this.board[0][i] !== null && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i])
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      (this.board[0][0] !== null && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) ||
      (this.board[0][2] !== null && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0])
    ) {
      return true;
    }

    return false;
  }

  isBoardFull () {
    return this.board.every((row) => row.every((cell) => cell !== null));
  }

  resetGame () {
    this.currentPlayer = Math.floor(Math.random() * 2 + 1);
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }

  printBoard () {
    console.log(`
        1   2   3
      +---+---+---+
    1 | ${this.board[0][0] ?? ' '} | ${this.board[0][1] ?? ' '} | ${this.board[0][2] ?? ' '} |
      +---+---+---+
    2 | ${this.board[1][0] ?? ' '} | ${this.board[1][1] ?? ' '} | ${this.board[1][2] ?? ' '} |
      +---+---+---+
    3 | ${this.board[2][0] ?? ' '} | ${this.board[2][1] ?? ' '} | ${this.board[2][2] ?? ' '} |
      +---+---+---+
    `);
  }
}
