import { useState, useEffect, useCallback } from "react";
import type { ZodType } from "zod";
import { useFetch } from "../useFetch";

interface PaginationMeta {
	page: number;
	total: number;
	pageSize: number;
	totalPages: number;
}

interface PaginationControls {
	next: () => void;
	prev: () => void;
	goTo: (page: number) => void;
}

interface PaginatedResponse<T> {
	items: T[];
	count: number;
}

export const usePaginationResource = <T>(
	endpoint: string,
	schema: ZodType<PaginatedResponse<T>>,
	pageSize = 8
) => {
	const [page, setPage] = useState(1);
	const [items, setItems] = useState<T[]>([]);
	const [count, setCount] = useState(0);

	const url = `${endpoint}/page/${page}`;
	const response = useFetch(url, { items: [], count: 0 });

	const fetchItems = useCallback(() => {
		if (response.data) {
			const parsed = schema.parse(response.data);
			setItems(parsed.items);
			setCount(parsed.count);
		}
	}, [response.data, schema]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const totalPages = Math.max(1, Math.ceil(count / pageSize));

	const controls: PaginationControls = {
		next: () => page < totalPages && setPage(page + 1),
		prev: () => page > 1 && setPage(page - 1),
		goTo: (p: number) => p >= 1 && p <= totalPages && setPage(p),
	};

	const meta: PaginationMeta = {
		page,
		total: count,
		pageSize,
		totalPages,
	};

	return {
		data: items,
		loading : response.loading,
		meta,
		controls,
	};
};
