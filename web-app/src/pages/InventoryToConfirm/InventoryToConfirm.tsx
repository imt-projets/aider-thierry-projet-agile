import { useEffect, useState, useCallback } from "react";
import type { InventoryToConfirmDTO, InventoryMappingDTO } from '@/dto';
import type { NotificationType } from "@/components/Notification/Notification";
import { InventoryCard } from '.';
import { RequestHelper } from "@/api";
import { ConfirmationModal } from "@/components/ConfirmationModal/ConfirmationModal";
import { Notification } from "@/components/Notification/Notification";
import PageLayout from "@/layouts/PageLayout";

interface NotificationState {
  message: string;
  type: NotificationType;
  show: boolean;
}

export const InventoryToConfirm = () => {
  const [inventories, setInventories] = useState<InventoryToConfirmDTO[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'validate' | 'cancel';
    inventoryId: string;
  }>({
    isOpen: false,
    action: 'validate',
    inventoryId: '',
  });
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    show: false,
  });

  const fetchInventories = async () => {
    try {
      const response = await RequestHelper.get("/inventoryToConfirm");
      if (response.ok && response.data) {
        const result = response.data as InventoryToConfirmDTO[];
        setInventories(result);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des inventaires:", error);
      showNotification("Erreur lors du chargement des inventaires", "error");
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type, show: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const updateInventoryMapping = useCallback(
    (invIndex: number, updater: (mapping: InventoryMappingDTO[]) => InventoryMappingDTO[]) => {
      setInventories((prev) => {
        const updated = [...prev];
        const current = { ...updated[invIndex] };
        current.mapping = updater(current.mapping);
        updated[invIndex] = current;
        return updated;
      });
    },
    []
  );

  const moveToRemoved = useCallback((item: string, invIndex: number, type: string) => {
    updateInventoryMapping(invIndex, (mapping) =>
      mapping
        .map((m) =>
          m.itemType !== type
            ? m
            : {
                ...m,
                itemsList: m.itemsList?.filter((i: string) => i !== item),
                removedItem: [...(m.removedItem || []), item],
              }
        )
        .filter((m) => (m.itemsList?.length || 0) > 0 || (m.removedItem?.length || 0) > 0)
    );
  }, [updateInventoryMapping]);

  const moveToAdded = useCallback((item: string, invIndex: number, type: string) => {
    updateInventoryMapping(invIndex, (mapping) => {
      let found = false;
      const updatedMapping = mapping
        .map((m) => {
          if (m.itemType !== type) return m;
          found = true;
          return {
            ...m,
            removedItem: m.removedItem?.filter((i: string) => i !== item),
            itemsList: [...(m.itemsList || []), item],
          };
        })
        .filter((m) => (m.itemsList?.length || 0) > 0 || (m.removedItem?.length || 0) > 0);

      if (!found) {
        updatedMapping.push({ itemType: type, itemsList: [item] });
      }

      return updatedMapping;
    });
  }, [updateInventoryMapping]);

  const handleAction = useCallback(async (id: string, action: 'validate' | 'cancel') => {
    setModalState({
      isOpen: true,
      action,
      inventoryId: id,
    });
  }, []);

  const confirmAction = useCallback(async () => {
    const { action, inventoryId } = modalState;
    try {
      const endpoint = action === 'validate' 
        ? `/inventoryToConfirm/${inventoryId}/validate`
        : `/inventoryToConfirm/${inventoryId}`;
      
      const inventory = inventories.find(inv => inv.id === inventoryId);
      if (!inventory) {
        throw new Error("Inventaire non trouvé");
      }

      const response = action === 'validate'
        ? await RequestHelper.post(endpoint, {
            ids: inventory.mapping.reduce((acc, mapping) => {
              return [...acc, ...(mapping.itemsList || [])];
            }, [] as string[])
          })
        : await RequestHelper.delete(endpoint, {});

      if (response.ok) {
        setInventories(prev => prev.filter(inv => inv.id !== inventoryId));
        showNotification(
          action === 'validate' 
            ? "Inventaire validé avec succès" 
            : "Inventaire supprimé avec succès",
          "success"
        );
      } else {
        throw new Error("Erreur lors de l'opération");
      }
    } catch (error) {
      console.error(`Erreur lors de ${modalState.action === 'validate' ? 'la validation' : 'la suppression'} de l'inventaire:`, error);
      showNotification(
        `Erreur lors de ${modalState.action === 'validate' ? 'la validation' : 'la suppression'} de l'inventaire`,
        "error"
      );
    } finally {
      setModalState(prev => ({ ...prev, isOpen: false }));
    }
  }, [modalState, inventories]);

  if (inventories.length === 0) {
    return (
      <div className="inventory-container">
        <h1 className="inventory-title">Inventaires à confirmer</h1>
        <p>Aucun inventaire à confirmer</p>
      </div>
    );
  }

  const currentInventory = inventories[0];

  return (
    <PageLayout id="inventaireToConfirm">
    <div className="inventory-container">
      <h1 className="inventory-title">Inventaires à confirmer</h1>

      <InventoryCard
        key={currentInventory.id}
        inventory={currentInventory}
        invIndex={0}
        onMoveToRemoved={moveToRemoved}
        onMoveToAdded={moveToAdded}
        onCancel={() => handleAction(currentInventory.id, 'cancel')}
        onValidate={() => handleAction(currentInventory.id, 'validate')}
      />

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.action === 'validate' ? "Valider l'inventaire" : "Supprimer l'inventaire"}
        message={modalState.action === 'validate' 
          ? "Êtes-vous sûr de vouloir valider cet inventaire ?"
          : "Êtes-vous sûr de vouloir supprimer cet inventaire ?"
        }
        onConfirm={confirmAction}
        onCancel={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        confirmText={modalState.action === 'validate' ? "Valider" : "Supprimer"}
      />

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </div>
    </PageLayout>
  );
};
