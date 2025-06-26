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

    return (
        <div id="historic--container">
            {JSON.stringify(comments)}
        </div>
    );
}