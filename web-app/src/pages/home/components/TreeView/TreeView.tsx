import { TreeViewSchema, type TreeViewBuilding, type TreeViewDTO, type TreeViewRoom, type TreeViewSchool } from "@/dto";
import { useCallback, useEffect, useState } from "react";
import { SearchBar, TreeList } from "./components";
import { useFetch } from "@/hooks";

export const TreeView = () => {
    const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});
    const [originalTreeView, setOriginalTreeView] = useState<TreeViewDTO>();
    const response = useFetch('/hierarchy', [])
    const [treeView, setTreeView] = useState<TreeViewDTO>()
    const [searchTerm, setSearchTerm] = useState("");

    const toggleNode = (id: string) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSearch = (value :string) => {
        setSearchTerm(value);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!treeView || !originalTreeView) return;
            if (!searchTerm) {
                setTreeView(originalTreeView);
            } else {
                setTreeView(findNodes(searchTerm, originalTreeView));
            }
        }, 350);
        return () => clearTimeout(timeout);
    }, [searchTerm]);


    const findNodes = (searchValue: string, nodes: TreeViewDTO): TreeViewDTO => {
        const lowerValue = searchValue.toLowerCase();
        const foundL1Nodes: TreeViewSchool[] = [];

        for (const level1 of nodes) {
            const foundL2Nodes: TreeViewBuilding[] = [];

            for (const level2 of level1.children) {
                const foundL3Nodes: TreeViewRoom[] = [];

                for (const level3 of level2.children) {
                    const matchingItems = level3.items.filter(item =>
                        item.inventoryNumber.toLowerCase().includes(lowerValue) ||
                        item.serialNumber.toLowerCase().includes(lowerValue)
                    );
                    if (matchingItems.length > 0) {
                        foundL3Nodes.push({
                            ...level3,
                            items: matchingItems,
                        });
                    }
                }

                if (foundL3Nodes.length > 0) {
                    foundL2Nodes.push({
                        ...level2,
                        children: foundL3Nodes,
                    });
                }
            }

            if (foundL2Nodes.length > 0) {
                foundL1Nodes.push({
                    ...level1,
                    children: foundL2Nodes,
                });
            }
        }

        return foundL1Nodes;
    };

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



    return (
        <div id="treeView--container">
            <SearchBar onChanges={handleSearch}/>
            { treeView && <TreeList nodes={treeView} depth={0} openNodes={openNodes} toggleNode={toggleNode} />}
        </div>
    );
};