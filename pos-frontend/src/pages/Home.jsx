import react from 'react'
import BottomNav from '../components/shared/BottomNav'
import Halo from '../components/Home/Halo'
import Minicard from '../components/Home/Minicard'
import { BsCashCoin } from 'react-icons/bs'
import { GrInProgress } from 'react-icons/gr'
import RecentOrders from '../components/Home/RecentOrders'
import PopularDishes from '../components/Home/PopularDishes'


const Home = () => {
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
    {/*left div*/}
    <div className="flex-[3]">
      <Halo />
      <div className="flex items-center w-full gap-3 px-8 mt-8">
        <Minicard title="Total Earnings" icon={<BsCashCoin />} number={512000}
        footerNum={1.6}/>
        <Minicard title="In Progress" icon={<GrInProgress />} number={16}
        footerNum={3.6}/>
      </div>
      <div>
        <RecentOrders />
      </div>
    </div>
    {/*right div*/}
    <div className="flex-[2]">
      <PopularDishes />
    </div>
    <BottomNav />
    </section>
    )
}

export default Home