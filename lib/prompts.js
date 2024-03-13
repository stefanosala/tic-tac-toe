export const namePrompt = (playerNumber) => ({
  message: `Enter player ${playerNumber} name`,
  validate: (name) => name.trim().length > 0
});

export const MOVE_REGEX = /^([1-3]) ([1-3])$/g;

export const movePrompt = (playerName) => ({
  message: `Player ${playerName}, enter your move (row column)`,
  validate: (input) => {
    const [match] = [...input.matchAll(MOVE_REGEX)];
    return Array.isArray(match);
  }
});
