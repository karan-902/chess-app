import { getApiErrorResponse } from "@gopvp/common/src/util/api";
import type { IApiErrorInfo } from "@gopvp/common/src/types/response";

export const throwThunkError = (error: unknown): IApiErrorInfo => {
 const response = getApiErrorResponse(error);
 return {
  ...response?.data,
  message: response?.data?.message,
  status: response?.status ?? 500,
  isNetworkError: !response,
 };
};
