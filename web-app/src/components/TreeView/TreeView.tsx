import type { TreeViewDTO } from "@/dto"

interface Node {
    id: string;
    name: string;
    children?: Node[];
    type: string;
}

export const TreeView = ({ schools }: { schools: TreeViewDTO }) => {

    const renderTree = (nodes: Node[], depth = 0) => {
        if (!nodes?.length) return null;
        return (
            <ul>
                {nodes.map(node => (
                    <li
                        key={node.id}
                        className={node.type}
                    >
                        <p
                            style={{ paddingLeft: `${(depth+1) * 25}px` }}
                        >{node.name}</p>
                        {node.children && node.children.length > 0 && renderTree(node.children, depth + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div id="treeView--container">
            {renderTree(schools)}
        </div>
    );
}
