import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
      <View style={styles.footer}>
        <Button
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={30} color="white" />}
          disabled={isLoading}
        />
      </View>
    );
  }
  if (scanMode === 'single' && onContinue) { // Scan d'une salle
    return (
      <View style={styles.footer}>
        <Button
          title="Continuer"
          onPress={onContinue}
          type="success"
          icon={<Entypo name="arrow-with-circle-right" size={30} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={30} color="white" />}
          disabled={isLoading}
        />
      </View>
    );
  }
  if (scanMode === 'multiple' && onFinish) { // Inventaire d'une salle 
    return (
      <View style={styles.footer}>
        <Button
          title="Récapitulatif"
          onPress={onFinish}
          type="primary"
          icon={<MaterialCommunityIcons name="clipboard-list-outline" size={30} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={30} color="white" />}
          disabled={isLoading}
        />
      </View>
    );
  }
  if (scanMode === 'single' && onAdd) { // Scan d'un seul objet dans une salle
    return (
      <View style={styles.footer}>
        <Button
          title="Ajouter"
          onPress={onAdd}
          type="success"
          icon={<Octicons name="diff-added" size={30} color="white" />}
          disabled={isLoading}
        />
        <Button
          title="Retour"
          onPress={onGoBack}
          type="danger"
          icon={<Entypo name="arrow-left" size={30} color="white" />}
          disabled={isLoading}
        />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  footer: {
    marginBottom: 24,
  },
});

export default ScannerFooter; 