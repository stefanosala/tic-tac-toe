import { describe, expect, it } from 'vitest';
import { render } from '@inquirer/testing';
import { input } from '@inquirer/prompts';
import { namePrompt, movePrompt } from './prompts';

describe('lib/prompts', () => {
  describe('namePrompt', () => {
    it('should validate a name', async () => {
      const { answer, events, getScreen } = await render(input, namePrompt(1));

      expect(getScreen()).toMatchInlineSnapshot('"? Enter player 1 name"');

      events.type(' ');
      events.keypress('enter');

      await Promise.resolve();

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Enter player 1 name
        > You must provide a valid value"
      `);

      events.keypress('backspace');
      events.type('John');
      events.keypress('enter');

      await expect(answer).resolves.toEqual('John');
    });
  });

  describe('movePrompt', () => {
    const invalidMoves = [' ', 'A a', '1 A', '11 1', ' 1 1 ', '0 0', '1 4'];

    for (const move of invalidMoves) {
      it(`should validate an invalid move (${move})`, async () => {
        const { events, getScreen } = await render(input, movePrompt('John'));

        expect(getScreen()).toMatchInlineSnapshot('"? Player John, enter your move (row column)"');

        events.type(move);
        events.keypress('enter');

        await Promise.resolve();

        expect(getScreen()).toMatch(/You must provide a valid value/);
      });
    }

    const validMoves = ['1 1', '1 3', '3 3', '2 3'];

    for (const move of validMoves) {
      it(`should validate a valid move (${move})`, async () => {
        const { answer, events, getScreen } = await render(input, movePrompt('John'));

        expect(getScreen()).toMatchInlineSnapshot('"? Player John, enter your move (row column)"');

        events.type(move);
        events.keypress('enter');

        await expect(answer).resolves.toEqual(move);
      });
    }
  });
});
