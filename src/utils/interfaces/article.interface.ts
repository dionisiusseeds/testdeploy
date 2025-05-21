export interface ArticleCategoryI {
  data: CategoryI[]
  metadata: Metadata
}

export interface CategoryI {
  category: string
}

export interface Metadata {
  total: number
  current_page: number
  limit: number
  total_page: number
}

export interface ArticleMetadataI {
  total: number
  current_page: number
  limit: number
  total_page: number
}
