import { ResponseHelper } from "./response";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";


type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const defaultOptions : RequestInit = {
    credentials: "include"
}

type ApiResponse = {
    data: unknown;
};

const defaultResponse = new ResponseHelper(false,404,"Error")

const defineOptions = (method: RequestMethod, data? : unknown, options = defaultOptions) : RequestInit => {

    const AllOptions : RequestInit = {
        ...options,
        method,
        headers: {
            "Content-type": 'application/json',
            ...options.headers
        },
    }

    return !data ? AllOptions : {
        ...AllOptions,
        body: JSON.stringify(data)
    }
}

export class RequestHelper {

    static make = async (url : URL | string, method : RequestMethod, data? : unknown, options = defaultOptions) => {
    
        const allOptions = defineOptions(method, data, options);

        try {

            const response = await fetch(API_URL+url,allOptions);
                
            const { ok, status, statusText } = response

            const responseInfo = new ResponseHelper(ok,status,statusText);

            if (!ok || status == 204) return responseInfo

            const responseBody: ApiResponse = await response.json();

            return {
                ...responseInfo,
                ...responseBody
            }
            
        } catch (error) {
            console.error(error);
        }
        
        return defaultResponse;

    }

    static get = async (url : URL | string) => {
        return await this.make(url, "GET")
    }

    static post = async (url : URL | string, data?: unknown, options : RequestInit = defaultOptions) => {
        return await this.make(url, "POST", data, options)
    }

    static delete = async (url : URL | string, data?: unknown, options : RequestInit = defaultOptions) => {
        return await this.make(url, "DELETE", data, options)
    }

    static put = async (url : URL | string, data?: unknown, options : RequestInit = defaultOptions) => {
        return await this.make(url, "PUT", data, options)
    }
}
