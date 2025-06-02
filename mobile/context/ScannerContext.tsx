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
  mode: 'inventoryRoom' | 'addingObject' | null;
  setMode: (mode: 'inventoryRoom' | 'addingObject' | null) => void;
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const ScannerProvider = ({ children }: { children: ReactNode }) => {
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [roomCode, setRoomCodeState] = useState<string | null>(null);
  const [mode, setMode] = useState<'inventoryRoom' | 'addingObject' | null>(null);

  const addScannedCode = (code: string) => {
    setScannedCodes(prev => (prev.includes(code) ? prev : [...prev, code]));
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
        mode,
        setMode
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
