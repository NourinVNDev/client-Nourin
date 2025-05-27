import ADMIN_API from "../adminAxiosIntance";
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const adminApiRequest = async <T = any>(
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

    const response = await ADMIN_API(config);
    return response.data;
  } catch (error: any) {
  console.error(`API Request failed at ${method} ${url}:`, error?.response || error?.message || error);
    return undefined;
  }
};
