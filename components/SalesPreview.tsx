"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DatePicker } from "./DatePicker";

interface Sale {
  id: string;
  code: string;
  total_amount: number;
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

  const { data, error, isLoading, refetch } = useQuery({
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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Sales</h1>
      <div className="flex gap-4 flex-wrap mb-4">
        <h2 className="p-3 rounded-xl border border-gray-300 flex flex-col items-center gap-0.5">
          <span>Total Sales</span>
          <span className="text-lg font-medium">{data?.count}</span>
        </h2>
        <h2 className="p-3 rounded-xl border border-gray-300 flex flex-col items-center gap-0.5">
          <span>Total Amount</span>
          <span className="text-lg font-medium">{totalAmount}</span>
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-[1px]">
          <span>Start date</span>
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

        <div className="flex flex-col gap-[1px]">
          <span>End date</span>
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

        <Button variant={"default"} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <div className="mt-4">
        {data?.results?.map((sale) => (
          <div
            key={sale.id}
            className="flex items-center gap-2 mt-1 border-b border-gray-300"
          >
            <p>{sale.code}</p>
            <p>{sale.total_amount}</p>
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
