import type { ItemDTO } from "@/dto"
import { Link } from "react-router-dom";
import { Chip, IconButton, Table, type Column } from "@/components";
import { FaEdit } from "react-icons/fa";
import { useContext } from "react";
import SelectionContext from "@/context/SelectionContext";

interface ItemsTableProps {
    items : ItemDTO[]
}

export const ItemsTable = ({ items } : ItemsTableProps) => {

    const { selectItem } = useContext(SelectionContext);

    const handleClick = (id: string) => {
        selectItem(id);
    }

    const columns : Column[] = [
        {
            field: "id",
            title: "#",  
            renderCell: (_row, idx) => <p>{idx + 1}</p>
        },
        {
            field: "name",
            title: "Nom de l'objet",
            align: "flex-start"
        },
        {
            field: "inventoryNumber",
            title: "N° d'inventaire",
            align: "flex-start"
        },
        {
            field: "temp",
            title: "N° de commande"
        },
        {
            field: "description",
            title: "Description"
        },
        {
            field: "room",
            title: "Salle",
            renderCell: row => <Chip text={row.room?.name ?? ""} color="#E5E7FF" textColor="#4F5AED"/>
        },
        {
            field: "price",
            title: "Prix",
            renderCell: row => <p>{row.price + " €"}</p>
        },
        {
            field: 'action',
            title: 'Actions',
            align: 'flex-end',
            renderCell : row => {
                return (
                    <div className="actions">
                        <Link to={`/`} onClick={() => handleClick(row.id as string)}>
                            <IconButton>
                                <FaEdit />
                            </IconButton>
                        </Link>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="items-table">
            <Table
                columns={columns}
                data={items}
                columnsTemplate={columnsItemsTemplate}
            />
        </div>
    )
}

const columnsItemsTemplate = new Map<string, number>([
    ["id", 0.30],
    ["name", 2],
    ["inventoryNumber", 1],
    ["brand", 1],
    ["model", 1],
    ["state", 1],
    ["warrantyEndDate", 1],
    ["endOfLifeDate", 1],
    ["price", 0.75],
    ["description", 3],
    ["actions", 0.75],
    ["room", 0.75]
]);