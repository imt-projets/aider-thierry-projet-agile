import { router } from 'expo-router';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Item from "@/interfaces/Item";

interface ScannerContextType {
  scannedItems: Item[];
  setScannedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  roomCode: string | null;
  setRoomCode: (code: string) => void;
  resetRoomCode: () => void;
  isScannerActive: boolean;
  setIsScannerActive: (active: boolean) => void;
  restartScan: () => void;
  resetScannedCodes: () => void;
  mode: 'inventoryRoom' | 'addingObject' | null;
  setMode: (mode: 'inventoryRoom' | 'addingObject' | null) => void;
  isLoading: boolean;
  setIsLoading: (val : boolean) => void;
  error: string | null;
  setError: (err : string | null) => void;
  clearError: () => void;
  setManualError : (err : string | null) => void;
  manualError : string | null;
  submissionMessage: string | null;
  setSubmissionMessage: (msg: string | null) => void;
  submissionMessageType: 'success' | 'error' | null;
  setSubmissionMessageType: (type: 'success' | 'error' | null) => void;
  clearSubmissionMessage: () => void;
}

export const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const ScannerProvider = ({ children }: { children: ReactNode }) => {
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [scannedItems, setScannedItems] = useState<Item[]>([]);
  const [roomCode, setRoomCodeState] = useState<string | null>(null);
  const [mode, setMode] = useState<'inventoryRoom' | 'addingObject' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionMessageType, setSubmissionMessageType] = useState<'success' | 'error' | null>(null);

  const clearError = () => {
    setError(null);
    setManualError(null);
  }

  const clearSubmissionMessage = () => {
    setSubmissionMessage(null);
    setSubmissionMessageType(null);
  }

  const resetScannedCodes = () => setScannedItems([]);
  const setRoomCode = (code: string) => setRoomCodeState(code);
  const resetRoomCode = () => setRoomCodeState(null);

  const restartScan = () => {
    resetRoomCode();
    resetScannedCodes();
    clearError();
  };

  return (
    <ScannerContext.Provider
      value={{
        scannedItems,
        setScannedItems,
        roomCode,
        setRoomCode,
        resetRoomCode,
        isScannerActive,
        setIsScannerActive,
        restartScan,
        resetScannedCodes,
        mode,
        setMode,
        isLoading,
        setIsLoading,
        error,
        setError,
        clearError,
        manualError,
        setManualError,
        submissionMessage,
        setSubmissionMessage,
        submissionMessageType,
        setSubmissionMessageType,
        clearSubmissionMessage
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
};

export const scannerContext = (): ScannerContextType => {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error('useScanner must be used within a ScannerProvider');
  }
  return context;
};