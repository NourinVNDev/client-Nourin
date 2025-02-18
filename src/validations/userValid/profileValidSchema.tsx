import * as Yup from "yup";

export const profileValidSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone Number is required"),
  address: Yup.string().required("Address is required"),
});
