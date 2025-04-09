import { useEffect } from "react";

interface ManagerListProps {
  managers: string[];
  events: string[];
  onSelectManager: (manager: string,event:string) => void;
  person: string;
}

const ManagerUserList = ({ managers, events, onSelectManager, person }: ManagerListProps) => {
  useEffect(() => {
    console.log("Users", managers,events);
  }, [managers,events]); // Ensure effect runs when managers update

  return (
    <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
      <h2 className="text-xl font-bold mb-4">{person}</h2>
      <ul className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {managers.length > 0 && events.length > 0 ? (
          [...new Set(managers)].map((manager) =>
            [...new Set(events)].map((event) => (
              <li
                key={`${manager}-${event}`} // Ensures uniqueness
                className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg"
                onClick={() => {
                  console.log("Manager clicked:", manager);
                  onSelectManager(manager,event);
                }}
              > {event ? event : manager}
              </li>
            ))
          )
        ) : (
          <p className="text-gray-500">No managers or events found.</p>
        )}
      </ul>
    </div>
  );
};

export default ManagerUserList;
