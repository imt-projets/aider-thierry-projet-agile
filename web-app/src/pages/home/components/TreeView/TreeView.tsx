import type { TreeViewDTO } from "@/dto";
import { useState } from "react";
import { SearchBar, TreeList } from "./components";

export interface Node {
    id: string;
    name: string;
    children?: Node[];
    items?: Node[];
    type: string;
}

export const TreeView = ({ schools }: { schools: TreeViewDTO }) => {
    const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

    const toggleNode = (id: string) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div id="treeView--container">
            <SearchBar/>
            <TreeList nodes={schools as Node[]} depth={0} openNodes={openNodes} toggleNode={toggleNode} />
        </div>
    );
};