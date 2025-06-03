import React, { createContext, useContext, useState, ReactNode } from 'react';
interface ScannerContextType {
  scannedCodes: string[];
  roomCode: string | null;
  addScannedCode: (code: string) => void;
  resetScannedCodes: () => void;
  setRoomCode: (code: string) => void;
  resetRoomCode: () => void;
  isScannerActive: boolean;
  setIsScannerActive: (active: boolean) => void;
  restartScan: () => void;
  handleSendInventory: () => void;
}

interface ResponseData {
  ok : boolean,
  status : number,
  statusText : string
  data : null
  meta : object
}

export class ResponseHelper implements ResponseData {
  
  ok: boolean;
  status: number;
  statusText: string;
  data: null;
  meta: object;

  constructor(isOk : boolean, status: number, statusText: string, data = null, meta = {} ){
      this.ok = isOk
      this.status = status
      this.statusText = statusText
      this.data = data
      this.meta = meta
  }
}
const API_URL = "http://10.144.195.110:3000";


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

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const ScannerProvider = ({ children }: { children: ReactNode }) => {
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [roomCode, setRoomCodeState] = useState<string | null>(null);

  const addScannedCode = (code: string) => {
    setScannedCodes(prev => (prev.includes(code) ? prev : [...prev, code]));
    
  };

  const handleSendInventory = async () => {
    try {
      if (!roomCode) {
        console.error("Code de salle non défini.");
        return;
      }
  
      // Utilise RequestHelper.get au lieu de fetch direct
      const roomResponse = await RequestHelper.get(`/structure/room/${roomCode}`);
      const roomId = roomResponse?.data?.id;
  
      if (!roomId) {
        console.error("ID de salle non trouvé dans la réponse.");
        return;
      }
  
      // Utilise RequestHelper.put pour mettre à jour
      const updateResponse = await RequestHelper.put(`/structure/room/${roomId}`, {
        ids: scannedCodes,
      });
  
      if (!updateResponse?.ok) {
        console.error("Erreur lors de la mise à jour de l’inventaire.");
        return;
      }
  
      console.log("Inventaire envoyé avec succès !");
      restartScan();
  
    } catch (error) {
      console.error("Erreur réseau ou interne :", error);
    }
  };
  
  
  

  const resetScannedCodes = () => setScannedCodes([]);
  const setRoomCode = (code: string) => setRoomCodeState(code);
  const resetRoomCode = () => setRoomCodeState(null);
  const restartScan = () => {
    resetRoomCode();
    resetScannedCodes();
  };

  return (
    <ScannerContext.Provider
      value={{
        scannedCodes,
        roomCode,
        addScannedCode,
        resetScannedCodes,
        setRoomCode,
        resetRoomCode,
        isScannerActive,
        setIsScannerActive,
        restartScan,
        handleSendInventory,
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
};

export const useScanner = (): ScannerContextType => {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error('useScanner must be used within a ScannerProvider');
  }
  return context;
};
