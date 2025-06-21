import API from "../axiosInstance";
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const apiRequest = async <T = any>(
  url: string,
  method: Method,
  body?: any
): Promise<T | undefined> => {
  try {
    const config = {
      method,
      url,
      ...(body && { data: body }),
    };
    const response = await API(config);
    return response.data;
  } catch (error: any) {
  console.error(`API Request failed at ${method} ${url}:`, error?.response || error?.message || error);
    return undefined;
  }
};