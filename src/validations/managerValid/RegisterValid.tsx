export interface FormData {
    firmName: string;
    email: string;
    experience:string;
    phoneNo: string;
    password: string;
    confirmPassword: string;
}export const registerValidationFormanager = (formData: FormData): string[] => {
    const errors: string[] = [];

    if (!formData.firmName.trim()) {
        errors.push("Organization Name is required.");
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firmName)) {
        errors.push("Organization Name must contain only letters.");
    }

    if (!formData.email.trim()) {
        errors.push("Email is required.");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.push("Please enter a valid email address.");
    }

    if (!formData.experience.trim()) {
        errors.push("Years of Experience is required.");
    } else if (!/^\d+$/.test(formData.experience)) {
        errors.push("Years of Experience must be a number.");
    }

    if (!formData.phoneNo.trim()) {
        errors.push("Phone number is required.");
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
        errors.push("Phone number must be exactly 10 digits.");
    }

    if (!formData.password) {
        errors.push("Password is required.");
    } else if (formData.password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    } else if (!/[A-Z]/.test(formData.password)) {
        errors.push("Password must contain at least one uppercase letter.");
    } else if (!/[a-z]/.test(formData.password)) {
        errors.push("Password must contain at least one lowercase letter.");
    } else if (!/[0-9]/.test(formData.password)) {
        errors.push("Password must contain at least one number.");
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
        errors.push("Password must contain at least one special character (!@#$%^&*).");
    }

    if (!formData.confirmPassword) {
        errors.push("Confirm password is required.");
    } else if (formData.password !== formData.confirmPassword) {
        errors.push("Passwords do not match.");
    }

    return errors;
};


export interface BookingData{
    eventId:string,
    userId:string,
    paymentStatus:string,
    categoryId:string,
    bookingDate:string,
    totalAmount:number,
    billingDetails:{
        firstName:string,
        lastName:string,
        email:string,
        phoneNo:string,
        address:string
    },
    NoOfPerson:string,

}
