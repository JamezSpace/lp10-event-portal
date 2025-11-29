interface PaystackInit {
    status: boolean,
    message: string,
    data: {
        authorization_url: string,
        access_code: string,
        reference: string
    }
}

interface CredoInit {
  status: number,
  message: string,
  data: {
    authorizationUrl: string;
    reference: string;
    credoReference: string;
  },
  execTime: number,
  error: []
}

export type {
    CredoInit,
    PaystackInit
}