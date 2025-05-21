import {
  buyNft,
  connectSeeds,
  getUserAddress
} from '@/repository/nft.repository';
import * as DiamSdk from 'diamnet-sdk';
import { BASE_FEE, Operation, TransactionBuilder } from 'diamnet-sdk';
import { type AccountResponse } from 'diamnet-sdk/lib/aurora';
import { toast } from 'react-toastify';

const server = new DiamSdk.Aurora.Server(
  process.env.NEXT_PUBLIC_DIAM_URL ?? 'https://diamtestnet.diamcircle.io'
);
const networkPassphrase =
  process.env.NEXT_PUBLIC_DIAM_PASSPHRASE ?? 'Diamante Testnet 2024';

interface SuccessConnect {
  status: 200;
  message: {
    title: string;
    data: Array<{
      publicKey: string;
    }>;
  };
}

interface FailedConnect {
  status: 500;
  message: { title: string; message: string };
}

type ConnectWallet = SuccessConnect | FailedConnect;

interface SellOffer {
  selling: DiamSdk.Asset;
  buying: DiamSdk.Asset;
  amount: string;
  price: string;
  offerId?: string;
  source?: string;
}

interface BuyOffer {
  selling: DiamSdk.Asset;
  buying: DiamSdk.Asset;
  buyAmount: string;
  price: string;
  offerId?: string;
  source?: string;
}

export const connectWallet = async (): Promise<ConnectWallet | undefined> => {
  try {
    if ('diam' in window) {
      const response: ConnectWallet = await (window as any).diam.connect();
      if (response.status === 200) {
        const isConnected = await getUserAddress();
        if (
          typeof isConnected === 'object' &&
          isConnected !== null &&
          !('wallet_address' in isConnected)
        ) {
          await connectSeeds({
            wallet_address: response.message.data[0].publicKey
          });
        } else if (
          typeof isConnected === 'object' &&
          isConnected.wallet_address !== response.message.data[0].publicKey
        ) {
          throw new Error(
            'Oops! Please use the wallet address linked to this account'
          );
        }
        sessionStorage.setItem(
          'diamPublicKey',
          response?.message.data[0].publicKey
        );
        await checkBalance(response?.message.data[0].publicKey);
        return response;
      } else {
        throw new Error(
          response.message.message ?? response.message.title ?? response.message
        );
      }
    }
  } catch (error: any) {
    toast.error(
      `Failed connecting: ${String(error.message) ?? 'Unknown Error'}`
    );
  }
};

export const checkBalance = async (accountId: string): Promise<void> => {
  const account: AccountResponse = await server.loadAccount(accountId);
  const balances = account.balances.filter(
    balance => balance.asset_type === 'native'
  )[0].balance;
  sessionStorage.setItem('diamBalance', balances);
};

export const loadAccount = async (
  accountId: string
): Promise<AccountResponse> => {
  const account: AccountResponse = await server.loadAccount(accountId);
  return account;
};

export const createSellOffer = async (
  accountId: string,
  sellOffer: SellOffer
): Promise<number | undefined> => {
  try {
    const account: AccountResponse = await server.loadAccount(accountId);
    const transaction = transactionBuilder(account)
      .addOperation(Operation.manageSellOffer(sellOffer))
      .setTimeout(30)
      .build();
    const res = await signAndSubmitTransaction(transaction.toXDR());
    await checkBalance(accountId);
    return res?.status;
  } catch (error) {
    toast.error(
      `Error during Sell Offer creation: ${String(error) ?? 'Unknown Error'}`
    );
  }
};

export const createBuyOffer = async (
  assetId: string,
  accountId: string,
  buyOffer: BuyOffer
): Promise<number | undefined> => {
  try {
    const account: AccountResponse = await server.loadAccount(accountId);
    const transaction = transactionBuilder(account)
      .addOperation(Operation.manageBuyOffer(buyOffer))
      .setTimeout(30)
      .build();
    const res = await signSubmitTrans(transaction.toXDR());
    await checkBalance(accountId);
    if (res?.status === 200) {
      await buyNft(assetId);
    }
    return res?.status;
  } catch (error) {
    toast.error(
      `Error during Buy Offer creation: ${String(error) ?? 'Unknown Error'}`
    );
  }
};

export const createTrustline = async (
  accountId: string,
  assetCode: string,
  assetIssuer: string,
  limit: string = '1'
): Promise<number | undefined> => {
  if (accountId !== assetIssuer) {
    try {
      const account: AccountResponse = await server.loadAccount(accountId);
      const asset = new DiamSdk.Asset(assetCode, assetIssuer);
      if (!isTrustCreated(account, assetCode, assetIssuer)) {
        const transaction = transactionBuilder(account)
          .addOperation(
            Operation.changeTrust({
              asset,
              limit
            })
          )
          .setTimeout(30)
          .build();
        const res = await signSubmitTrans(transaction.toXDR());
        return res?.status;
      } else {
        return 200;
      }
    } catch (error) {
      toast.error(
        `Error during Trustline creation: ${String(error) ?? 'Unknown Error'}`
      );
    }
  } else return 200;
};

export const signAndSubmitTransaction = async (
  xdr: string
): Promise<{ status: number; message: any } | undefined> => {
  try {
    const signedTransaction = await (window as any).diam.sign(
      xdr,
      true,
      networkPassphrase
    );
    if (signedTransaction.status !== 200)
      throw new Error(
        `${String(
          signedTransaction.message.title.detail ??
            signedTransaction.message.title ??
            signedTransaction.message
        )}`
      );
    return signedTransaction;
  } catch (error) {
    toast.error(
      `Error during sign and submit transaction: ${
        String(error) ?? 'Unknown Error'
      }`
    );
  }
};

const isTrustCreated = (
  account: DiamSdk.Aurora.AccountResponse,
  assetCode: string,
  assetIssuer: string
): boolean =>
  account.balances
    .filter(val => val.asset_type === 'credit_alphanum12')
    .filter(
      val => val.asset_code === assetCode && val.asset_issuer === assetIssuer
    ).length > 0;

const transactionBuilder = (
  account: DiamSdk.Aurora.AccountResponse
): DiamSdk.TransactionBuilder =>
  new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase
  });

const signSubmitTrans = async (
  xdr: string
): Promise<{ status: number; message: any } | undefined> => {
  try {
    const signedTransaction = await (window as any).diam.sign(
      xdr,
      true,
      networkPassphrase
    );
    if (signedTransaction.status !== 200) {
      throw new Error(
        `${String(
          signedTransaction.message.title ?? signedTransaction.message
        )}`
      );
    }

    return signedTransaction;
  } catch (error) {
    toast.error(
      `Error during sign and submit transaction: ${
        String(error) ?? 'Unknown Error'
      }`
    );
  }
};
