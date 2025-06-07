import { type ItemDTO, ItemsPaginationSchema, ItemsSchema } from "@/dto";
import { useFetch } from "@/hooks";
import PageLayout from "@/layouts/PageLayout"
import { useCallback, useEffect, useState } from "react";
import { ItemsTable, StatisticsModal } from "./components";
import { IconButton } from "@/components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";

const Items = () => {

    const [pagination, setPagination] = useState(1);
    const [count, setCount] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const response = useFetch(`/item/page/${pagination}`, {items: [], count:0});

    const [items, setItems] = useState<ItemDTO[]>([]);

    const fetchItems = useCallback(() => {
        if (response.data) {
            const parsed = ItemsPaginationSchema.parse(response.data);
            setItems(parsed.items);
            setCount(parsed.count);
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
                    >

                        <div className="pagination--informations">
                            <p>{(pagination*ITEMS_PER_PAGE)-ITEMS_PER_PAGE+1}-{pagination*ITEMS_PER_PAGE} of {count}</p>
                        </div>

                        <div className="pagination--actions">

                            <IconButton 
                                onClick={() => goToPage(pagination - 1)}
                                    disabled={pagination <= 1}
                                >
                                <MdKeyboardArrowLeft  />
                            </IconButton>

                            <div className="pagination--counter">
                                <span className="left">{pagination}</span>
                                <span>/ {count/ITEMS_PER_PAGE}</span>                      
                            </div>

                            <IconButton 
                                onClick={() => goToPage(pagination + 1)}
                                disabled={items.length === 0 || items.length % ITEMS_PER_PAGE === 0}
                            >
                                <MdNavigateNext/>
                            </IconButton>
                        </div>
                    </ItemsTable>
                </div>
            </div>
        </PageLayout>
    )
}

export default Items;