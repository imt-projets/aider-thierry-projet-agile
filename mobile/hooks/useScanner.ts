import { scannerContext } from '@/context/ScannerContext';
import { router } from 'expo-router';
import Item from '@/interfaces/Item';
import {
  getItemByInventoryNumber,
  getRoomByCode,
  sendInventoryToConfirm
} from '@/services/ScannerService';

// Méthode qui va grouper les items par type
const groupByType = (items: Item[]) =>
  items.reduce((acc: Record<string, Item[]>, item) => {
    const typeName = item.itemType?.name || 'Inconnu';
    acc[typeName] = acc[typeName] || [];
    acc[typeName].push(item);
    return acc;
  }, {});

/* Créé un mapping pour les inventaires de salles
   Pour chaque type d'objet, nous récupérons les objets ajoutés
   et retirés de la salle ayant ce type - servira pour la vue confirmation
   inventaire
*/
const createMapping = (added: Item[], removed: Item[]) => {
  const groupAdded = groupByType(added);
  const groupRemoved = groupByType(removed);
  const allTypes = Array.from(new Set([...Object.keys(groupAdded), ...Object.keys(groupRemoved)]));

  return allTypes.map(type => ({
    itemType: type,
    itemsList: groupAdded[type]?.map(item => item.inventoryNumber) || [],
    removedItem: groupRemoved[type]?.map(item => item.inventoryNumber) || []
  }));
};

export default function useScanner() {
  const {
    scannedItems,
    setScannedItems,
    roomCode,
    isLoading,
    setIsLoading,
    setError,
    restartScan,
    mode,
    setSubmissionMessage,
    setSubmissionMessageType,
  } = scannerContext();

  const withLoading = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setError('');
    try {
      await fn();
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addScannedCode = (item: Item) => {
    setScannedItems(prev =>
    prev.some(i => i.id === item.id) ? prev : [...prev, item]
    );
  };

  const handleSendInventory = async () => {
    if (!roomCode) {
      const error = 'Code de salle non défini';
      setError(error);
      throw new Error(error);
    }

    await withLoading(async () => {
      const roomRes = await getRoomByCode(roomCode);
      const roomName = roomRes?.data?.name || '';
      const initialItems = roomRes?.data?.items || [];
      const scannedIds = scannedItems.map(item => item.inventoryNumber);

      const removedItems = initialItems.filter(
        (item: Item) => !scannedIds.includes(item.inventoryNumber)
      );

      const payload = {
        type: 'INVENTAIRE_SALLE',
        room: roomRes?.data?.id,
        roomName,
        date: new Date(),
        mapping: createMapping(scannedItems, removedItems)
      };

      const res = await sendInventoryToConfirm(payload);
      if (res.status == 201) {
        // Message de succès selon le mode
        const successMessage = mode === 'inventoryRoom' 
          ? "Inventaire de la salle envoyé avec succès !"
          : "Objet ajouté avec succès !";
        
        setSubmissionMessage(successMessage);
        setSubmissionMessageType('success');
        
        restartScan();
        router.push('/');
      } else {
        throw new Error(res.error || "Erreur lors de l'envoi");
      }
    });
  };

  const handleSendObject = async () => {
    if (!roomCode) {
      const error = 'Code de salle non défini';
      setError(error);
      throw new Error(error);
    }
    if (scannedItems.length === 0) {
      const error = 'Aucun objet scanné';
      setError(error);
      throw new Error(error);
    }

    await withLoading(async () => {
      const roomRes = await getRoomByCode(roomCode);
      const roomName = roomRes?.data?.name || '';

      const payload = {
        type: 'MOVE_ITEM',
        room: scannedItems[0]?.room?.id ?? '-',
        roomName: scannedItems[0]?.room?.name ?? '-',
        date: new Date(),
        mapping: [
          {
            itemType: scannedItems[0]?.itemType.name,
            newRoom: roomRes?.data?.id,
            newRoomName: roomName,
            itemsList: scannedItems.map(item => item.inventoryNumber)
          }
        ]
      };

      const res = await sendInventoryToConfirm(payload);
      if (res.ok) {
        // Message de succès pour l'ajout d'objet
        setSubmissionMessage("Objet ajouté avec succès !");
        setSubmissionMessageType('success');
        
        restartScan();
        router.push('/');
      } else {
        throw new Error(res.error || "Erreur lors de l'envoi");
      }
    });
  };

  const removeScannedItem = (inventoryNumber: string) => {
    setScannedItems(prev => prev.filter(item => item.inventoryNumber !== inventoryNumber));
  };

  return {
    handleSendInventory,
    handleSendObject,
    removeScannedItem,
    addScannedCode
  };
}
