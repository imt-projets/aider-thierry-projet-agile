import { TreeNode } from "./TreeNode";
import type { Node } from "./TreeView";

interface TreeListProps {
    nodes: Node[];
    depth: number;
    openNodes: Record<string, boolean>;
    toggleNode: (id: string) => void;
}

export const TreeList = ({
    nodes,
    depth,
    openNodes,
    toggleNode,
}: TreeListProps) => {
    return (
        <ul>
            {nodes.map(node => (
                <TreeNode
                    key={node.id}
                    node={node}
                    depth={depth}
                    openNodes={openNodes}
                    toggleNode={toggleNode}
                />
            ))}
        </ul>
    );
}