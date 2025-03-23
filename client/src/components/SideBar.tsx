import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { InvestmentType, UserDataType } from "../types/type";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Mock user data
const userData: UserDataType = {
  username: "User 1",
  investmentBudget: 3000,
  riskTaking: "low",
  gains: "Short Term Gains",
};

const SideBar = () => {
  return (
    <div className="w-1/4 h-[100%] bg-gray-100 shadow-lg  justify-between">
      <aside className=" p-6 flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-4">User Details</h2>
        <div className="space-y-3">
          <h1 className="text-lg font-semibold text-gray-700">
            Username: <span className="font-normal">{userData.username}</span>
          </h1>
          <p className="text-gray-600">
            Budget: <span className="font-medium">${userData.investmentBudget.toLocaleString()}</span>
          </p>
          <p className="text-gray-600">
            Risk Taking: <span className="font-medium">{userData.riskTaking}</span>
          </p>
          <p className="text-gray-600">
            Return Preferred: <span className="font-medium">{userData.gains}</span>
          </p>
        </div>

        {/* New Advice Button */}
        <div className="mt-6">
          <button className="py-3 w-full flex justify-center items-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            New Advice
          </button>
        </div>
        <div className="mt-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Current Advice</h1>
          <h2 className="text-green-700 font-bold">
        <p>Tata Power - 2000</p><br/>
        <p>Tata Steel - 1000</p>

          </h2>
        </div>
      </aside>
    </div>
    
  );
};

export default SideBar;