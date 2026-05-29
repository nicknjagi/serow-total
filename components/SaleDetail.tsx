"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
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

export default function SaleDetail({ saleId}: Props) {
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

  if (isLoading) {
    return (
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <span className="invisible text-xl font-bold tracking-widest">
              SALE RECEIPT
            </span>
          </DrawerTitle>
          <DrawerDescription
            aria-describedby={undefined}
            className="hidden"
          ></DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto w-full max-w-sm animate-pulse rounded-md bg-gray-200 p-4">
          <div className="h-4 w-3/4 rounded bg-gray-300" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-300" />
          <div className="mt-4 h-48 rounded bg-gray-300" />
        </div>
      </DrawerContent>
    );
  }

  if (!data) return;

  console.log(data?.sale_receipt_items[0].sale_receipt.code);
  return (
    <DrawerContent className="max-w-md px-4">
      <DrawerHeader>
        <DrawerTitle>
          <span className="text-xl font-bold tracking-widest">
            SALE RECEIPT
          </span>
        </DrawerTitle>
        <DrawerDescription className="hidden"></DrawerDescription>
      </DrawerHeader>

      <Separator className="my-4 border-dashed" />

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

      <Separator className="my-4 border-dashed" />

      {/* Items */}
      <div className="space-y-4">
        <h3>Items</h3>
        {data?.sale_receipt_items.map(
          ({
            id,
            item,
            total_amount,
            unit_price,
            quantity,
            quantity_option,
          }) => (
            <div key={id} className="space-y-1 text-sm">
              <div className="flex justify-between gap-2">
                <span className="max-w-[70%] wrap-break-word font-semibold">
                  {item.name}
                </span>

                <span>
                  {currency} {total_amount}
                </span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {(quantity * item.pieces_per_packet).toFixed(0)}
                  {/* {quantity_option}  */}w × {currency}{" "}
                  {(unit_price / item.pieces_per_packet).toFixed(2)}
                </span>

                <span></span>
              </div>
            </div>
          ),
        )}
      </div>

      <Separator className="my-4 border-dashed" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-base font-bold">
          <span>TOTAL AMOUNT</span>

          <span>
            {currency} {Math.round(total!)}
          </span>
        </div>
      </div>

      <Separator className="my-4 border-dashed" />
      <div className="flex justify-between mb-8">
        <span>Cashier</span>
        <span>{data?.sales_person.full_name}</span>
      </div>
    </DrawerContent>
  );
}
