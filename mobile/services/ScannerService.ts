const API_URL = "http://192.168.1.54:3056";

const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    const responseJson = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? responseJson?.data : null,
      error: response.ok ? null : responseJson?.message || 'Erreur réseau'
    };
  } catch (error: any) {
    return {
      ok: false,
      status: null,
      data: null,
      error: error.message || 'Erreur inconnue'
    };
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