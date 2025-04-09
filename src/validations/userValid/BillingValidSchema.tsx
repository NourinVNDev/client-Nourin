export const BillingValidation = async (eventData: any) => {
    // Perform validation and return errors if any
    let errors: any = {};
    
    if (!eventData.firstName) {
      errors.firstName = "First name is required";
    }
    if (!eventData.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!eventData.email || !eventData.email.includes("@")) {
      errors.email = "Valid email is required";
    }
    if (!eventData.phoneNo || isNaN(eventData.phoneNo)) {
      errors.phoneNo = "Valid phone number is required";
    }
    if (!eventData.address) {
      errors.address = "Address is required";
    }
  
    return Object.keys(errors).length ? errors : null;
  };
  