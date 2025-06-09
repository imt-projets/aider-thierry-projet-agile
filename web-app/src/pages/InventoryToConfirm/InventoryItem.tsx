import type { InventoryMappingDTO } from '@/dto';
import Table, { type Column, type Row } from "@/components/Table/Table";

interface ItemsContentProps {
  mapping: InventoryMappingDTO[];
  invIndex: number;
  onMoveToRemoved: (item: string, invIndex: number, type: string) => void;
  onMoveToAdded: (item: string, invIndex: number, type: string) => void;
}

export const ItemsContent = ({
  mapping,
  invIndex,
  onMoveToRemoved,
  onMoveToAdded,
}: ItemsContentProps) => {
  const addedItems: Row[] = mapping
    .filter((m) => m.itemsList?.length)
    .flatMap((m) => 
      (m.itemsList || []).map(item => ({
        id: item,
        type: m.itemType,
        status: 'added'
      }))
    );

  const removedItems: Row[] = mapping
    .filter((m) => m.removedItem?.length)
    .flatMap((m) => 
      (m.removedItem || []).map(item => ({
        id: item,
        type: m.itemType,
        status: 'removed'
      }))
    );

  const columns: Column[] = [
    {
      field: "type",
      title: "Type",
      align: "flex-start"
    },
    {
      field: "id",
      title: "Numéro d'inventaire",
      align: "flex-start"
    },
    {
      field: 'action',
      title: 'Actions',
      align: 'flex-end',
      renderCell: (row: Row) => {
        return row.status === 'added' ? (
          <div className="actions">
            <button
              className="btn-icon"
              onClick={() => onMoveToRemoved(row.id as string, invIndex, row.type as string)}
              aria-label="Supprimer"
            >
              −
            </button>
          </div>
        ) : (
          <div className="actions">
            <button
              className="btn-icon"
              onClick={() => onMoveToAdded(row.id as string, invIndex, row.type as string)}
              aria-label="Réajouter"
            >
              +
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="inventory-tables">
      {addedItems.length > 0 && (
        <div className="items-table">
          <h3 className="table-title">Objets ajoutés</h3>
          <Table
            columns={columns}
            data={addedItems}
          />
        </div>
      )}

      {removedItems.length > 0 && (
        <div className="items-table">
          <h3 className="table-title">Objets supprimés</h3>
          <Table
            columns={columns}
            data={removedItems}
          />
        </div>
      )}
    </div>
  );
}; 