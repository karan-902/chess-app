export const throwThunkError = (error: any) => ({
    message:
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong",
    status: error?.response?.status ?? 500,
    isNetworkError: !error?.response,
});
