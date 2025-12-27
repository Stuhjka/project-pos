import react from 'react'
import BottomNav from '../components/shared/BottomNav'
import Halo from '../components/Home/Halo'
import Minicard from '../components/Home/MiniCard'
import { BsCashCoin } from 'react-icons/bs'
import { GrInProgress } from 'react-icons/gr'
import RecentOrders from '../components/Home/RecentOrders'
import PopularDishes from '../components/Home/PopularDishes'
import { getDashboardCashier } from '../https'
import { keepPreviousData, useQuery } from '@tanstack/react-query'


const Home = () => {
  const { data: resData, isLoading } = useQuery({
    queryKey: ["dashboard-cashier"],
    queryFn: getDashboardCashier,
    placeholderData: keepPreviousData,
  });

  const dashboardData = resData?.data?.data ? { ...resData.data.data } : {};

  return (
    <section className="bg-[#1f1f1f] h-full overflow-hidden flex gap-3">
      {/*left div*/}
      <div className="flex-[3] flex flex-col">
        <Halo />
        <div className="flex items-center w-full gap-3 px-8 mt-8">
          <Minicard title="Total Earnings" icon={<BsCashCoin />} number={dashboardData?.totalEarnings ? dashboardData?.totalEarnings : 0}
            isLoading={isLoading} />
          <Minicard title="Total Order" icon={<GrInProgress />} number={dashboardData?.totalOrders ? dashboardData?.totalOrders : 0}
            isLoading={isLoading} />
        </div>
        <div className='flex-1 min-h-0'>
          <RecentOrders />
        </div>
      </div>
      {/*right div*/}
      <div className="flex-[2] min-h-0">
        <PopularDishes />
      </div>
    </section>
  )
}

export default Home