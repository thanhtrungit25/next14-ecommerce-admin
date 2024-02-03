'use client'

import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'

import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface OrderClientProps {
  orders: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
  return (
    <>
      <Heading
        title={`orders (${orders.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable columns={columns} data={orders} searchKey="products" />
    </>
  )
}
export default OrderClient
