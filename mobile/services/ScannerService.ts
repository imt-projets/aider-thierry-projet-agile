import { ApiNotFoundError, ApiServerError, ApiTimeoutError } from "@/interfaces/Item/ApiErrors";


const API_URL = "http://10.144.195.110:3056";
const TIMEOUT_DURATION = 2000;

interface ApiResponse<T> {
  ok: boolean;
  status: number | null;
  data: T | null;
  error: string | null;
}

export const apiCall = async <T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erreur HTTP ${response.status}`;

      switch (response.status) {
        case 404:
          throw new ApiNotFoundError(errorMessage);
        case 401:
        case 403:
          throw new ApiServerError("Accès refusé");
        default:
          throw new ApiServerError(errorMessage);
      }
    }

    const responseJson = await response.json();
    return {
      ok: true,
      status: response.status,
      data: responseJson?.data ?? null,
      error: null,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {      
      throw new ApiTimeoutError();
    }

    if (
      error instanceof ApiNotFoundError ||
      error instanceof ApiServerError
    ) {
      throw error;
    }

    throw new ApiServerError(error.message || "Erreur inconnue");
  }
};

export const getItemByInventoryNumber = async (code: string) => {
  return await apiCall(`${API_URL}/item/inventory/${code}`);
};

export const getRoomByCode = async (code: string) => {
  return await apiCall(`${API_URL}/structure/room/${code}`);
};

export const sendInventoryToConfirm = async (inventory: any) => {
  return await apiCall(`${API_URL}/inventoryToConfirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inventory)
  });
};