import type { InventoryMappingDTO } from '@/dto';

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
  return (
    <>
      {/* Objets ajoutés */}
      {mapping.some((m) => m.itemsList?.length) && (
        <div className="items-section">
          <h4 className="items-title">Objets ajoutés :</h4>
          {mapping
            .filter((m) => m.itemsList?.length)
            .map((m) => (
              <div key={m.itemType} className="mapping-section">
                <h5 className="mapping-type">{m.itemType + 's'}</h5>
                <div className="items-grid">
                  {m.itemsList?.map((item) => (
                    <div key={item} className="item present">
                      <span className="item-name">{item}</span>
                      <button
                        className="btn-icon"
                        onClick={() => onMoveToRemoved(item, invIndex, m.itemType)}
                        aria-label="Supprimer"
                      >
                        −
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Objets supprimés */}
      {mapping.some((m) => m.removedItem?.length) && (
        <div className="items-section">
          <h4 className="items-title">Objets supprimés :</h4>
          <div className="items-grid">
            {mapping.flatMap((m) =>
              (m.removedItem || []).map((item) => (
                <div key={item} className="item removed">
                  <span className="item-name">{m.itemType} {item}</span>
                  <button
                    className="btn-icon"
                    onClick={() => onMoveToAdded(item, invIndex, m.itemType)}
                    aria-label="Réajouter"
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}; 