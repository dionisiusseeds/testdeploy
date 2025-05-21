import { type FormData } from '@/pages/nft/create';
import baseAxios from '@/utils/common/axios';
import { type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';



interface NftData {
  data: Data[];
  metadata: Metadata;
}

interface NftDataTrans {
  data: TransData[];
  metadata: MetadataTrans;
}

export interface Data {
  id: string;
  name: string;
  description: string;
  metadata_cid: string;
  image_url: string;
  status: string;
  price: number;
  owner: User;
  creator: User;
}

export interface TransData {
  id: string;
  nft_id: string;
  price: number;
  owner: User;
  creator: User;
  transaction_date: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  wallet_address: string;
}

interface Metadata {
  total: number;
  current_page: number;
  limit: number;
  total_page: number;
}

export interface MetadataTrans {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

const nftService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-ali.seeds.finance'}/nft/`
);

export const connectSeeds = async (formData: {
  wallet_address: string;
}): Promise<string | AxiosResponse<any, any> | undefined> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const body = JSON.stringify(formData);

    const response = await nftService.post('diamante/connect', body, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast.error(
      `${
        error.status === 400
          ? 'This wallet address is taken. Please use another one'
          : String(error.response.data.message)
      }`
    );
  }
};

export const getUserAddress = async (): Promise<
  string | { wallet_address: string }
> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await nftService.get('diamante/wallet', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error: any) {
    return error;
  }
};

export const getNftList = async (params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  lowestPrice?: number;
  highestPrice?: number;
  sort?: 'created_asc' | 'created_desc' | 'price_asc' | 'price_desc';
}): Promise<NftData> => {
  return await nftService.get('all', {
    params: {
      ...params,
      lowest_price: params.lowestPrice,
      highest_price: params.highestPrice
    },
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getNftUser = async (
  id: string,
  params: {
    page: number;
    limit: number;
    search?: string;
    sort?: 'created_asc' | 'created_desc' | 'price_asc' | 'price_desc';
  }
): Promise<NftData> => {
  return await nftService.get(`user/${id}`, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getNftById = async (id: string): Promise<Data> => {
  return await nftService.get(id, {
    headers: {
      Accept: 'application/json'
    }
  });
};
export const getNftTransaction = async (
  id: string,
  params: {
    page: number;
    limit: number;
  }
): Promise<NftDataTrans> => {
  return await nftService.get(`${id}/transactions`, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};

export const createNft = async (
  formData: FormData
): Promise<string | AxiosResponse<any, any> | unknown> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const body = JSON.stringify(formData);

    const response = await nftService.post('create', body, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error) {
    throw new Error(`${String(error)}`);
  }
};

export const buyNft = async (
  id: string
): Promise<string | AxiosResponse<any, any> | unknown> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    const response = await nftService.post(
      `buy/${id}`,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error) {
    throw new Error(`${String(error)}`);
  }
};

export const sellNft = async (
  id: string,
  price: { price: number }
): Promise<string | AxiosResponse<any, any> | unknown> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const body = JSON.stringify(price);

    const response = await nftService.post(`sell/${id}`, body, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error) {
    throw new Error(`${String(error)}`);
  }
};
