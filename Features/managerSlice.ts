import {createSlice,PayloadAction} from '@reduxjs/toolkit'
interface ManagerState {
    companyName: string | null;
    email: string | null;
    _id:string|null
    role:string|null
  }


const initialState:ManagerState={
    _id:null,
    companyName:null,
    email:null,
    role:null
}
const ManagerSlice=createSlice({
    name:'manager',
    initialState,
    reducers:{
        setManagerDetails:(state,action:PayloadAction<ManagerState>)=>{
            state.companyName=action.payload.companyName;
            state.email=action.payload.email;
            state._id=action.payload._id;
            state.role=action.payload.role;
        },
        clearManagerDetails:(state)=>{
            console.log("Maahn checking");
            
         return initialState
        }
    }
});

export const {setManagerDetails,clearManagerDetails}=ManagerSlice.actions;
export default ManagerSlice.reducer;