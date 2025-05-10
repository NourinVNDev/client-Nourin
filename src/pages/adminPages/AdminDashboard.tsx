
import React, { useEffect,useState } from 'react';
import NavBar from '../../components/adminComponents/NavBar';
import { LineChart, Line,XAxis,YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Header from '../../components/adminComponents/Header';
import Footer from '../../components/adminComponents/Footer';
import { fetchUserManagerCountAndRevenue ,fetchAdminDashboardGraphData,fetchPieChatData} from '../../service/adminServices/adminDashboard';



const COLORS = ["#FF6B00", "#36A2EB", "#4BC0C0", "#FF5252", "#9966FF"];

const DashboardPage: React.FC = () => {
    const [dash, setDash] = useState({ userCount: 0,managerCount:0, revenue: 0 });
  useEffect(()=>{
    const fetchUserManagerAndRevenue = async () => {
   
        const result = await fetchUserManagerCountAndRevenue();
        if (result.result.message ==='Manager User count fetched') {
     
          
          setDash({
            userCount: result.result.user.user,
            managerCount:result.result.user.manager,
            revenue: result.result.user.revenue,
          });
        
      }
    };
    fetchUserManagerAndRevenue();

  },[]);
    const [selectedTime, setSelectedTime] = useState("Yearly");
    const [selectedType, setSelectedType] = useState("Booking");
    const [graphData, setGraphData] = useState([]);
    const [pieData,setPieData]=useState([]);
    const [pieData1,setPieData1]=useState([]);
  
    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedTime(event.target.value);
    };
  
    const handleTypeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedType(event.target.value);
  
    };

    useEffect(() => {
      const fetchData = async () => {
       
          const result = await fetchAdminDashboardGraphData( selectedType, selectedTime);
          if (result?.message === 'Graph data fetched successfully') {
            setGraphData(result.data);
          }
        
      };
      fetchData();
    }, [ selectedType, selectedTime]);
    useEffect(() => {
      const fetchPieChat = async () => {
        const result = await fetchPieChatData();
        console.log("Result of Pie chart", result);
    
        if (result.message === 'Top events and top agencies retrieved') {
          const formatted = result.data.topEvents.map((item: any) => ({
            name: item.eventName,   
            value: item.noOfBookings, 
          }));
          setPieData(formatted);
          const formatted1 = result.data.topAgencies.map((item: any) => ({
            name: item.agencyName,  
            value: item.noOfEvents,  
          }));
          setPieData1(formatted1);
        }
      };
    
      fetchPieChat();
    }, []);
    


    const chartData = graphData;
    const chartKey = selectedType === "Booking" ? "bookings" : "revenue";
    const allWeeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
    const normalizedData =
      selectedTime === 'Monthly'
        ? allWeeks.map((week) => {
          const found = chartData.find((d: any) => d.week === week);
          return (
            found || {
              week,
              [chartKey]: 0,
            }
          );
        })
        : chartData;
  
  return (
    <div className="w-screen h-screen flex flex-col bg-white">
  
    <Header/>

      <div className="flex flex-1 w-full">
    
        <NavBar/>
      

        <main className="flex-1 bg-white p-8 space-y-12 overflow-hidden">
       
          <br />
          <div className="flex justify-between mb-8 space-x-8">
            <div className="bg-blue-100 p-4 rounded shadow-md w-1/4 text-center">
              <h2 className="font-bold text-black">Users</h2>
              <p className="text-2xl text-black">{dash.userCount}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded shadow-md w-1/4 text-center">
              <h2 className="font-bold text-black">Managers</h2>
              <p className="text-2xl text-black">{dash.managerCount}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded shadow-md w-1/4 text-center">
              <h2 className="font-bold text-black">Revenue</h2>
              <p className="text-2xl text-black">₹{dash.revenue}</p>
            </div>
          </div>
     

     
          <section className="space-y-8">
          <h3 className="font-bold text-black text-2xl mb-4">Statistics</h3>
          <div className="bg-white p-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0 justify-end">
                <label htmlFor="time-select" className="text-black font-medium">Time Range:</label>
                <select
                  id="time-select"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className="rounded px-4 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
          <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={normalizedData}>
                      <XAxis
                        dataKey={selectedTime === 'Monthly' ? 'week' : 'month'}
                        stroke="#8884d8"
                        tick={{ fontSize: 12, fill: '#333' }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#333' }} />
                <Tooltip
                     contentStyle={{
                       backgroundColor: '#f9f9f9',
                       border: '1px solid #ccc',
                       fontSize: 14,
                       color: '#333',
                     }}
                   />
                   <Line
                     type="monotone"
                     dataKey={chartKey}
                     stroke="#FF6B00"
                     strokeWidth={3}
                     dot={false} 
                     activeDot={{ r: 6 }} 
                     isAnimationActive={false}
                   />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-8 justify-center text-black mt-4">
                <label className="flex items-center cursor-pointer gap-2 text-lg font-semibold hover:text-blue-600 transition">
                  <input
                    type="radio"
                    value="Booking"
                    checked={selectedType === "Booking"}
                    onChange={handleTypeChange}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span>Booking</span>
                </label>
                <label className="flex items-center cursor-pointer gap-2 text-lg font-semibold hover:text-blue-600 transition">
                  <input
                    type="radio"
                    value="Revenue"
                    checked={selectedType === "Revenue"}
                    onChange={handleTypeChange}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span>Revenue</span>
                </label>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-2 gap-8">
            <div className="bg-white shadow-md rounded p-4 h-60">
              <h4 className="font-bold mb-4 text-black">Top Events</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white shadow-md rounded p-4 h-60">
              <h4 className="font-bold mb-4 text-black">Top Company</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData1}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
          <br /><br /><br /><br /><br />
        </main>
      </div>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default DashboardPage;





