export interface IGetOtp {
  method: string;
  phoneNumber: string;
}

export interface IVerifyOtp {
  otp: string;
  msisdn: string;
  method: string;
  pinId?: string;
}

export interface IChangePasswordPayload {
  email?: string;
  phoneNumber?: string;
  password: string;
}
