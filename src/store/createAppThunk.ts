export const createSerializeError = (error: any) => ({
    message:
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong",
    status: error?.response?.status ?? 500,
});
