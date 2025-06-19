const API_URL = "http://10.144.195.110:3056";

const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? data : null,
      error: response.ok ? null : data?.message || 'Erreur réseau'
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

export const updateRoomInventory = async (roomId: string, inventoryNumbers: string[]) => {
  return await apiCall(`${API_URL}/structure/room/${roomId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: inventoryNumbers })
  });
};

export const updateItemRoom = async (inventoryNumber: string, roomId: string) => {
  return await apiCall(`${API_URL}/item/${inventoryNumber}/room`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: roomId })
  });
};