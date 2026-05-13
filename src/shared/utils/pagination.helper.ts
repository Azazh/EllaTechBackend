export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * buildPaginationMeta computes API pagination metadata.
 */
export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
	return {
		total,
		page,
		limit,
		totalPages: total === 0 ? 0 : Math.ceil(total / limit),
	};
}
