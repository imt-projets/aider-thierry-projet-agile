import { Building } from "../Icons/Building";
import { Object } from "../Icons/Object";
import { Room } from "../Icons/Room";
import { School } from "../Icons/School";
import { TreeList } from "./TreeList";
import type { Node } from "./TreeView";
import { useAppContext } from "@/context/AppContext";
const iconMap = new Map<string, React.ReactNode>([
    ["school", <School style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["building", <Building style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["room", <Room style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
    ["object", <Object style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />],
]);

interface TreeNodeProps {
    node: Node;
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
    const { selectElementInHierarchy } = useAppContext();
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
                    {node.children && <TreeList nodes={node.children} depth={depth + 1} openNodes={openNodes} toggleNode={toggleNode} />}
                    {node.items && node.items.map(item => (
                        <div
                            key={item.id}
                            className="object"
                            style={{ paddingLeft: `${(depth + 1) * 25}px` }}
                            onClick={() => selectElementInHierarchy(item.id)}
                        >
                            {iconMap.get("object")}
                            <span>{item.name}</span>
                        </div>
                    ))}
                </>
            )}
        </li>
    );
}