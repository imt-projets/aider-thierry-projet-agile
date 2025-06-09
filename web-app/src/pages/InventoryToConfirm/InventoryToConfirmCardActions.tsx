interface InventoryCardActionsProps {
  onCancel: () => void;
  onValidate: () => void;
}

export const InventoryCardActions = ({
  onCancel,
  onValidate,
}: InventoryCardActionsProps) => (
  <div className="inventory-actions">
    <button onClick={onCancel} className="btn btn-cancel">
      Annuler
    </button>
    <button onClick={onValidate} className="btn btn-validate">
      Valider
    </button>
  </div>
); 