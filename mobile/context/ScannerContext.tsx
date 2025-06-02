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
      const roomResponse = await fetch(`http://localhost:3000/structure/room/${roomCode}`);
  
      if (!roomResponse.ok) {
        console.error("Erreur lors de la récupération de la salle.");
        return;
      }
  
      const roomData = await roomResponse.json();
      const roomId = roomData.id;
  
      if (!roomId) {
        console.error("ID de salle non trouvé dans la réponse.");
        return;
      }
  
      const updateResponse = await fetch(`http://localhost:3000/structure/room/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names: scannedCodes, 
        }),
      });
  
      if (!updateResponse.ok) {
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
