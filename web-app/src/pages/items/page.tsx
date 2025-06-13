import { type ItemDTO, ItemsPaginationSchema } from "@/dto";
import { usePaginationResource } from "@/hooks";
import PageLayout from "@/layouts/PageLayout"
import { ItemsTable, StatisticsModal } from "./components";
import { IoIosAdd } from "react-icons/io";
import { IconButton } from "@/components";
import { FaRegFileExcel } from "react-icons/fa";

const Items = () => {

    const {
        data: items,
        meta,
        controls
    } = usePaginationResource<ItemDTO>("/item", ItemsPaginationSchema);

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


                        <IconButton id="add">
                            <IoIosAdd/>
                            ajouter un objet
                        </IconButton>
                    </div>
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