import SideBar from "../components/SideBar"
import {BarChart, LineChart, PieChart} from "../components/charts"

const Dashboard = () => {
     return (
        <div className="flex flex-row min-h-screen bg-gray-50">
          {/* Sidebar Section */}
          <div className="w-1/2 h-full bg-gray-100 shadow-lg">
            <SideBar />
          </div>
    
          {/* Charts Section */}
          <div className="w-1/2 flex flex-col justify-center items-center p-6 space-y-6 overflow-auto">
            <div className="w-full max-w-2xl">
              <BarChart />
            </div>
            <div className="w-full max-w-2xl">
              <PieChart />
            </div>
            <div className="w-full max-w-2xl">
              <LineChart />
            </div>
          </div>
        </div>
      );
    };
    

export default Dashboard