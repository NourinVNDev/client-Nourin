import * as Yup from 'yup'
export const eventValidSchema2=Yup.object({
      Included: Yup.array().of(Yup.string().required()).min(1, "At least one included item is required"),
  notIncluded: Yup.array().of(Yup.string().required()).min(1, "At least one not included item is required"),
  Amount: Yup.number().min(1, "Amount must be a positive number").required("Amount is required"),
  types: Yup.string().required("Types of Ticket is required"),
  noOfSeats: Yup.number().min(1, "No Of  Seats must be a positive number").required("Number of seats is required"),

})

export interface eventFormValues2{
    Included: string[]; // Specify the type for Included items
    notIncluded: string[]; // Specify the type for Not Included items
    Amount: number[];
    noOfSeats:number[];
    types:string[]
    _id:string[]
}