import VERIFIER_API from "../verifierAxiosInstance";
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const verifierApiRequest = async <T = any>(
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

    const response = await VERIFIER_API(config);
    return response.data;
  } catch (error: any) {
  console.error(`API Request failed at ${method} ${url}:`, error?.response || error?.message || error);
    return undefined;
  }
};