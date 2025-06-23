import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { scannerContext } from "@/context/ScannerContext";
import ModalConfirmation from '@/components/ModalConfirmation';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import useScanner from '@/hooks/useScanner';

export default function RecapInventoryScreen() {
    const { scannedItems, restartScan, isLoading, mode } = scannerContext();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCancelVisible, setModalCancelVisible] = useState(false);
    const { handleSendInventory, handleSendObject } = useScanner();

    const handleConfirm = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        restartScan();
        router.push('/');
    };

    const handleContinueScan = () => {
        router.back();
    };
    const goHome = () => {
        restartScan();
        router.push('/');
    };

    const handleModalClosed = async () => {
        if (mode == 'inventoryRoom') {
            handleSendInventory();
        } else {
            handleSendObject();
        }
        router.push('/');
    };
    
    return (
        <View style={layout.container}>
            <Header title="IMT'ventaire" onHomePress={goHome} />
            
            <View style={styles.content}>
                <Text style={styles.title}>Récapitulatif de l'inventaire</Text>
                <Text style={styles.subtitle}>Nombre d'objets scannés : {scannedItems.length}</Text>
                
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                    {scannedItems.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemDescription}>{item.description}</Text>
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemNumber}>#{item.inventoryNumber}</Text>
                                <Text style={styles.itemBrand}>{item.brand}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.continueInventaireButtonContainer}>
                    <TouchableOpacity
                        style={styles.continueInventaireButton}
                        onPress={handleContinueScan}
                        disabled={isLoading}
                    >
                        <Text style={styles.continueInventaireText}>Continuer l'inventaire</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setModalCancelVisible(true)}
                        disabled={isLoading}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.confirmButtonText}>Confirmer</Text>
                        }
                    </TouchableOpacity>
                </View>
                {isLoading && (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                )}
            </View>

            <ModalConfirmation
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title="Confirmer l'envoi de l'inventaire"
                message={`Êtes-vous sûr de vouloir envoyer cet inventaire ?\nNombre d'objets : ${scannedItems.length}`}
                confirmText="Envoyer"
                cancelText="Annuler"
                onConfirm={handleModalClosed}
            />
            <ModalConfirmation
                modalVisible={modalCancelVisible}
                setModalVisible={setModalCancelVisible}
                title="Annuler l'inventaire ?"
                message="Êtes-vous sûr de vouloir supprimer l'inventaire en cours ? Cette action est irréversible."
                confirmText="Oui"
                cancelText="Non"
                onConfirm={handleCancel}
            />
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 32,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F44336',
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
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    continueInventaireButtonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    continueInventaireButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    continueInventaireText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});