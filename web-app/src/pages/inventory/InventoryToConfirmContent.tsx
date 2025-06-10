import type { InventoryMappingDTO } from '@/dto';
import { MoveContent, ItemsContent } from '.';

interface InventoryContentProps {
	type: string;
	roomName: string;
	mapping: InventoryMappingDTO[];
	invIndex: number;
	onMoveToRemoved: (item: string, invIndex: number, type: string) => void;
	onMoveToAdded: (item: string, invIndex: number, type: string) => void;
}

export const InventoryContent = ({
	type,
	roomName,
	mapping,
	invIndex,
	onMoveToRemoved,
	onMoveToAdded
}: InventoryContentProps) => {
	return (
		<div className="inventory-content">
			{type === "MOVE_ITEM" ? (
				<MoveContent mapping={mapping} roomName={roomName} />
			) : (
				<ItemsContent
				mapping={mapping}
				invIndex={invIndex}
				onMoveToRemoved={onMoveToRemoved}
				onMoveToAdded={onMoveToAdded}
				/>
			)}
		</div>
	);
}; 