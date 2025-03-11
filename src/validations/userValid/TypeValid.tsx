export type PaymentData = {
  userId:string,
  bookedId:string
  categoryName:string,
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: number;
    address: string;
    images: string [];
    eventName: string;
    location: {
      address: string;
      city: string;
    };
    noOfPerson: number;
    noOfDays: number;
    Amount: number;
    companyName:string
  };
  export type EventData = {
    _id:string;
    eventName: string;
    title: string;
    content: string;
    location: {
      address: string;
      city: string;
    };
    startDate: string;
    images:(File|string)[]
    endDate: string;
    time: string; // Required property
    noOfPerson: number;

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
    phoneNo:number,
    address:string
  }
  


  