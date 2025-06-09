import type { InventoryToConfirmDTO } from '@/dto';
import { InventoryCardActions, InventoryContent } from '.';
import { formatDate } from './utils';

interface InventoryCardProps {
  inventory: InventoryToConfirmDTO;
  invIndex: number;
  onMoveToRemoved: (item: string, invIndex: number, type: string) => void;
  onMoveToAdded: (item: string, invIndex: number, type: string) => void;
  onCancel: (id: string) => void;
  onValidate: (id: string) => void;
}

export const InventoryCard = ({
  inventory,
  invIndex,
  onMoveToRemoved,
  onMoveToAdded,
  onCancel,
  onValidate,
}: InventoryCardProps) => {
  const { id, type, roomName, date, mapping } = inventory;

  return (
    <div className="inventory-card">
      <div className="inventory-header">
        <div>
          <h2 className="inventory-room">Salle {roomName}</h2>
          <p className="inventory-date">{formatDate(date)}</p>
        </div>
        <span className={`inventory-type ${type === "MOVE_ITEM" ? "type-move" : "type-inventory"}`}>
          {type === "MOVE_ITEM" ? "Déplacement" : "Inventaire"}
        </span>
      </div>

      <InventoryContent
        type={type}
        roomName={roomName}
        mapping={mapping}
        invIndex={invIndex}
        onMoveToRemoved={onMoveToRemoved}
        onMoveToAdded={onMoveToAdded}
      />

      <InventoryCardActions
        onCancel={() => onCancel(id)}
        onValidate={() => onValidate(id)}
      />
    </div>
  );
}; 