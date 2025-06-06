import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from 'expo-router';
import { RequestHelper } from '../api/requestHelper';

type ScannerMode = 'inventoryRoom' | 'addingObject' | null;

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
  handleSendInventory: () => Promise<void>;
  handleSendObject: () => Promise<void>;
  mode: ScannerMode;
  setMode: (mode: ScannerMode) => void;
  scanned : boolean;
  setScanned : (scanned : boolean) => void;
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const ScannerProvider = ({ children }: { children: ReactNode }) => {
  const [scanned, setScanned] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [roomCode, setRoomCodeState] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [mode, setMode] = useState<ScannerMode>(null);

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

  const getRoomId = async (): Promise<string | null> => {
    if (!roomCode) {
      console.error("Code de salle non défini.");
      return null;
    }
    const res = await RequestHelper.get(`/structure/room/${roomCode}`);
    return res?.data?.id || null;
  };

  const handleSendInventory = async () => {
    const roomId = await getRoomId();
    if (!roomId) return;

    const res = await RequestHelper.put(`/structure/room/${roomId}`, {
      ids: scannedCodes,
    });

    if (!res?.ok) {
      console.error("Erreur lors de l’envoi de l’inventaire.");
      return;
    }

    console.log("Inventaire envoyé avec succès !");
    restartScan();
  };

  const handleSendObject = async () => {
    const roomId = await getRoomId();
    if (!roomId || scannedCodes.length === 0) return;

    const res = await RequestHelper.put(`/item/${scannedCodes[0]}/room`, {
      id: roomId,
    });

    if (!res?.ok) {
      console.error("Erreur lors de l’envoi de l’objet.");
      return;
    }

    console.log("Objet ajouté avec succès !");
    restartScan();
    router.push('/');
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
        setMode,
        handleSendInventory,
        handleSendObject,
        scanned,
        setScanned
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
};

export const useScanner = (): ScannerContextType => {
  const context = useContext(ScannerContext);
  if (!context) throw new Error('useScanner must be used within a ScannerProvider');
  return context;
};
