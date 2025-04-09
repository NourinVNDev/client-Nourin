import {createSlice,PayloadAction} from '@reduxjs/toolkit';
interface VerifierState{
    email:string|null;
    companyName:string|null;
}
const initialState:VerifierState={
    email:null,
    companyName:null
}
const verifierSlice=createSlice({
    name:'verifier',
    initialState,
    reducers:{
        setVerifierDetails:(state,action:PayloadAction<VerifierState>)=>{
            state.email=action.payload.email
            state.companyName=action.payload.companyName
        },
        clearVerifierDetails:()=>{
            return initialState
        }
    }

})
export const {setVerifierDetails,clearVerifierDetails}=verifierSlice.actions;
export default verifierSlice.reducer;