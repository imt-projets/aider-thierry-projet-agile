import { type ItemDTO, ItemsPaginationSchema, type ItemsStatisticsDTO, ItemsStatisticsSchema } from "@/dto";
import { usePaginationResource, useFetch } from "@/hooks";
import PageLayout from "@/layouts/PageLayout"
import { ItemsTable, StatisticsModal } from "./components";
import { IoIosAdd } from "react-icons/io";
import { IconButton } from "@/components";
import { FaRegFileExcel } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Items = () => {

    const {
        data: items,
        meta,
        controls,
        loading
    } = usePaginationResource<ItemDTO>("/item", ItemsPaginationSchema);

    const [itemsStatistics, setItemsStatistics] = useState<ItemsStatisticsDTO>();
    const response = useFetch("/item/statistics", {ok:0, no_rooms:0});

    const fetchItemsStatistics = useCallback(() => {
        if (response.data) {
            const statisticsParsed = ItemsStatisticsSchema.parse(response.data);
            setItemsStatistics(statisticsParsed);
        }
    }, [response.data])

    useEffect(() => {
        fetchItemsStatistics();
    }, [fetchItemsStatistics])

    return (
        <PageLayout id="item">
            <div className="item--container">
                <div className="row" id="header">
                    <h1>OBJETS</h1>
                    <div className="actions">
                        <IconButton id="export">
                            <FaRegFileExcel/>
                            export EXCEL des objets
                        </IconButton>

                        <Link to="/add-item">
                            <IconButton id="add">
                                <IoIosAdd/>
                                ajouter un objet
                            </IconButton>
                        </Link>
                    </div>
                </div>

                <div className="row" id="statistics">
                    <StatisticsModal
                        color="#0E43CC"
                        title="Nombre d'objets correctement configurés"
                        value={itemsStatistics?.ok.toString() || ""}
                    />
                    <StatisticsModal
                        color="red"
                        title="Nombre d’objets n’ayant pas de salle"
                        value={itemsStatistics?.no_rooms.toString() || ""}
                    />
                </div>

                <div className="row">
                    <ItemsTable
                        loading={loading}
                        items={items}
                        handleClickOnPagination={controls.goTo}
                        count={meta.total}
                        page={meta.page}
                    />      
                </div>
            </div>
        </PageLayout>
    )
}

export default Items;