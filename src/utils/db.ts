type PaginationParams = {
  page: number;
  limit: number;
  total: number;
};

export const getPagination = (params: PaginationParams) => {
  const offset = (params.page - 1) * params.limit;

  const pages = [...Array(Math.ceil(params.total / params.limit)).keys()].map(
    (k) => k + 1,
  );

  const startPage = Math.max(params.page - 5, 1);
  const endPage = Math.min(params.page + 5, pages.length);
  const visiblePages = pages.slice(startPage - 1, endPage);

  const hasPreviousPage = params.page > 1;
  const hasNextPage = params.page < pages.length;

  return {
    startPage,
    endPage,
    hasNextPage,
    hasPreviousPage,
    pages,
    offset,
    visiblePages,
  };
};
