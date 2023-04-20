export const isNotADate = (input: string) => {
  const timestamp = Date.parse(input);

  return isNaN(timestamp);
};
