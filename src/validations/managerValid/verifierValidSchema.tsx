interface VerifierType {
    verifierName: string;
    email: string;
    Events: string[];
 
}

export interface VerifierErrors {
verifierName?:string;
email?:string;
Events?:string
}
export const validateFields = (verifier: VerifierType): VerifierErrors => {
    let validationErrors: VerifierErrors = {};

    if (!verifier.verifierName.trim()) validationErrors.verifierName = "Verifier Name is required";
    if (!verifier.email.trim()) validationErrors.email = "Verifier Email is required";

    if (!verifier.Events || verifier.Events.length === 0) {
        validationErrors.Events = "Please select at least one event.";
      }

    return validationErrors;
};