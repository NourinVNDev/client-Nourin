import { adminApiRequest } from "../../utils/apiHelper/adminApiHelper";
const AdminLogin=async(formData:{[key:string]:string})=>{
const response=await adminApiRequest('/adminlogin1','POST',formData);
return response.data.message;
}
export {AdminLogin};