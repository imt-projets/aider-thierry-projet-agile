import { TreeList } from "../TreeList/TreeList";
import { useContext } from "react";
import SelectionContext from "@/context/SelectionContext";
import { Building, Room, School, Item } from "@/components";
import type { TreeViewDTO } from "@/dto";
import { motion, AnimatePresence } from "framer-motion";

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
    const isOpen = openNodes[node.id];

    return (
        <li className={node.type}>
            <div
                style={{ paddingLeft: `${depth * 25}px`, cursor: "pointer", display: "flex", alignItems: "center" }}
                onClick={() => toggleNode(node.id)}
            >
                {(node.children?.length || node.items?.length) ? (
                    <motion.span
                        style={{ marginRight: 8, display: "inline-block" }}
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        ▶
                    </motion.span>
                ) : null}
                {iconMap.get(node.type)}
                <span>{node.name}</span>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden", display: "block" }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        {node.children && (
                            <TreeList
                                nodes={node.children as TreeViewDTO}
                                depth={depth + 1}
                                openNodes={openNodes}
                                toggleNode={toggleNode}
                            />
                        )}
                        {node.items && node.items.map(item => (
                            <div
                                key={item.id}
                                className="object"
                                style={{ paddingLeft: `${(depth + 1) * 25}px`, display: "flex", alignItems: "center", cursor: "pointer" }}
                                onClick={() => selectItem(item.id)}
                            >
                                {iconMap.get("object")}
                                <span>{item.name} - {item.inventoryNumber}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
};
