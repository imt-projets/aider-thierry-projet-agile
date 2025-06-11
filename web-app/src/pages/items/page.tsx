import { type ItemDTO, ItemsPaginationSchema } from "@/dto";
import { usePaginationResource } from "@/hooks";
import PageLayout from "@/layouts/PageLayout"
import { ItemsTable, StatisticsModal } from "./components";

const Items = () => {

    const {
        data: items,
        meta,
        controls
    } = usePaginationResource<ItemDTO>("/item", ItemsPaginationSchema);

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