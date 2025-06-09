import type { ItemDTO } from "@/dto"
import Table, { type Column } from "./Table"
import { Link } from "react-router-dom";
import IconButton from "@/components/IconButton/IconButton";
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

    console.log(items);
    const columns : Column[] = [
        {
            field: "temp3",
            title: "#",  
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
            field: "temp2",
            title: "Salle"
        },
        {
            field: "price",
            title: "Prix"
        },
        {
            field: 'action',
            title: 'Actions',
            align: 'flex-end',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            />
        </div>
    )
}