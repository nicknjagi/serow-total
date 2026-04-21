"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DatePicker } from "./DatePicker";
import { format } from "date-fns";
import { Loader, RefreshCcw } from 'lucide-react'
import { Badge } from "./ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Sale {
  id: string;
  code: string;
  total_amount: number;
  created_at: string;
  voided:boolean;
  payment_completed:boolean;
}

interface SalesData {
  results: Sale[];
  count: number;
}

export default function SalesPreview() {
  const today = getToday();
  const [query, setQuery] = useState({
    start_date: today,
    end_date: today,
    page: 1,
    page_size: 100,
    q: "",
  });

  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["sales", query],
    enabled: false,
    queryFn: async () => {
      const qs = buildQuery(query);
      console.log(`Fetching sales with query: ?q=&${qs}`);

      const res = await fetch(`/api/sales?q=&${qs}`);
      if (!res.ok) {
        throw new Error("Failed to fetch sales");
      }
      return res.json() as Promise<SalesData>;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, []);

  function buildQuery(params: Record<string, any>) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        search.append(key, String(value));
      }
    });

    return search.toString();
  }

  const totalAmount =
    data?.results?.reduce((sum, s) => sum + s.total_amount, 0) ?? 0;

  const voidedCount =
    data?.results?.filter((s) => s.voided === true).length ?? 0;

  const openCount =
    data?.results?.filter((s) => s.payment_completed === false).length ?? 0;

  const totalPages = Math.ceil((data?.count ?? 0) / query.page_size);

  return (
    <div className="py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold px-4">Sales</h1>
        {(isLoading || isFetching) && (
          <Loader className="animate-spin" size={18} />
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar p-4">
        <h3 className="shrink-0 px-3 py-2 bg-white rounded-xl shadow-sm flex flex-col items-center gap-0.5">
          <span>Total Sales</span>
          <span className="text-lg font-medium">{data?.count}</span>
        </h3>
        <h3 className="shrink-0 px-3 py-2 bg-white rounded-xl shadow-sm flex flex-col items-center gap-0.5">
          <span>Total Amount</span>
          <span className="text-lg font-medium">{totalAmount}</span>
        </h3>
        <h3 className="shrink-0 px-3 py-2 bg-white rounded-xl shadow-sm flex flex-col items-center gap-0.5">
          <span>Open Sales</span>
          <span className="text-lg font-medium">{openCount}</span>
        </h3>
        <h3 className="shrink-0 px-3 py-2 bg-white rounded-xl shadow-sm flex flex-col items-center gap-0.5">
          <span>Voided Sales</span>
          <span className="text-lg font-medium">{voidedCount}</span>
        </h3>
      </div>

      <div className="flex flex-wrap items-end gap-2 px-4">
        <div className="flex flex-col gap-px">
          <span className="text-xs">Start date</span>
          <DatePicker
            value={fromYMD(query.start_date)}
            placeholder="Start date"
            onChange={(date) =>
              setQuery((q) => ({
                ...q,
                start_date: toYMD(date),
                page: 1,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-px">
          <span className="text-xs">End date</span>
          <DatePicker
            value={fromYMD(query.end_date)}
            placeholder="End date"
            onChange={(date) =>
              setQuery((q) => ({
                ...q,
                end_date: toYMD(date),
                page: 1,
              }))
            }
          />
        </div>

        <Button
          size={"icon-lg"}
          className="text-xs"
          variant={"outline"}
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
        >
          <RefreshCcw />
        </Button>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination className="ml-auto justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (query.page > 1) {
                      setQuery((q) => ({ ...q, page: q.page - 1 }));
                    }
                  }}
                />
              </PaginationItem>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === query.page}
                    onClick={(e) => {
                      e.preventDefault();
                      setQuery((q) => ({ ...q, page: p }));
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (query.page < totalPages) {
                      setQuery((q) => ({ ...q, page: q.page + 1 }));
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 px-4">
        {data?.results?.map((sale) => (
          <div
            key={sale.id}
            className="flex flex-col gap-1 bg-white shadow-xs rounded-md py-2 px-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm">{sale.code}</p>
              {sale.payment_completed && !sale.voided && (
                <Badge className="bg-green-500/10 text-green-500 border border-green-100">
                  Closed{" "}
                </Badge>
              )}
              {!sale.payment_completed && !sale.voided && (
                <Badge variant={"secondary"}>Open</Badge>
              )}
              {sale.voided && <Badge variant={"destructive"}>Voided </Badge>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {format(new Date(sale.created_at), "h:mm a")}
              </span>
              <p className="font-medium">KES {sale.total_amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function fromYMD(dateStr: string) {
  return new Date(dateStr + "T00:00:00");
}

function toYMD(date?: Date) {
  if (!date) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}
