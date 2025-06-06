import { type ItemDTO, ItemsSchema } from "@/dto";
import { useFetch } from "@/hooks";
import PageLayout from "@/layouts/PageLayout"
import { useCallback, useEffect, useState } from "react";
import { StatisticsModal } from "./components";

const Items = () => {

    const response = useFetch('/item', []);

    const [items, setItems] = useState<ItemDTO[]>([]);

    const fetchItems = useCallback(() => {
        if (response.data) {
            const itemsParsed = ItemsSchema.parse(response.data);
            setItems(itemsParsed);
        }
    },  [response.data])

    useEffect(() => fetchItems(),[fetchItems])

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
            </div>
        </PageLayout>
    )
}

export default Items;