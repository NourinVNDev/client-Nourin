import * as Yup from "yup";

export const offerValidSchema = Yup.object({
  offerName: Yup.string().required("Offer Name is required"),
  discount_on: Yup.string().required("Discount On is required"),
  discount_value: Yup.number()
    .min(0, "Discount must be at least 0%")
    .max(90, "Discount cannot exceed 90%")
    .required("Discount Value is required"),
  startDate: Yup.date().required("Start Date is required")
  .transform((_, originalValue) => (originalValue ? new Date(originalValue) : null))
  .min(new Date(), "Start date must be in the future"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End Date must be after Start Date")
    .required("End Date is required"),
  item_description: Yup.string().required("Item Description is required"),
});



export interface OfferFormValues {
  offerName: string;
  discount_on: string;
  discount_value: string;
  startDate: string;
  endDate: string;
  item_description: string;
}
