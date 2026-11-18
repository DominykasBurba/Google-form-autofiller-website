const normalize = value => value.trim().replace(/\s+/g, ' ').toLowerCase();

export function matchAnswer(input, { options, multiple }) {
  const answer = input.trim();
  if (!answer) return null;
  if (!options) return answer;

  const choices = multiple ? answer.split(',') : [answer];
  const indices = choices.map(choice => {
    const value = normalize(choice);
    return /^\d+$/.test(value)
      ? Number(value) - 1
      : options.findIndex(option => normalize(option) === value);
  });

  return indices.every(index => index >= 0 && index < options.length) ? indices : null;
}
