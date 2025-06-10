import type { ItemDTO } from "@/dto"
import { Link } from "react-router-dom";
import { Chip, IconButton, Table, type Column } from "@/components";
import { FaEdit } from "react-icons/fa";
import { useContext } from "react";
import SelectionContext from "@/context/SelectionContext";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";

interface ItemsTableProps {
    items : ItemDTO[];
    page : number;
    count: number;
    handleClickOnPagination: (page : number) => void;
}
const ITEMS_PER_PAGE = 8;

export const ItemsTable = ({ items, count, page, handleClickOnPagination } : ItemsTableProps) => {

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
            renderCell: row => 
                <Chip 
                    text={(row as { room?: { name?: string } }).room?.name ?? ""}  
                    color="#E5E7FF" textColor="#4F5AED"
                />
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
            >
                <div className="pagination--informations">
                    <p>{(page*ITEMS_PER_PAGE)-ITEMS_PER_PAGE+1}-{page*ITEMS_PER_PAGE} of {count}</p>
                </div>

                <div className="pagination--actions">
                    <IconButton 
                        onClick={() => handleClickOnPagination(page - 1)}
                            disabled={page <= 1}
                        >
                        <MdKeyboardArrowLeft  />
                    </IconButton>

                    <div className="pagination--counter">
                        <span className="left">{page}</span>
                        <span>/ {count/ITEMS_PER_PAGE}</span>                      
                    </div>

                    <IconButton 
                        onClick={() => handleClickOnPagination(page + 1)}
                        disabled={items.length === 0 || items.length % ITEMS_PER_PAGE === 0}
                    >
                        <MdNavigateNext/>
                    </IconButton>
                </div>
            </Table>
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