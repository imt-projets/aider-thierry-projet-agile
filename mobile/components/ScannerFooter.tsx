import React from 'react';
import Button from '@/components/Button';
import { Entypo, Octicons } from '@expo/vector-icons';

interface ScannerFooterProps {
  scanned: boolean;
  scanMode: 'single' | 'multiple';
  onGoBack: () => void;
  onContinue?: () => void;
  onAdd?: () => void;
  onFinish?: () => void;
  isLoading?: boolean;
}

const ScannerFooter: React.FC<ScannerFooterProps> = ({
  scanned,
  scanMode,
  onGoBack,
  onContinue,
  onAdd,
  onFinish,
  isLoading = false,
}) => {
  if (!scanned) {
    return (
      <>
        <Button
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  if (scanMode === 'single' && onContinue) { // Scan d'une salle
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
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  if (scanMode === 'multiple' && onFinish) { // Inventaire d'une salle 
    return (
      <>
        <Button
          title="Récapitulatif"
          onPress={onFinish}
          type="primary"
          icon={<Entypo name="check" size={24} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  if (scanMode === 'single' && onAdd) { // Scan d'un seul objet dans une salle
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
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={24} color="white" />}
          disabled={isLoading}
        />
      </>
    );
  }
  return null;
};

export default ScannerFooter; 