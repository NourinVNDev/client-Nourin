import { useEffect } from "react";

interface ManagerListProps {
    managers: string[];
    onSelectManager: (manager: string) => void;
  }
  
  const ManagerUserList = ({ managers, onSelectManager }: ManagerListProps) => {
    useEffect(()=>{
        console.log("Users",managers);
    },[])
    return (
      <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {managers.length > 0 ? (
            managers.map((manager, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg"
              
                onClick={() => {  console.log("Manager clicked:", manager);
                  onSelectManager(manager)
                }}
              >
                {manager}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No managers found.</p>
          )}
        </ul>
      </div>
    );
  };
  
  export default ManagerUserList;
  