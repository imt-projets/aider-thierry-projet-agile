import { Table, type Column, type Row } from '@/components';
import type { InventoryMappingDTO } from '@/dto';

interface MoveContentProps {
	mapping: InventoryMappingDTO[];
	roomName: string;
}

export const MoveContent = ({ mapping, roomName }: MoveContentProps) => {
	const allMovedItems: Row[] = mapping.flatMap(m =>
		(m.itemsList || []).map(item => ({
			id: item,
			type: m.itemType,
			currentRoom: roomName ?? "Aucune salle",
			newRoom: m.newRoomName,
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
			field: "currentRoom",
			title: "Salle actuelle",
			align: "flex-start"
		},
		{
			field: "newRoom",
			title: "Nouvelle salle",
			align: "flex-start"
		}
	];

	return (
		<div className="items-table">
			<Table
				columns={columns}
				data={allMovedItems}
			/>
		</div>
	);
}; 