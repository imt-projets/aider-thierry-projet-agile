import type { ItemDTO } from "@/dto"
import { Link } from "react-router-dom";
import { Chip, IconButton, Pagination, Table, type Column } from "@/components";
import { FaEdit } from "react-icons/fa";
import { useContext } from "react";
import SelectionContext from "@/context/SelectionContext";

interface ItemsTableProps {
    items : ItemDTO[];
    page : number;
    count: number;
    loading: boolean,
    handleClickOnPagination: (page : number) => void;
}
const ITEMS_PER_PAGE = 8;

export const ItemsTable = ({ items, count, page, handleClickOnPagination, loading } : ItemsTableProps) => {

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
            renderCell: row => {
                const roomName = (row as { room?: { name?: string } }).room?.name;
                if (roomName) {
                    return (
                        <Chip 
                            text={roomName}
                            color="#E5E7FF"
                            textColor="#4F5AED"
                        />
                    );
                }
                return (
                    <Chip 
                        text="Pas de salle attitrée"
                        color="#FFE5E5"
                        textColor="#D32F2F"
                    />
                );
            }
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
                loading={loading}
            >
                <div className="pagination--informations">
                    <p>
                        {count === 0
                            ? "0"
                            : `${(page - 1) * ITEMS_PER_PAGE + 1}-${Math.min(page * ITEMS_PER_PAGE, count)} of ${count}`}
                    </p>
                </div>
                <Pagination
                    page={page}
                    totalCount={count}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handleClickOnPagination}
                />
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