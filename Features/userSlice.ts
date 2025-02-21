import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define the shape of the user state
interface UserState {
  firstName: string | null;
  lastName:string|null;
  email: string | null;
  phoneNo: string | null;
  Address:string| null;
  profilePhoto:string|null;
  _id:string|null
}

// Initial state
const initialState: UserState = {
    _id:null,
  firstName: null,
  lastName:null,
  email: null,
  phoneNo: null,
  Address:null,
  profilePhoto:null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user details
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      state.firstName = action.payload.firstName;
      state.lastName=action.payload.lastName;
      state.email = action.payload.email;
      state.phoneNo = action.payload.phoneNo;
      state._id=action.payload._id;
      state.Address=action.payload.Address;
      state.profilePhoto=action.payload.profilePhoto;
    },
    // Clear user details
    clearUserDetails: (state) => {
      state.firstName = null;
      state.email = null;
      state.phoneNo = null;
      state.lastName=null;
      state.Address=null;
      state.profilePhoto=null;
    },
    updateAddress: (state, action: PayloadAction<string>) => {
      state.Address = action.payload;
    },
  },
});

// Export actions
export const { setUserDetails, clearUserDetails,updateAddress } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
