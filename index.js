import { confirm } from '@inquirer/prompts';
import { Game } from './lib/game.js';

const game = new Game();

console.log('Hello! Welcome to my Tic Tac Toe game!');

await game.init();

while (true) {
  if (!await confirm({ message: 'Do you want to start a new game?' })) {
    console.log('Alright, maybe next time! Goodbye!');
    break;
  }

  game.printBoard();

  while (await game.playNextMove()) game.printBoard();
}
