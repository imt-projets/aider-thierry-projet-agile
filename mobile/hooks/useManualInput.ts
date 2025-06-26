import { scannerContext } from '@/context/ScannerContext';
import { useState, useEffect } from 'react';
import { ApiNotFoundError, ApiServerError, ApiTimeoutError } from '@/interfaces/Item/ApiErrors';
import { ROOM_NOT_FOUND_MESSAGE } from '@/constants/Messages/Errors/ScanErrors';

export interface UseManualInput {
  show: boolean;
  code: string;
  loading: boolean;
  open: () => void;
  close: () => void;
  setCode: (text: string) => void;
  submit: () => Promise<void>;
}

export default function useManualInput(onScan: (code: string, isManual : boolean) => Promise<void>): UseManualInput {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const {manualError, setManualError} = scannerContext();

  const open = () => { 
    setShow(true);
    setManualError(null);
    setCode('');
  };
  const close = () => { 
    setShow(false);
    setManualError(null);
    setCode('')
   };

  const submit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setManualError(null);
    
    try {
      await onScan(code.trim(), true);
      setShow(false);
    } catch (error) {
      let errorMessage = '';     
      if (error instanceof ApiNotFoundError) {
        errorMessage = ROOM_NOT_FOUND_MESSAGE;
      } else if (error instanceof ApiServerError || error instanceof ApiTimeoutError) {
        errorMessage = error.message;
      }
      setManualError(errorMessage);
      setShow(true);
    } finally {
      setLoading(false);
      setCode('');
    }
  };

  return {
    show,
    code,
    loading,
    open,
    close,
    setCode,
    submit,
  };
} 