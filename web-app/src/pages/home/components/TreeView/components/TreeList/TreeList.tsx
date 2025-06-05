import type { TreeViewDTO } from "@/dto";
import { TreeNode, type TreeNodeType } from "../TreeNode";

interface TreeListProps {
    nodes: TreeViewDTO;
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
        <div className="treeList--container">
            <ul>
                {nodes.map(node => (
                    <TreeNode
                        key={node.id}
                        node={node as TreeNodeType}
                        depth={depth}
                        openNodes={openNodes}
                        toggleNode={toggleNode}
                    />
                ))}
            </ul>
        </div>
    );
}