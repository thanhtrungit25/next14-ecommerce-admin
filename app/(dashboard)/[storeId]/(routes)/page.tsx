import prismadb from '@/prisma/prismadb'

interface DashBoardPageProps {
  params: { storeId: string }
}

const DashBoardPage: React.FC<DashBoardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  })

  return <div>DashBoardPage: {store?.name}</div>
}
export default DashBoardPage
