import { type ItemDTO, ItemsPaginationSchema, ItemsSchema } from "@/dto";
import { useFetch } from "@/hooks";
import PageLayout from "@/layouts/PageLayout"
import { useCallback, useEffect, useState } from "react";
import { ItemsTable, StatisticsModal } from "./components";

const Items = () => {

    const [pagination, setPagination] = useState(1);
    const response = useFetch(`/item/page/${pagination}`, {items: [], count:0});

    const [items, setItems] = useState<ItemDTO[]>([]);

    const fetchItems = useCallback(() => {
        if (response.data) {
            const parsed = ItemsPaginationSchema.parse(response.data);
            setItems(parsed.items)
        }
    },  [response.data])

    useEffect(() => fetchItems(),[fetchItems])

    const goToPage = (page: number) => {
        if (page > 0 && page !== pagination) {
            setPagination(page);
        }
    };


    return (
        <PageLayout id="item">
            <div className="item--container">
                <div className="row">
                    <h1>OBJETS</h1>
                </div>

                <div className="row" id="statistics">
                    <StatisticsModal
                        color="#0E43CC"
                        title="Nombre total d'objets"
                        value={items.length.toString()}
                    />
                    <StatisticsModal
                        color="red"
                        title="Nombre d’objets n’ayant pas de salle"
                        value="2356"
                    />
                </div>

                <div className="row">
                    <ItemsTable
                        items={items}
                    />
                </div>

                <div className="row pagination-controls">
                    <button onClick={() => goToPage(pagination - 1)} disabled={pagination <= 1}>Précédent</button>
                    <span>Page {pagination}</span>
                    <button onClick={() => goToPage(pagination + 1)} disabled={items.length === 0}>Suivant</button>
                </div>
            </div>
        </PageLayout>
    )
}

export default Items;