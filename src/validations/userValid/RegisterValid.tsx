

export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    password: string;
    confirmPassword: string;
}

export const registerValidation = (formData: FormData) => {
    const errors: Record<string, string> = {}; // Define errors object

    // Validate first name
    if (!formData.firstName?.trim()) {
        errors.firstName = "First name is required.";
    } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
        errors.firstName = "First name must contain only letters.";
    }

    // Validate last name
    if (!formData.lastName?.trim()) {
        errors.lastName = "Last name is required.";
    } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
        errors.lastName = "Last name must contain only letters.";
    }

    // Validate email
    if (!formData.email?.trim()) {
        errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    // Validate phone number
    if (!formData.phoneNo?.trim()) {
        errors.phoneNo = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
        errors.phoneNo = "Phone number must be exactly 10 digits.";
    }

    // Validate password
    if (!formData.password) {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
        errors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
        errors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
        errors.password = "Password must contain at least one special character (!@#$%^&*).";
    }
    if (!formData.confirmPassword) {
        errors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }
    return { success: true, errors: {} };
};
