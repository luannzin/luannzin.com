export const formatToLocalDate = (date: string) => {
  const [year, month, day] = date.split("-");

  return new Date(Number(year), Number(month) - 1, Number(day));
};
