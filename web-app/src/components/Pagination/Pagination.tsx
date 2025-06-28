import { IconButton } from "@/components";
import { MdKeyboardArrowLeft, MdNavigateNext } from "react-icons/md";

interface PaginationProps {
    page: number;
    totalCount: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalCount, itemsPerPage, onPageChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return (
        <div className="pagination--actions">
            <IconButton 
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                <MdKeyboardArrowLeft  />
            </IconButton>

            <div className="pagination--counter">
                <span className="left">{page}</span>
                <span>/ {totalPages}</span>                      
            </div>

            <IconButton 
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                <MdNavigateNext/>
            </IconButton>
        </div>
    );
};