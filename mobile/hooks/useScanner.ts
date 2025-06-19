import { scannerContext } from '@/context/ScannerContext';
import { router } from 'expo-router';
import Item from '@/interfaces/Item';
import {
  getItemByInventoryNumber,
  getRoomByCode,
  updateRoomInventory,
  updateItemRoom
} from '@/services/ScannerService';

export default function useScanner() {
  const {
    scannedItems,
    setScannedItems,
    roomCode,
    setRoomCode,
    resetRoomCode,
    isScannerActive,
    setIsScannerActive,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
    resetScannedCodes,
    restartScan
  } = scannerContext();

  const addScannedCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const itemResponse = await getItemByInventoryNumber(code);
      if (itemResponse.ok && itemResponse.data) {
        const item = itemResponse.data as Item;
        setScannedItems((prev: Item[]) => {
          const exists = prev.some(i => i.id === item.id);
          if (exists) return prev;
          return [...prev, item];
        });
      } else {
        setError(itemResponse.error || 'Item non trouvé');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors du scan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInventory = async () => {
    if (!roomCode) {
      setError('Code de salle non défini');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const roomResponse = await getRoomByCode(roomCode);
      if (!roomResponse.ok || !roomResponse.data?.id) {
        setError(roomResponse.error || 'Salle non trouvée');
        return;
      }
      const inventoryNumbers = scannedItems.map(item => item.inventoryNumber);
      const updateResponse = await updateRoomInventory(roomResponse.data.id, inventoryNumbers);
      if (!updateResponse.ok) {
        setError(updateResponse.error || 'Erreur lors de la mise à jour');
        return;
      }
      restartScan();
      setIsScannerActive(true);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Erreur interne');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendObject = async () => {
    if (!roomCode) {
      setError('Code de salle non défini');
      return;
    }
    if (scannedItems.length === 0) {
      setError('Aucun objet scanné');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const roomResponse = await getRoomByCode(roomCode);
      if (!roomResponse.ok || !roomResponse.data?.id) {
        setError(roomResponse.error || 'Salle non trouvée');
        return;
      }
      const updateResponse = await updateItemRoom(
        scannedItems[0].inventoryNumber,
        roomResponse.data.id
      );
      if (!updateResponse.ok) {
        setError(updateResponse.error || 'Erreur lors de la mise à jour');
        return;
      }
      restartScan();
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Erreur interne');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scannedItems,
    setScannedItems,
    roomCode,
    setRoomCode,
    resetRoomCode,
    isScannerActive,
    setIsScannerActive,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
    resetScannedCodes,
    restartScan,
    addScannedCode,
    handleSendInventory,
    handleSendObject
  };
}
