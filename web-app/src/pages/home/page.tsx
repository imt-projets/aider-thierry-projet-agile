import { TreeView } from "@/pages/home/components/TreeView";
import {  useCallback, useContext, useEffect, useState } from "react";
import { ObjectDetails, ObjectTabs, ObjectForm } from "./components";
import SelectionContext from "@/context/SelectionContext";
import PageLayout from "@/layouts/PageLayout";
import { TreeViewSchema, type TreeViewDTO } from "@/dto";
import { useFetch } from "@/hooks";

const Home = () => {
    const response = useFetch('/hierarchy', [])
    const [originalTreeView, setOriginalTreeView] = useState<TreeViewDTO>();
    const [treeView, setTreeView] = useState<TreeViewDTO>()

    const fetchHierarchy = useCallback(() => {
        if (response.data) {
            const treeViewParsed = TreeViewSchema.parse(response.data);
            setTreeView(treeViewParsed);
            setOriginalTreeView(treeViewParsed);
        }
    }, [response.data])

    useEffect(() => {
        fetchHierarchy()
    }, [fetchHierarchy]);

    const { selectedItem } = useContext(SelectionContext);
    
    return (
        <PageLayout id="home">
            <div className="container--inventory-view">
                <TreeView
                    loading={response.loading}
                    treeView={treeView}
                    originalTreeView={originalTreeView}
                    setTreeView={setTreeView}
                />
            </div>

            <div className="container--object-view">
                {selectedItem ? (
                    <>
                        <div className="container--form-view">
                            <div className="container--left">
                                <ObjectTabs />
                                <ObjectForm reloadHierarchy={response.reload}/>
                            </div>
                            <div className="container--right">
                                <ObjectDetails />
                            </div>
                        </div>
                    </>
                ) : 
                    <div className="default--view">
                        <div className="container-logos">
                            <img 
                                src="./logo-barcode.png" 
                                alt="Logo Barcode" 
                                className="barcode-logo"
                            />
                            {/* <img 
                                src="./logo-imt.png" 
                                alt="Logo imt" 
                                className="imt-logo"
                            /> */}
                        </div>
                        <h2>Bienvenue sur IMT'ventaire!</h2>
                        <p>Pour afficher les détails d'un objet, sélectionnez-le dans la hiérarchie</p>
                    </div>
                }
            </div>
        </PageLayout>
    )
}

export default Home;