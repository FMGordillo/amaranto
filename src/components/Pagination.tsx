import { FunctionComponent } from "react";
import Button from "./Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

type PaginationProps = {
  pages: number[];
  visiblePages: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

const Pagination: FunctionComponent<PaginationProps> = ({
  pages,
  visiblePages,
  hasPreviousPage,
  hasNextPage,
}) => {
  const params = useSearchParams();
  const router = useRouter();
  const page = params.get("page") ?? "1";
  const parsedPage = parseInt(page, 10) ?? 1;

  const onPageChange = (page: number) => {
    if (page > pages.length || page <= 0) return;
    const query = new URLSearchParams(router.query as Record<string, string>);
    query.set("page", page.toString());
    void router.replace(router.pathname + "?" + query.toString());
  };

  return (
    visiblePages.length > 0 && (
      <div className="flex justify-center gap-2">
        <Button
          className={!hasPreviousPage ? "bg-neutral-400" : ""}
          aria-disabled={!hasPreviousPage}
          onClick={() => onPageChange(parsedPage - 1)}
        >
          {"<"}
        </Button>

        {visiblePages.map((currentPage) => (
          <Button
            className={currentPage === parsedPage ? "bg-pink-500" : ""}
            onClick={() => onPageChange(currentPage)}
            key={currentPage}
          >
            {currentPage}
          </Button>
        ))}

        <Button
          aria-disabled={!hasNextPage}
          className={!hasNextPage ? "bg-neutral-400" : ""}
          onClick={() => onPageChange(parsedPage + 1)}
        >
          {">"}
        </Button>
      </div>
    )
  );
};

export default Pagination;
