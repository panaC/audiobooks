export const tryCatch = (
  handler: (...arg: any[]) => any,
  errorMessage?: string
) => {
  try {
    return handler();
  } catch (e) {
    console.log('TRYCATCH');
    console.log(errorMessage || 'no errorMessage found');
    console.log(e);
    console.log('==============');
  }
};
