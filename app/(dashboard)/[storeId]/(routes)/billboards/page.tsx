import prismadb from '@/prisma/prismadb'
import BillboardClient from './components/client'
import { BillBoardColumn } from './components/columns'
import { format } from 'date-fns'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBillboards: BillBoardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  )
}
export default BillboardsPage
