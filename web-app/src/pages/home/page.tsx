import { TreeView } from "@/components";
import type { TreeViewDTO } from "@/dto";
import { TreeViewSchema } from "@/dto";
import { useFetch } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { ObjectView, PathBarView, MenuView, HistoricView } from "./components";
import { useAppContext } from "@/context/AppContext";

const Home = () => {

    const { selectedElement, isLoading, error } = useAppContext();
    
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
                    {selectedElement && (
                        <>
                            <PathBarView />
                            <div className="container--form-view">
                                <div className="container--left">
                                    <MenuView />
                                    <ObjectView />
                                </div>
                                <div className="container--right">
                                    <HistoricView />
                                </div>
                            </div>
                        </>
                    )}
                  </div>
            </div>
        </div>
    )
}

export default Home;