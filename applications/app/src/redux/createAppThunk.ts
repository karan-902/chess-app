export const throwThunkError = (error: any) => ({
 message: error?.response?.data?.message,
 status: error?.response?.status ?? 500,
 isNetworkError: !error?.response,
});
