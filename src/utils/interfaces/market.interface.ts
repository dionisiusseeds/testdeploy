export interface Root {
  data: Data;
  metadata: Metadata;
}

export interface Data {
  data: trendingMarket[];
}

export interface trendingMarket {
  asset_id: string;
  asset_name: string;
  asset_icon: string;
  asset_ticker: string;
  asset_exchange: string;
  asset_type: string;
  asset_price: number;
  regular_percentage: number;
  volume: number;
}

export interface Metadata {
  total: number;
  current_page: number;
  limit: number;
  total_page: number;
}
