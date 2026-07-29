import { callSpeedAPIInterface } from "@/utils/index";
import type { ICreatePaymentBody } from "@/types/index";
import type { ICreatePaymentResponse } from "@/types/utils";

export async function createPayment() {
    try {
        const response = await callSpeedAPIInterface<
            ICreatePaymentResponse,
            ICreatePaymentBody
        >("POST", "/payments", {
            currency: "USD",
            amount: 1,
            target_currency: "SATS",
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
