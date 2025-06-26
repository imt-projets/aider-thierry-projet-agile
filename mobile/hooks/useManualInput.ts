import { scannerContext } from '@/context/ScannerContext';
import { useState } from 'react';

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

  const open = () => { setShow(true); setManualError(''); setCode(''); };
  const close = () => { 
    setShow(false);
    setManualError('');
    setCode('')
   };

  const submit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setManualError('');
    try {
      await onScan(code.trim(), true);
      manualError && setShow(true);
      setCode('');
    } catch (e) {
      setManualError('Code non trouvé ou erreur serveur');
    } finally {
      setLoading(false);
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