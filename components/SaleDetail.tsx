"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

type Props = {
  saleId: string;
};

interface SaleDetailData {
  id: string;
  currency: {
    currency_code: string;
  };
  sale_receipt_items: {
    id: string;
    item: {
      id: string;
      name: string;
      pieces_per_packet: number;
    };
    sale_receipt: {
      id: string;
      code: string;
    };
    total_quantity: number;
    unit_price: number;
    total_cost: number;
    total_price: number;
    total_amount: number;
    quantity_option: string;
    quantity: number;
    total_profit: number;
    profit_percentage: number;
  }[];
  date: Date | string;
  sales_person: {
    id: string;
    full_name: string;
  };
  is_draft: boolean;
  payment_completed: boolean;
  voided: boolean;
}

export default function SaleDetail({ saleId }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["sale", saleId],
    queryFn: async () => {
      const res = await fetch(`/api/sale-receipt?saleId=${saleId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch sales");
      }
      return res.json() as Promise<SaleDetailData>;
    },
    placeholderData: keepPreviousData,
  });

  const currency = data?.currency.currency_code;
  const total = data?.sale_receipt_items.reduce(
    (sum, current) => sum + current.total_amount,
    0,
  );

  if (!isLoading) {
    return (
      <SaleDetailSkeleton />
    );
  }

  if (!data) return;

  console.log(data?.sale_receipt_items[0].sale_receipt.code);
  return (
    <div className="px-4">
      <div className="mx-auto w-full max-w-sm overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>
            <span className="text-xl font-semibold tracking-widest">
              SALE RECEIPT
            </span>
          </DrawerTitle>
        </DrawerHeader>

        <div className="my-5 h-1 border-b border-gray-300 border-dashed" />
        
          {/* Meta */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="mt-1 text-muted-foreground">
                Receipt #{data?.sale_receipt_items[0].sale_receipt.code}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Date</span>
              {data?.date && (
                <span className="text-muted-foreground">
                  {data?.date && format(new Date(data.date), "PPP")}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Status</span>

              <div className="flex items-center justify-between">
                {!data.is_draft && !data.voided && data.payment_completed && (
                  <Badge className="bg-green-500/10 text-green-500 border border-green-100">
                    Closed{" "}
                  </Badge>
                )}
                {data.is_draft && !data.voided && !data.payment_completed && (
                  <Badge variant={"secondary"}>Open</Badge>
                )}
                {data.voided && <Badge variant={"destructive"}>Voided </Badge>}
              </div>
            </div>
          </div>

          <div className="my-5 h-1 border-b border-gray-300 border-dashed" />

          {/* Items */}
          <div className="space-y-4">
            <h3>
              Items{" "}
              {data?.sale_receipt_items && (
                <span>({data.sale_receipt_items.length})</span>
              )}
            </h3>
            {data?.sale_receipt_items.map(
              ({ id, item, total_amount, unit_price, quantity }) => (
                <div key={id} className="space-y-1 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="max-w-[70%] wrap-break-word font-semibold">
                      {item.name}
                    </span>

                    <span>
                      {currency} {Math.round(total_amount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {(quantity * item.pieces_per_packet).toFixed(0)}
                      {/* {quantity_option}  */}w × {currency}{" "}
                      {(unit_price / item.pieces_per_packet).toFixed(2)}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        
        <div className="my-5 h-1 border-b border-gray-300 border-dashed" />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-base font-semibold">
            <span>TOTAL AMOUNT</span>

            <span>
              {currency} {Math.round(total!)}
            </span>
          </div>
        </div>

        <div className="my-5 h-1 border-b border-gray-300 border-dashed" />
        <div className="flex justify-between mb-10">
          <span>Cashier</span>
          <span>{data?.sales_person.full_name}</span>
        </div>
      </div>
    </div>
  );
}

export function SaleDetailSkeleton() {
  return (
    <DrawerContent aria-describedby={undefined} className="px-4">
      <DrawerHeader className="absolute">
        <DrawerTitle className="absolute text-white">
          sale receipt
        </DrawerTitle>
      </DrawerHeader>
      <div className="mx-auto w-full max-w-sm">
        {/* Header */}
        <div className="space-y-3 py-4">
          <Skeleton className="h-7 w-40 mx-auto" />
        </div>

        <div className="my-5 border-b border-dashed" />

        {/* Summary */}
        <div className="space-y-4">
          <div className="fle3x justify-between">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex justify-between">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        <div className="my-5 border-b border-dashed" />

        {/* Items */}
        <div className="space-y-5">
          <Skeleton className="h-5 w-16" />

          {Array.from({ length: 1 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>

              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        <div className="my-5 border-b border-dashed" />

        {/* Total */}
        <div className="flex justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="my-5 border-b border-dashed" />

        {/* Footer */}
        <div className="mb-10 flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </DrawerContent>
  );
}