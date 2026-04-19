This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



https://api.serow.app/api/v1/pos/sale-receipts/?q=&page=1&page_size=50&start_date=2026-04-18&end_date=2026-04-18

"results": [
    {
      "id": "af44260b-7f1a-456e-b8bb-4cf01330bdf3",
      "code": "SALR010049601",
      "date": "2026-04-19",
      "created_at": "2026-04-19T08:31:52.981296Z",
      "customer": {
        "id": "f68233ee-13ee-4115-9bf9-3537f1d02472",
        "code": "CUS010000101",
        "name": "cash",
        "payment_term": {
          "id": "6bea765f-7323-4e99-ba1e-e92a8b1f0c09",
          "created_at": "2024-05-29T12:57:02.594453Z",
          "modified_at": "2024-05-29T12:57:02.594481Z",
          "is_active": true,
          "is_deleted": false,
          "name": "Due on Receipt",
          "due_in_days": true,
          "num_of_days": 0,
          "due_by_certain_date": false,
          "date_due": 0,
          "due_end_of_month": false,
          "end_of_month": 0,
          "due_next_month_if_issued_within_days": 0,
          "discounted_days": 0,
          "interest_rate": 0,
          "created_by": null,
          "modified_by": null,
          "company": "b0368789-95e3-426c-a0d5-40cad70292cc"
        },
        "email": "",
        "phone": ""
      },
      "branch": {
        "id": "9f38d120-859a-404b-8e21-74e46c8630b1",
        "name": "Riruta",
        "payment_mode": null
      },
      "profit_percentage": 44.59,
      "currency": {
        "id": "12ec5eb3-b23b-4517-995c-159590c6af25",
        "currency_name": "Kenyan shilling",
        "currency_code": "KES",
        "rate": 1
      },
      "exchange_rate": 1,
      "discount_amount": 0,
      "total_discount_amount": 0,
      "total_net": 160,
      "tax_type": "inclusive",
      "tax_amount": 0,
      "total_cost": 110.66,
      "total_amount": 160,
      "total_price": 160,
      "total_profit": 49.34,
      "no_of_items": 2,
      "is_draft": false,
      "posted_at": "2026-04-19T08:31:53.060176Z",
      "receipt_amount": 0,
      "balance_amount": 160,
      "payment_completed": false,
      "returned_status": "not returned",
      "voided": false,
      "has_attachments": false,
      "order_number": "",
      "sale_channel": null
    },