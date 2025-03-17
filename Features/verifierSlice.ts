import {createSlice,PayloadAction} from '@reduxjs/toolkit';
interface VerifierState{
    companyName:string|null;
}
const initialState:VerifierState={
    companyName:null
}
const verifierSlice=createSlice({
    name:'verifier',
    initialState,
    reducers:{
        setVerifierDetails:(state,action:PayloadAction<VerifierState>)=>{
            state.companyName=action.payload.companyName
        },
        clearVerifierDetails:()=>{
            return initialState
        }
    }

})
export const {setVerifierDetails,clearVerifierDetails}=verifierSlice.actions;
export default verifierSlice.reducer;