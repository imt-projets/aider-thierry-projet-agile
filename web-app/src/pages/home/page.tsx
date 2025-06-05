import { TreeView } from "@/components";
import type { TreeViewDTO } from "@/dto";
import { TreeViewSchema } from "@/dto";
import { useFetch } from "@/hooks";
import { useCallback, useContext, useEffect, useState } from "react";
import { ObjectDetails, PathBarView, ObjectTabs, ObjectForm } from "./components";
import SelectionContext from "@/context/SelectionContext";

const Home = () => {
    const { selectedItem } = useContext(SelectionContext);
    
    const response = useFetch('/hierarchy', [])
    const [treeView, setTreeView] = useState<TreeViewDTO>()

    const fetchHierarchy = useCallback(() => {
        if (response.data) {
            const treeViewParsed = TreeViewSchema.parse(response.data);
            setTreeView(treeViewParsed);
        }
    }, [response.data])

    useEffect(() => {
        fetchHierarchy()
    }, [fetchHierarchy]);

    return (
        <div id="home-page">
            <div className="container--app">
                <div className="navigation--drawer">
                </div>

                <div className="container--inventory-view">
                    {treeView && <TreeView schools={treeView} />}
                </div>

                  <div className="container--object-view">
                    {selectedItem ? (
                        <>
                            <PathBarView />
                            <div className="container--form-view">
                                <div className="container--left">
                                    <ObjectTabs />
                                    <ObjectForm />
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
                                    src="./public/logo-barcode.png" 
                                    alt="Logo Barcode" 
                                    className="barcode-logo"
                                />
                                {/* <img 
                                    src="./public/logo-imt.png" 
                                    alt="Logo imt" 
                                    className="imt-logo"
                                /> */}
                            </div>
                            <h2>Bienvenue sur IMT'ventaire!</h2>
                            <p>Pour afficher la vue objet, sélectionner le dans la hiérarchy</p>
                        </div>
                    }
                  </div>
            </div>
        </div>
    )
}

export default Home;