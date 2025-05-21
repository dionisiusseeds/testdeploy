import ArticleCard from '@/components/homepage/articleCard';
import { getArticleWithAuth } from '@/repository/article.repository';
import LanguageContext from '@/store/language/language-context';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface ArticleListRoot {
  promoCodeList: Article[];
  metadata: Metadata;
}
interface Article {
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

export default function ArticlePage(): React.ReactElement {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isRefetch, setIsRefetch] = useState<boolean>(false);

  const [params, setParams] = useState({
    page: 1,
    limit: 6,
    source: 'articles',
    language: languageCtx?.language === 'ID' ? 'indonesian' : 'english',
    search: '',
    category: 'All',
    totalPage: 9
  });

  const fetchArticles = async (): Promise<void> => {
    try {
      const response = await getArticleWithAuth({
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
  }, [params?.language, isRefetch]);

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      language: languageCtx.language === 'EN' ? 'english' : 'indonesian'
    }));
  }, [languageCtx.language]);

  return (
    <div className="w-full">
      <div className="grid justify-between z-10 lg:grid-cols-4 gap-4 mt-8">
        {articles?.map((article, index) => {
          return (
            <ArticleCard
              key={article.id}
              articles={articles[index]}
              articleId={Number(article.id)}
              setIsRefetch={setIsRefetch}
              isRefetch={isRefetch}
            />
          );
        })}
      </div>
      <div className="text-center justify-center mt-3">
        <Link
          href={'/homepage/articles'}
          className="text-md mt-3 font-normal text-[#3AC4A0]"
        >
          {t('homepage.section2.text14')}
        </Link>
      </div>
    </div>
  );
}
