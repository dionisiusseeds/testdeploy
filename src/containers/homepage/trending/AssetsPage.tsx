import { swtracker } from '@/constants/swtracker';
import TrackerEvent from '@/helpers/GTM';
import { isGuest } from '@/helpers/guest';
import { getTrendingAssets } from '@/repository/asset.repository';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AssetTrendingCard from './AssetsTrendingCard';
import AssetTrendingCardSkeleton from './skeleton/AssetsCardSkeleton';

export interface AssetsInterface {
  asset_id: string;
  asset_name: string;
  asset_icon: string;
  asset_ticker: string;
  asset_exchange: string;
  asset_type: string;
  asset_price: number;
  regular_percentage: number;
}

export default function AssetsPage({ userInfo }: any): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetsInterface[]>([]);

  async function fetchAssets(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await getTrendingAssets({
        page: 1,
        limit: 3,
        sortBy: 'most_traded'
      });
      if (response.status === 200) {
        setAssets(response.data.data);
      } else {
        console.error('Failed to fetch assets:', response);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userInfo !== undefined) {
      const fetchData = async (): Promise<void> => {
        await fetchAssets();
      };

      fetchData().catch(error => {
        console.error('Error in fetchData:', error);
      });
    }
  }, [userInfo]);

  return (
    <>
      <div className="flex flex-wrap">
        {!isLoading
          ? assets.length !== 0 &&
            assets?.map((data, idx) => (
              <div key={idx} className="w-full">
                <AssetTrendingCard
                  data={data}
                  isClick={true}
                  currency={userInfo?.preferredCurrency}
                />
              </div>
            ))
          : Array.from({ length: 3 }, (_, idx) => (
              <AssetTrendingCardSkeleton key={idx} />
            ))}
      </div>
      <div className="text-center justify-center mt-3">
        <Link
          href={isGuest() ? '/auth' : '/homepage/trending-assets'}
          className="text-md mt-3 font-normal text-[#3AC4A0]"
          onClick={() => {
            TrackerEvent({
              event: swtracker.homepage.btnAssetList,
              userData: userInfo
            });
          }}
        >
          See More
        </Link>
      </div>
    </>
  );
}
