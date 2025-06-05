import { TreeViewSchema, type TreeViewDTO } from "@/dto";
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
            if (!treeView) return;

            const filtered = filterHierarchy(searchTerm);
            setTreeView(filtered);
        }, 350);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const filterHierarchy = (value: string): TreeViewDTO => {
        if (!originalTreeView) return [];
        if (!value) return originalTreeView

        const lowerValue = value.toLowerCase();

        const deepCopyTreeView = structuredClone(originalTreeView)

        return deepCopyTreeView
            .map(school => {
                const filteredBuildings = school.children
                    .map(building => {
                        const filteredRooms = building.children
                            .map(room => {
                                const filteredItems = room.items.filter(item =>
                                    item.inventoryNumber.toLowerCase().includes(lowerValue) ||
                                    item.serialNumber.toLowerCase().includes(lowerValue)
                                );

                                if (filteredItems.length > 0) {
                                    return {
                                        ...room,
                                        items: filteredItems
                                    };
                                }

                                return null;
                            })
                            .filter((room): room is NonNullable<typeof room> => room !== null);

                        if (filteredRooms.length > 0) {
                            return {
                                ...building,
                                children: filteredRooms
                            };
                        }

                        return null;
                    })
                    .filter((building): building is NonNullable<typeof building> => building !== null);

                if (filteredBuildings.length > 0) {
                    return {
                        ...school,
                        children: filteredBuildings
                    };
                }

                return null;
            })
        .filter((school): school is NonNullable<typeof school> => school !== null);
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