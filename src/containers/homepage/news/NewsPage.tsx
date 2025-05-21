import NewsCard from '@/components/homepage/newsCard';
import { getArticle } from '@/repository/article.repository';
import LanguageContext from '@/store/language/language-context';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'swiper/css';

export interface ArticleListRoot {
  promoCodeList: Article[];
  metadata: Metadata;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  link: string;
  videoUrl: string;
  imageUrl: string;
  content: string;
  sourceId: string;
  language: string;
  category: string;
  is_liked: boolean;
  publicationDate: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
}

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

export default function NewsPage(): React.ReactElement {
  const [articles, setArticles] = useState<Article[]>([]);
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [params, setParams] = useState({
    page: 1,
    limit: 6,
    source: 'news',
    language: languageCtx.language === 'EN' ? 'english' : 'indonesian',
    search: '',
    category: 'All',
    totalPage: 9
  });

  const fetchArticles = async (): Promise<void> => {
    try {
      const response = await getArticle({
        ...params,
        source: params.source,
        category: params.category
      });
      setArticles(response.data !== null ? response.data : []);
    } catch (error: any) {
      toast.error('Error fetching articles:', error.response.data.message);
    }
  };

  useEffect(() => {
    void fetchArticles();
  }, [params?.language]);

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      language: languageCtx.language === 'EN' ? 'english' : 'indonesian'
    }));
  }, [languageCtx.language]);

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="grid z-10 lg:grid-cols-4 gap-4">
          {articles?.map((article, index) => {
            return <NewsCard key={article.id} articles={articles[index]} />;
          })}
        </div>
        <div className="text-center justify-center">
          <Link
            href={'/homepage/news'}
            className="text-md mt-3 font-normal text-[#3AC4A0]"
          >
            {t('homepage.section2.text14')}
          </Link>
        </div>
      </div>
    </>
  );
}
