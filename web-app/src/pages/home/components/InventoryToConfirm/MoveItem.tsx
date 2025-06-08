import type { InventoryMappingDTO } from '@/dto';

interface MoveContentProps {
  mapping: InventoryMappingDTO[];
  roomName: string;
}

export const MoveContent = ({ mapping, roomName }: MoveContentProps) => (
  <>
    {mapping.map((m, index) => (
      <div key={index} className="mapping-section move">
        <div className="move-content">
          <span className="move-item">{m.itemsList?.[0]}</span>
          <span className="move-item">{m.itemType}</span>
          <span className="move-item">{roomName}</span>
          <span className="move-arrow">→</span>
          <span className="move-room">{m.newRoomName}</span>
        </div>
      </div>
    ))}
  </>
); 