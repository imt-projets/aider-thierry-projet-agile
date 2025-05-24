import { TreeView } from "@/components";
import type { TreeViewDTO } from "@/dto";
import { TreeViewSchema } from "@/dto";
import { useFetch } from "@/hooks";
import { useCallback, useEffect, useState } from "react";

const Home = () => {

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
            </div>
        </div>
    )
}

export default Home;