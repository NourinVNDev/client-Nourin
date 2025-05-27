import MANAGER_API from "../managerAxiosInstance";
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const managerApiRequest = async <T = any>(
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

    const response = await MANAGER_API(config);
    return response.data;
  } catch (error: any) {
  console.error(`API Request failed at ${method} ${url}:`, error?.response || error?.message || error);
    return undefined;
  }
};