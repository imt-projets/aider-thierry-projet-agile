export interface ItemType {
  id: string;
  name: string;
  description?: string;
}

export default interface Item {
    id: string;
    name: string;
    serialNumber: string;
    inventoryNumber: string;
    orderNumber: string;
    price: number;
    description: string;
    warrantyEndDate: string;
    endOfLifeDate: string;
    brand: string;
    model: string;
    state: string;
    itemType: ItemType;
    room : any; // TODO : avoir un type ROOM
}