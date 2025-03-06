import * as Yup from 'yup';

export const  eventValidSchema = Yup.object({
  
  eventName: Yup.string().required("Event name is required"),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  location: Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
  }).required("Location is required"),
  startDate: Yup.date()
  .required("Start date is required")
  .transform((originalValue) => (originalValue ? new Date(originalValue) : null))
  .min(new Date(), "Start date must be in the future"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  tags: Yup.array().of(Yup.string().required()).min(1, "At least one tag is required"),
  images: Yup.array().of(Yup.mixed().required("File is required")).min(1, "At least one image is required").required("At least one image is required"),
  noOfPerson: Yup.number().min(1, "Must be at least 1 person").required("Number of persons is required"),
  // noOfDays: Yup.number().min(1, "Must be at least 1 day").required("Number of days is required"),
  destination: Yup.string().required("Destination is required"),
  Included: Yup.array().of(Yup.string().required()).min(1, "At least one included item is required"),
  notIncluded: Yup.array().of(Yup.string().required()).min(1, "At least one not included item is required"),
  Amount: Yup.number().min(1, "Amount must be a positive number").required("Amount is required"),
});


export interface eventFormValues {
    _id:string;
    eventName: string;
    title: string;
    content: string;
    location: {
      address: string;
      city: string;
    };
    startDate: string; // Consider using Date type if you want to handle dates directly
    endDate: string;   // Same as above
    time: string;
    tags: string[];    // Specify the type for tags
    images: (File | string)[]; // Include both File and string types for images
    noOfPerson: number;
    destination: string;
    Included: string[]; // Specify the type for Included items
    notIncluded: string[]; // Specify the type for Not Included items
    Amount: number;
  }