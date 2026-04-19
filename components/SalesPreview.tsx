
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

  useEffect(() => {
    fetch("/api/sales")
      .then((res) => res.json())
      .then((data:SalesData) => setSales(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Sales</h1>
      <h2>Total Sales: {sales?.count}</h2>
      <h2>Total Sales Amount</h2>
      {sales?.results?.map((sale) => (
        <div key={sale.id}>
          <p>{sale.code}</p>
          <p>{sale.total_amount}</p>
        </div>
      ))}
    </div>
  );
}