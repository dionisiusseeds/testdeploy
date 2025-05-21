import baseAxios from '@/utils/common/axios';
import { type JoinSubscriptionI } from '@/utils/interfaces/subscription.interface';
import { toast } from 'react-toastify';

const subscriptionService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-ali.seeds.finance'
  }/subscription/v1`
);

export const getSubscriptionPlan = async (): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await subscriptionService.get(`/subscription`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getSubscriptionPlanById = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await subscriptionService.get(`/subscription/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getSubscriptionVoucher = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await subscriptionService.get(
      `/subscription/${id}/vouchers`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getSubscriptionStatus = async (): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await subscriptionService.get(`/status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getTransactionHistory = async (): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await subscriptionService.get(`/subscription/history`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};
export const joinSubscription = async (
  data: JoinSubscriptionI
): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    if (accessToken === null || accessToken === '') {
      toast('Access token not found');
    }
    return await subscriptionService.post(`/join`, data, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error: any) {
    await Promise.reject(error);
  }
};

export const stopSubscription = async (): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found', { type: 'error' });
    throw new Error('Access token not found');
  }

  try {
    return await subscriptionService.post('/stop', null, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getAvailableVoucherPlan = async (
  page: number,
  limit: number,
  featureType: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await subscriptionService.get(`/available-vouchers`, {
      params: {
        page,
        limit,
        feature_type: featureType
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};
