import SelectionContext from "@/context/SelectionContext";
import type { CommentItemDTO } from "@/dto";
import { CommentItemSchema } from "@/dto/comment";
import { useFetch } from "@/hooks";
import { useCallback, useContext, useEffect, useState } from "react";

export const ObjectDetails = () => {

    const { selectedItem } = useContext(SelectionContext);

    const response = useFetch(`/item/${selectedItem?.id}/comments`)

    const [comments, setComments] = useState<CommentItemDTO[]>([]);

    const fetchItemComments = useCallback(() => {
        if (response.data) {
            setComments(response.data as CommentItemDTO[]);
        }
    }, [response.data])

    useEffect(() => {
        fetchItemComments()
    }, [fetchItemComments]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div id="historic--container">
            <div className="historic-header">
                <div className="tab-active">Commentaires</div>
                <div className="tab-inactive">Historique</div>
            </div>
            
            <div className="timeline-container">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={comment.id} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <div className="comment-date">{formatDate(comment.date)}</div>
                                <div className="comment-text">{comment.content}</div>
                            </div>
                            {index < comments.length - 1 && <div className="timeline-line"></div>}
                        </div>
                    ))
                ) : (
                    <div className="no-comments">Aucun commentaire disponible</div>
                )}
            </div>
        </div>
    );
}