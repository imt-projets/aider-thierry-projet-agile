import React from 'react';
import Button from '@/components/Button';
import { Entypo, Octicons } from '@expo/vector-icons';

interface ScannerFooterProps {
  scanned: boolean;
  scanMode: 'single' | 'multiple';
  onCancel: () => void;
  onContinue?: () => void;
  onAdd?: () => void;
  onFinish?: () => void;
  isLoading?: boolean;
  onManualInput?: () => void;
}

const ScannerFooter: React.FC<ScannerFooterProps> = ({
  scanned,
  scanMode,
  onCancel,
  onContinue,
  onAdd,
  onFinish,
  isLoading = false,
  onManualInput
}) => {
  if (!scanned) {
    return (
      <>
        <Button
          title="Annuler"
          onPress={onCancel}
          type="danger"
          icon={<Entypo name="circle-with-cross" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  if (scanMode === 'single' && onContinue) {
    return (
      <>
        <Button
          title="Continuer"
          onPress={onContinue}
          type="success"
          icon={<Entypo name="arrow-with-circle-right" size={24} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Annuler"
          onPress={onCancel}
          type="danger"
          icon={<Entypo name="circle-with-cross" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  if (scanMode === 'multiple' && onFinish) {
    return (
      <>
        <Button
          title="Terminer"
          onPress={onFinish}
          type="primary"
          icon={<Entypo name="check" size={24} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Annuler"
          onPress={onCancel}
          type="danger"
          icon={<Entypo name="circle-with-cross" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  if (scanMode === 'single' && onAdd) {
    return (
      <>
        <Button
          title="Ajouter"
          onPress={onAdd}
          type="success"
          icon={<Octicons name="diff-added" size={24} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Annuler"
          onPress={onCancel}
          type="danger"
          icon={<Entypo name="circle-with-cross" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  return null;
};

export default ScannerFooter; 