import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { scannerContext } from '@/context/ScannerContext';
import ModalConfirmation from '@/components/ModalConfirmation';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import useScanner from '@/hooks/useScanner';
import { Entypo } from '@expo/vector-icons';
import Item from '@/interfaces/Item';
import {MESSAGE_HEADER_GO_HOME_BODY, MESSAGE_HEADER_GO_HOME_TITLE} from '@/constants/Messages/MessagesModales';

export default function RecapInventoryScreen() {
  const { scannedItems, restartScan, isLoading, mode, setSubmissionMessage, setSubmissionMessageType } = scannerContext();
  const { handleSendInventory, removeScannedItem } = useScanner();
  const router = useRouter();

  const [currentModal, setCurrentModal] = useState('');
  const [itemToRemove, setItemToRemove] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disableConfirm = isLoading || scannedItems.length === 0 || isSubmitting;

  const openModal = (type: string, item?: Item) => {
    if (type === 'CONFIRM_REMOVE' && item) setItemToRemove(item);
    setCurrentModal(type);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (mode === 'inventoryRoom') {
        await handleSendInventory();
      }
    } catch (error) {
      const errorMessage = mode === 'inventoryRoom' 
        ? "Erreur lors de l'envoi de l'inventaire"
        : "Erreur inconnue";
      setSubmissionMessage(errorMessage);
      setSubmissionMessageType('error');
      router.push('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalProps = () => {
    switch (currentModal) {
      case 'CONFIRM_SEND':
        return {
          title: "Terminer l'inventaire ?",
          message: `Vous êtes sur le point de terminer l'inventaire en cours.`,
          onConfirm: handleSubmit
        };
      case 'CONFIRM_CANCEL':
        return {
          title: "Annuler l'inventaire ?",
          message: "Êtes-vous sûr de vouloir supprimer l'inventaire en cours ? Cette action est irréversible.",
          onConfirm: () => {
            restartScan();
            router.push('/');
          }
        };
      case 'CONFIRM_REMOVE':
        return {
          title: "Retirer l'objet ?",
          message: `Vous êtes sur le point de retirer l'objet ${itemToRemove?.name || ''} (#${itemToRemove?.inventoryNumber}) de l'inventaire en cours.`,
          onConfirm: () => {
            if (itemToRemove) {
              removeScannedItem(itemToRemove.inventoryNumber);
              setItemToRemove(null);
            }
          }
        };
      case 'AFTER_HOME_CLICKED':
        return {
          title: MESSAGE_HEADER_GO_HOME_TITLE,
          message: MESSAGE_HEADER_GO_HOME_BODY,
          onConfirm: () => {
            restartScan();
            router.push('/');
          },
          isImportant: true
        };
      default:
        return null;
    }
  };

  const continueScan = () => {
    router.back();
  }
  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={() => openModal('AFTER_HOME_CLICKED')} />

      <View style={styles.content}>
        <Text style={styles.title}>Récapitulatif de l'inventaire</Text>
        <Text style={styles.subtitle}>
          Nombre d'objets scannés : {scannedItems.length}
        </Text>

        {scannedItems.length === 0 && (
          <Text style={styles.errorText}>
            Aucun objet scanné. Veuillez scanner au moins un objet pour valider
            l'inventaire.
          </Text>
        )}

        <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
          {scannedItems.map((item) => (
            <View key={item.inventoryNumber} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemNumber}>#{item.inventoryNumber}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
              </View>
              <View style={styles.removeIconWrapper}>
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => openModal('CONFIRM_REMOVE', item)}
                  activeOpacity={0.7}
                  accessibilityLabel={`Retirer ${item.name}`}
                  disabled={isSubmitting}
                >
                  <Entypo name="cross" size={26} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueScan}
            onPress={continueScan}
            disabled={isLoading || isSubmitting}
          >
            <Text style={styles.continueScanText}>Continuer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              disableConfirm && styles.confirmButtonDisabled,
            ]}
            onPress={() => openModal('CONFIRM_SEND')}
            disabled={disableConfirm}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  styles.confirmButtonText,
                  disableConfirm && styles.confirmButtonTextDisabled,
                ]}
              >
                Terminer
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {(isLoading || isSubmitting) && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            {isSubmitting && (
              <Text style={styles.loaderText}>
                Envoi en cours...
              </Text>
            )}
          </View>
        )}
      </View>

      {currentModal !== '' && (
        <ModalConfirmation
          modalVisible={true}
          setModalVisible={() => setCurrentModal('')}
          title={getModalProps()?.title || ''}
          message={getModalProps()?.message || ''}
          confirmText="Confirmer"
          cancelText="Annuler"
          isImportant={getModalProps()?.isImportant || false}
          onConfirm={() => {
            getModalProps()?.onConfirm?.();
            setCurrentModal('');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  itemsList: {
    flex: 1,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: '#999',
  },
  removeIconWrapper: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    backgroundColor: '#fdeaea',
    borderRadius: 20,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  continueScan: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#bdbdbd',
    opacity: 0.6,
  },
  continueScanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    color: '#eee',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  loaderText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});
