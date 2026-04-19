"use client";

import { useEffect, useState } from "react";

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
  const [sales, setSales] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const today = getToday();
  const [query, setQuery] = useState({
    start_date: today,
    end_date: today,
    page: 1,
    page_size: 100,
    q: "",
  });

  useEffect(() => {
    const qs = buildQuery(query);

    setLoading(false);
    console.log(`Fetching sales with query: ?q=&${qs}`);

    fetch(`/api/sales?q=&${qs}`)
      .then((res) => res.json())
      .then((data: SalesData) => setSales(data))
      .finally(() => setLoading(false));
  }, [query]);

  function buildQuery(params: Record<string, any>) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        search.append(key, String(value));
      }
    });

    return search.toString();
  }

  if (loading) return <p>Loading...</p>;

  const totalAmount =
    sales?.results?.reduce((sum, s) => sum + s.total_amount, 0) ?? 0;

  return (
    <div>
      <h1>Sales</h1>
      <h2>Total Sales: {sales?.count}</h2>
      <h2>Total Sales Amount {totalAmount} </h2>
      <input
        type="date"
        value={query.start_date}
        onChange={(e) =>
          setQuery((q) => ({ ...q, start_date: e.target.value }))
        }
      />

      <input
        type="date"
        value={query.end_date}
        onChange={(e) => setQuery((q) => ({ ...q, end_date: e.target.value }))}
      />

      <div className="mt-4">
        {sales?.results?.map((sale) => (
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
