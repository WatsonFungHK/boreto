export const getDateString =(inputDate?: Date) =>  {
  const result = inputDate ? new Date(inputDate) : new Date();
  return result.toISOString().split('T')[0];
}