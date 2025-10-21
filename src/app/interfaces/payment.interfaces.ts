export interface FlutterwaveCallbackResponse {
    amount: number,
    currency: string,
    flw_ref: string,
    status: string,
    tx_ref: string,
    transaction_id: number,
    customer?: {
        name: string,
        email: string,
        phone_number: string
    }
}

export interface PaystackInit {
    status: boolean,
    message: string,
    data: {
        authorization_url: string,
        access_code: string,
        reference: string
    }
}