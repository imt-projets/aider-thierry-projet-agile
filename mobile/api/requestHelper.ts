export interface ResponseData {
    ok: boolean;
    status: number;
    statusText: string;
    data: any;
    meta: object;
  }
  
  export class ResponseHelper implements ResponseData {
    ok: boolean;
    status: number;
    statusText: string;
    data: any;
    meta: object;
  
    constructor(ok: boolean, status: number, statusText: string, data: any = null, meta: object = {}) {
      this.ok = ok;
      this.status = status;
      this.statusText = statusText;
      this.data = data;
      this.meta = meta;
    }
  }
  
  const API_URL = "http://10.144.197.140:3000";
  const defaultOptions: RequestInit = { credentials: "include" };
  const defaultResponse = new ResponseHelper(false, 404, "Error");
  
  type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
  
  const buildOptions = (method: RequestMethod, data?: any, customOptions = defaultOptions): RequestInit => {
    const headers = {
      "Content-Type": "application/json",
      ...customOptions.headers,
    };
  
    return {
      ...customOptions,
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
    };
  };
  
  export class RequestHelper {
    static async make(url: string, method: RequestMethod, data?: any, options = defaultOptions) {
      const fullUrl = API_URL + url;
      const requestOptions = buildOptions(method, data, options);
  
      try {
        const response = await fetch(fullUrl, requestOptions);
        const { ok, status, statusText } = response;
        const responseInfo = new ResponseHelper(ok, status, statusText);
  
        if (!ok || status === 204) return responseInfo;
  
        const responseBody = await response.json();
        return { ...responseInfo, ...responseBody };
      } catch (error) {
        console.error("Request error:", error);
        return defaultResponse;
      }
    }
  
    static get(url: string) {
      return this.make(url, "GET");
    }
  
    static post(url: string, data?: any, options?: RequestInit) {
      return this.make(url, "POST", data, options);
    }
  
    static put(url: string, data?: any, options?: RequestInit) {
      return this.make(url, "PUT", data, options);
    }
  
    static delete(url: string, data?: any, options?: RequestInit) {
      return this.make(url, "DELETE", data, options);
    }
  }
  