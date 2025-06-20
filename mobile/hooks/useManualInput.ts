import { useState } from 'react';

export interface UseManualInput {
  show: boolean;
  code: string;
  error: string;
  loading: boolean;
  open: () => void;
  close: () => void;
  setCode: (text: string) => void;
  submit: () => Promise<void>;
}

export default function useManualInput(onScan: (code: string) => Promise<void>): UseManualInput {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const open = () => { setShow(true); setError(''); setCode(''); };
  const close = () => { setShow(false); setError(''); setCode(''); };

  const submit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onScan(code.trim());
      setShow(false);
      setCode('');
    } catch (e) {
      setError('Code non trouvé ou erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return {
    show,
    code,
    error,
    loading,
    open,
    close,
    setCode,
    submit,
  };
} 