import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { scannerContext } from "@/context/ScannerContext";
import ModalConfirmation from '@/components/ModalConfirmation';
import Header from '@/components/Header';

export default function RecapInventoryScreen() {
    const { scannedItems, restartScan } = scannerContext();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        restartScan();
        router.push('/scan-room');
    };
    
    return (
        <View style={styles.container}>
            <Header title="IMT'ventaire" />
            
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

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirmer</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ModalConfirmation
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setIsScannerActive={() => {}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
});