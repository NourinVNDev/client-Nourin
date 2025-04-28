export type PaymentData = {
  userId:string,
  bookedId:string
  bookingId:string
  categoryName:string,
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    address: string;
    images: string [];
    eventName: string;
    noOfPerson: number;
    noOfDays: number;
    Amount: number;
    companyName:string;
    type:string;
    managerId:string;
    Included:[string];
    notIncluded:[string];
    actualAmount:number;
    bookedMembers:string[];
    location:string;
    amount?:number
   
  };
  export type EventData = {
    _id:string;
    eventName: string;
    title: string;
    content: string;
  address:string;
    startDate: string;
    images:(File|string)[]
    endDate: string;
    time: string; // Required property
    noOfPerson: number;
    amount:number;
    destination: string;
   
    tags: string[]; // Ensure this is an array of strings
    // Ensure this is an array of strings or File objects
  };

  export type  OfferData={
   
    offerName: string;
    discount_on: string;
    discount_value: string;
    startDate: string; 
    endDate: string;  
    item_description: string;

  }


  export type billingData={
    categoryName:string
    userId:string,
    eventId:string,
    firstName:string,
    lastName:string,
    email:string,
    phoneNo:string,
    address:string,
    ticketType:string
  }

  export interface EventDetails {
    _id: string;
    eventName: string;
    companyName: string;
    title: string;
    noOfPerson: number;
    noOfDays: number;
    endDate: string;
    startDate:string;
    amount: number;
    userId: string;
    eventId: string;
    bookingId: string;
    image: string;
    type: string;
    Included: [string],
    notIncluded: [string],
    paymentStatus:string,
    bookedUser:[user:string,isParticipated:boolean]
  }
  


  