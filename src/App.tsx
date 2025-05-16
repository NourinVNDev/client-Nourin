

import './App.css'
import MainRouter from './routers/MainRouter'
import { useDispatch } from 'react-redux'
import React from 'react'
import { setAxiosDispatch as setUserAxiosDispatch } from './utils/axiosInstance';
import { setAxiosDispatch as setManagerAxiosDispatch } from './utils/managerAxiosInstance';
 import { setAxiosDispatch as setAdminAxiosDispatch } from './utils/adminAxiosIntance';
import { setAxiosDispatch as setVerifierAxiosDispatch } from './utils/verifierAxiosInstance';
 



const App:React.FC=()=>{
    const dispatch = useDispatch();
     React.useEffect(() => {
    // Pass dispatch to each axios instance
    setUserAxiosDispatch(dispatch);
    setManagerAxiosDispatch(dispatch);
    setAdminAxiosDispatch(dispatch);
    setVerifierAxiosDispatch(dispatch);
  }, [dispatch]);
  return(
    <div>
      <MainRouter/>
    </div>
  )
 
}

export default App
