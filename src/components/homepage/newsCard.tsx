'use-client';
import { type Article } from '@/containers/homepage/news/NewsPage';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import React, { useState } from 'react';
interface ArticleCardProps {
  articles: Article;
}

const NewsCard: React.FC<ArticleCardProps> = ({ articles }) => {
  const [open] = useState(false);

  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

  function formatDateToIndonesian(dateStr: string): string {
    try {
      const parsedDate = parseISO(dateStr);
      const formattedDate = format(parsedDate, 'd MMMM ', { locale: id });

      return formattedDate;
    } catch (error) {
      console.error('Error parsing or formatting date:', error);
      return '';
    }
  }

  function formatDateToIndonesianAgo(dateStr: string): string {
    try {
      const parsedDate = parseISO(dateStr);
      const distance = formatDistanceToNow(parsedDate, { locale: id });
      return `.  ${distance}`;
    } catch (error) {
      console.error('Error parsing or formatting date:', error);
      return '';
    }
  }

  const defaultNews = '/assets/default-news.png';
  const imageUrl = articles?.imageUrl ?? defaultNews;
  const isImageValid = isImageUrlValid(imageUrl);
  return (
    <>
      {open && (
        <div
          id="myToast"
          className="fixed right-10 z-50 bottom-10 px-5 py-4 border-r-8 border-blue-500 bg-white drop-shadow-lg"
        >
          <p className="text-sm">
            <span className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white font-extrabold">
              i
            </span>
            Article copied to Clipboard
          </p>
        </div>
      )}
      <div className="bg-[#FFF]  flex lg:col-span-2 xl:rounded-[18px] pb-6 w-full relative shadow-md">
        <div className="px-4 py-3 w-3/4">
          <div className="flex flex-row justify-between"></div>
          <Link
            href={`/homepage/news/${articles?.id ?? 0}`}
            className="text-base font-semibold text-[#000] my-4"
          >
            {articles?.title}
          </Link>
          <div className="flex flex-row justify-between bottom-2 w-full gap-4 right-5 absolute">
            <div className="flex flex-row ms-7 justify-between">
              <p className="text-xs font-normal text-[#8A8A8A]">
                {formatDateToIndonesian(articles?.publicationDate ?? '')}
              </p>
              <p className="text-xs font-normal text-[#7C7C7C]">
                {formatDateToIndonesianAgo(articles?.publicationDate ?? '')}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-4 lg:py-4 py-3 px-1 flex flex-col ">
          <Link href={`/homepage/news/${articles?.id ?? 0}`}>
            {isImageValid ? (
              <img
                src={imageUrl}
                alt={articles?.title}
                className="w-[153px] object-cover h-[160px] rounded-[18px]"
              />
            ) : (
              <img
                src={defaultNews}
                alt={articles?.title}
                className="w-[153px] object-cover h-[160px] rounded-[18px]"
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NewsCard;
