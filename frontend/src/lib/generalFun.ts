import type { ApiErrorResponse } from "@/features/common-type";
import type { AxiosError } from "axios";

// comment functions for error handling, formatting, etc.
export function formatErrorMessage(error: AxiosError, defaultMessage = "Something went wrong"): string {
    const errorData = error.response?.data as ApiErrorResponse;
    console.log("Error data:", errorData);
    if (errorData?.errors) {
        if (Array.isArray(errorData.errors)) {
            return errorData.errors.join(", "); // Join array of error messages
        } else if (typeof errorData.errors === "object") {
            const messages = [];
            for (const [key, value] of Object.entries(errorData.errors)) {
                if (Array.isArray(value)) {
                    messages.push(`${key}: ${value.join(", ")}`); // Join array of messages for each key
                } else {
                    messages.push(`${key}: ${value}`); // Single message for the key
                }
            }
            return messages.join(", ");
        }
    }

    // If no errors array, return the message or default message
    return errorData?.message || defaultMessage;
}