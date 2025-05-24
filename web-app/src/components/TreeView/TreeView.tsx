import type { TreeViewDTO } from "@/dto";
import React, { useState } from "react";
import { School } from "../Icons/School";
import { Building } from "../Icons/Building";
import { Object } from "../Icons/Object";
import { Room } from "../Icons/Room";

interface Node {
    id: string;
    name: string;
    children?: Node[];
    items?: Node[];
    type: string;
}

const iconMap = new Map<string, React.ReactNode>([
    ["school", <School style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["building", <Building style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["room", <Room style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
]);

export const TreeView = ({ schools }: { schools: TreeViewDTO }) => {
    const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

    const toggleNode = (id: string) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderTree = (nodes: Node[], depth = 0) => {
        if (!nodes?.length) return null;
        return (
            <ul>
                {nodes.map(node => (
                    <React.Fragment key={node.id}>
                        <li className={node.type}>
                            <div
                                style={{ paddingLeft: `${depth * 25}px`}}
                                onClick={() => toggleNode(node.id)}
                            >
                                {(node.children?.length || node.items?.length) ? (
                                    <span style={{ marginRight: 8 }}>
                                        {openNodes[node.id] ? "▼" : "▶"}
                                    </span>
                                ) : null}
                                {iconMap.get(node.type)}
                                <span>{node.name}</span>
                            </div>
                            {openNodes[node.id] && (
                                <>
                                    {node.children && renderTree(node.children, depth + 1)}
                                    {node.items && node.items.map(item => (
                                        <li
                                            key={item.id}
                                            className={item.type}
                                            style={{ paddingLeft: `${(depth + 1) * 25}px` }}
                                        >
                                            <Object style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </>
                            )}
                        </li>
                    </React.Fragment>
                ))}
            </ul>
        );
    };

    return (
        <div id="treeView--container">
            {renderTree(schools as Node[])}
        </div>
    );
};