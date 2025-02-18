import {createSlice,PayloadAction} from '@reduxjs/toolkit'
interface ManagerState {
    companyName: string | null;
    email: string | null;
    _id:string|null
  }


const initialState:ManagerState={
    _id:null,
    companyName:null,
    email:null
}
const ManagerSlice=createSlice({
    name:'manager',
    initialState,
    reducers:{
        setManagerDetails:(state,action:PayloadAction<ManagerState>)=>{
            state.companyName=action.payload.companyName;
            state.email=action.payload.email;
            state._id=action.payload._id;
        },
        clearManagerDetails:(state)=>{
            state.companyName=null;
            state.email=null;
            state._id=null;
        }
    }
});

export const {setManagerDetails,clearManagerDetails}=ManagerSlice.actions;
export default ManagerSlice.reducer;