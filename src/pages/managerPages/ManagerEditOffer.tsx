import toast from "react-hot-toast";
import { useFormik } from "formik";
import { offerValidSchema, OfferFormValues } from "../../validations/managerValid/offerValidSchema";
import { updateOffer, getSpecificOffer } from "../../service/managerServices/handleOfferService";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import DatePicker from "react-datepicker";

const ManagerEditOffer = () => {
    const navigate = useNavigate();
    const { offerId } = useParams();
    const managerId = useSelector((state: RootState) => state.manager._id);
    const formik = useFormik<OfferFormValues>({
        initialValues: {
            offerName: "",
            discount_on: "",
            discount_value: "",
            startDate: "",
            endDate: "",
            item_description: "",
        },
        validationSchema: offerValidSchema,
        onSubmit: async (values) => {
            try {
                console.log("Puzzle", values.discount_value);


                const formattedValues = {
                    ...values,
                    discount_value: String(values.discount_value)
                };

                console.log("Discount value before submit:", values.discount_value);



                const result = await updateOffer(formattedValues);
                if (result?.message === "Offers Updated successfully") {
                    toast.success("Offer updated successfully!");
                    navigate("/manager/offer");
                } else {
                    toast.error(result?.message || "Failed to update offer");
                }
            } catch (error) {
                console.error("Error updating offer:", error);
                toast.error("An error occurred while updating the offer.");
            }
        },
    });
    useEffect(() => {
        const fetchOffer = async () => {
            if (!offerId || !managerId) return;

            try {

                const result = await getSpecificOffer(offerId, managerId);
                console.log("Resss:", result.data.data);

                if (result?.data?.data?.result) {
                    const offerData = result.data.data.result;
                    console.log("OfferData:", offerData);

                    formik.setValues({
                        offerName: offerData.offerName,
                        discount_on: offerData.discount_on || "",
                        discount_value: offerData.discount_value || 0,
                        startDate: offerData.startDate ? offerData.startDate.split("T")[0] : "",
                        endDate: offerData.endDate ? offerData.endDate.split("T")[0] : "",
                        item_description: offerData.item_description || "",
                    });
                }


            } catch (error) {
                console.error("Error fetching offer:", error);
                toast.error("Failed to load offer data");
            }
        };

        fetchOffer();
    }, [offerId]);
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <div className="flex-1 p-5">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-black">Edit Offer</h2>
                    <form
                        onSubmit={formik.handleSubmit}
                        className="bg-white p-6 rounded shadow-md max-w-lg mx-auto"
                    >
                        {/* Offer Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Offer Name</label>
                            <input
                                type="text"
                                name="offerName"
                                value={formik.values.offerName}
                                onChange={formik.handleChange}
                                className="mt-1 p-2 w-full border rounded bg-white text-black"
                                placeholder="Enter offer name"
                            />
                            {formik.touched.offerName && formik.errors.offerName && (
                                <p className="text-red-500 text-sm">{formik.errors.offerName}</p>
                            )}
                        </div>

                        {/* Discount On */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Discount On</label>
                            <select
                                disabled
                                name="discount_on"
                                value={formik.values.discount_on}
                                onChange={formik.handleChange}
                                className="w-full p-2 border rounded text-black bg-white"
                            >
                                <option value={formik.values.discount_on}>
                                    {formik.values.discount_on || "Select"}
                                </option>
                            </select>
                            {formik.touched.discount_on && formik.errors.discount_on && (
                                <p className="text-red-500 text-sm">{formik.errors.discount_on}</p>
                            )}
                        </div>


                        {/* Discount Value */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Discount Value (%)</label>
                            <input
                                type="number"
                                name="discount_value"
                                value={formik.values.discount_value}
                                onChange={formik.handleChange}
                                className="mt-1 p-2 w-full border rounded bg-white text-black"
                                placeholder="Enter discount value"
                            />
                            {formik.touched.discount_value && formik.errors.discount_value && (
                                <p className="text-red-500 text-sm">{formik.errors.discount_value}</p>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <DatePicker
                                    className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                                    selected={formik.values.startDate ? new Date(formik.values.startDate) : null}
                                    onChange={(date) => formik.setFieldValue("startDate", date)} // Update formik value
                                    dateFormat="dd-MM-yyyy"

                                />
                                {formik.touched.startDate && formik.errors.startDate && (
                                    <p className="text-red-500 text-sm">{formik.errors.startDate}</p>
                                )}
                            </div>

                            {/* End Date */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <DatePicker
                                    className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                                    selected={formik.values.endDate ? new Date(formik.values.endDate) : null}
                                    onChange={(date) => formik.setFieldValue("endDate", date)} // Update formik value
                                    dateFormat="dd-MM-yyyy"

                                />
                                {formik.touched.endDate && formik.errors.endDate && (
                                    <p className="text-red-500 text-sm">{formik.errors.endDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Item Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Item Description</label>
                            <textarea
                                name="item_description"
                                value={formik.values.item_description}
                                onChange={formik.handleChange}
                                className="mt-1 p-2 w-full border rounded bg-white text-black"
                                placeholder="Enter description"
                            />
                            {formik.touched.item_description && formik.errors.item_description && (
                                <p className="text-red-500 text-sm">{formik.errors.item_description}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
                                Edit Offer
                            </button>
                        </div>
                    </form>
                </div>

            </div>


            <Footer />
        </div>
    )
}
export default ManagerEditOffer;