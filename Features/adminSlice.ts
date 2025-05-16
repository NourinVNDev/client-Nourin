import {createSlice,PayloadAction} from '@reduxjs/toolkit';
interface adminState{
    email:string|null;
    role:string|null;
}

const initialState:adminState={
    email:null,
    role:null
}

const adminSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{
        setAdminDetails:(state,action:PayloadAction<adminState>)=>{
            state.email=action.payload.email;
            state.role=action.payload.role;

        },
        clearAdminDetails:()=>{
            return initialState;
        }
    }
})
export const {setAdminDetails,clearAdminDetails}=adminSlice.actions;
export default adminSlice.reducer;
