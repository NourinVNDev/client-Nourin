import ADMIN_API from "../../utils/adminAxiosIntance";
const AdminLogin=async(formData:{[key:string]:string})=>{
    console.log("sudden");
    
    try{
        console.log("Data checking",formData);
        

const response = await ADMIN_API('/adminlogin1', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data:formData
});
const data=response.data.data.message;
console.log("hai",data);
return data;
}catch(error){
console.error("Error during User Login:", error);
return undefined; 
}





}
export {AdminLogin};