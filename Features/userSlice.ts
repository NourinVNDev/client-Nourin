import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  firstName: string | null;
  lastName:string|null;
  email: string | null;
  phoneNo: string | null;
  Address:string| null;
  profilePhoto:string|null;
  _id:string|null,
  location: {  coordinates: [number, number] };
  role:string|null
}


interface LoginAuthState{
  firstName:string|null;
  lastName:string|null;
  email:string|null;
}
const initialState: UserState = {
    _id:null,
  firstName: null,
  lastName:null,
  email: null,
  phoneNo: null,
  Address:null,
  profilePhoto:null,
  location:{coordinates:[0,0]},
  role:null
};



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUserDetails: (state, action: PayloadAction<UserState>) => {
      state.firstName = action.payload.firstName;
      state.lastName=action.payload.lastName;
      state.email = action.payload.email;
      state.phoneNo = action.payload.phoneNo;
      state._id=action.payload._id;
      state.Address=action.payload.Address;
      state.profilePhoto=action.payload.profilePhoto;
      state.location = action.payload.location; 
      state.role=action.payload.role
    },

    clearUserDetails: () => {
      return initialState
    },
    updateAddress: (state, action: PayloadAction<string>) => {
      state.Address = action.payload;
    },
    setLoginAuthentication:(state, action: PayloadAction<LoginAuthState>)=>{
    
      state.firstName=action.payload.firstName;
      state.lastName=action.payload.lastName;
      state.email=action.payload.email;

    },
    updateAddressPhone:(state, action: PayloadAction<string>) => {
      state.Address = action.payload;
    },
  },
});


export const { setUserDetails, clearUserDetails,updateAddress,setLoginAuthentication,updateAddressPhone} = userSlice.actions;


export default userSlice.reducer;
