import { Users, Laptop, Video, MoreHorizontal } from 'lucide-react';
import { getCategoryDataDetails } from '../../service/userServices/register';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const features = [
  { icon: Users, title: 'In-person', description: 'Built Wicket longer admire do barton vanity itself do in it.' },
  { icon: Laptop, title: 'Hybrid', description: 'Engrossed listening. Park gate sell they west hard for the.' },
  { icon: Video, title: 'Virtual', description: 'Barton vanity itself do in it. Preferd to men it engrossed listening.' },
  { icon: MoreHorizontal, title: 'Others', description: 'We deliver outsourced aviation services for military customers' },
];

export default function Features() {
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryDescriptions, setCategoryDescriptions] = useState<string[]>([]);
  const [categoryId,setCategoryId]=useState<string[]>([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const result = await getCategoryDataDetails();
        console.log("Wait", result);

        // Separate category names and descriptions
        const categoryIdArray=result.map((res:any)=>res._id);
        const categoryNamesArray = result.map((res: any) => res.categoryName);
        const categoryDescriptionsArray = result.map((res: any) => res.Description);
      
        // Set state for category names and descriptions
        setCategoryId(categoryIdArray);
        setCategoryNames(categoryNamesArray);
        setCategoryDescriptions(categoryDescriptionsArray);
    
        console.log("Hello",categoryId);
        

      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchCategoryDetails();
  }, []); // Add empty dependency array to run the effect only once

  const handleEventTypeDetails = async (categoryId: string) => {
    console.log("Fetching event data...",categoryId);
    console.log(`Category clicked: ${categoryId}`);
  
   
    
    // console.log('From Component:', result);
      navigate(`/user/categoryBasedData/${categoryId}`);

  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">We Offer Best Valuable Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryNames.map((category, index) => {
            const feature = features[index % features.length]; // Cycle through features
            const description = categoryDescriptions[index]; // Access corresponding description
            const catId=categoryId[index];
            
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-center"
              >
                <feature.icon className="w-16 h-16 text-blue-600 mx-auto mb-6 transition-transform transform hover:scale-110" />
                <h3
                
                  className="text-2xl font-semibold text-gray-900 mb-3 cursor-pointer"
                >
                  {category}
                </h3>
             
  <p onClick={() => handleEventTypeDetails(catId)}>{catId}</p>



                <p className="text-lg text-gray-700">
                  {description} 
                </p>
             
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}




