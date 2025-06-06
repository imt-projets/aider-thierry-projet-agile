import { TreeList } from "../TreeList/TreeList";
import { useContext } from "react";
import SelectionContext from "@/context/SelectionContext";
import { Building, Room, School, Item } from "@/components";
import type { TreeViewDTO } from "@/dto";

export type TreeNodeType = {
    id: string;
    name: string;
    type: "school" | "building" | "room";
    children?: TreeNodeType[];
    items?: {
        id: string;
        name: string;
        inventoryNumber: string;
        serialNumber: string;
        type: "object";
    }[]; 
};

const iconMap = new Map<string, React.ReactNode>([
    ["school", <School style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["building", <Building style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["room", <Room style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["object", <Item style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
]);

interface TreeNodeProps {
    node: TreeNodeType;
    depth: number;
    openNodes: Record<string, boolean>;
    toggleNode: (id: string) => void; 
}

export const TreeNode = ({
    node,
    depth,
    openNodes,
    toggleNode,
}: TreeNodeProps) => {
    const { selectItem } = useContext(SelectionContext);
    return (
        <li className={node.type}>
            <div
                style={{ paddingLeft: `${depth * 25}px` }}
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
                    {node.children && (
                        <TreeList 
                            nodes={node.children as TreeViewDTO} 
                            depth={depth + 1} 
                            openNodes={openNodes} 
                            toggleNode={toggleNode} 
                    />)}
                    {node.items && node.items.map(item => (
                        <div
                            key={item.id}
                            className="object"
                            style={{ paddingLeft: `${(depth + 1) * 25}px` }}
                            onClick={() => selectItem(item.id)}
                        >
                            {iconMap.get("object")}
                            <span>{item.name} - {item.inventoryNumber} </span>
                        </div>
                    ))}
                </>
            )}
        </li>
    );
}