
import React, { useEffect,useState } from 'react';
import NavBar from '../../components/adminComponents/NavBar';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Header from '../../components/adminComponents/Header';
import Footer from '../../components/adminComponents/Footer';
import { fetchUserManagerCountAndRevenue } from '../../service/adminServices/adminDashboard';

const bookingData = [
  { month: "Jan", bookings: 65 },
  { month: "Feb", bookings: 85 },
  { month: "Mar", bookings: 95 },
  { month: "Apr", bookings: 75 },
  { month: "May", bookings: 65 },
  { month: "Jun", bookings: 55 },
  { month: "Jul", bookings: 85 },
  { month: "Aug", bookings: 95 },
  { month: "Sep", bookings: 65 },
  { month: "Oct", bookings: 55 },
  { month: "Nov", bookings: 45 },
  { month: "Dec", bookings: 85 },
];

const pieData = [
  { name: "Event 1", value: 30 },
  { name: "Event 2", value: 25 },
  { name: "Event 3", value: 20 },
  { name: "Event 4", value: 15 },
  { name: "Event 5", value: 10 },
];

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

  },[])
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
          <br /><br /><br /><br /><br />
            <h3 className="font-bold text-black">Booked:</h3>
            <div className="bg-white shadow-md rounded p-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <Bar dataKey="bookings" fill="#FF6B00" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Pie Charts Section */}
          <br /><br /><br /><br /><br />
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
              <h4 className="font-bold mb-4 text-black">Event Participation</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
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





