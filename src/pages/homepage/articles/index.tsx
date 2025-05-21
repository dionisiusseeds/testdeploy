import ArtPagination from '@/components/ArtPagination';
import ArticleCard from '@/components/homepage/articleCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getArticleCategories, getArticleHome } from '@/repository/article.repository';
import LanguageContext from '@/store/language/language-context';
import { type ArticleMetadataI, type CategoryI } from '@/utils/interfaces/article.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { SeedyEmptyData } from 'public/assets/vector';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
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

export default function ArticleList(): React.ReactElement {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleMetadata, setArticleMetadata] = useState<ArticleMetadataI>();
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isRefetch, setIsRefetch] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryI[]>([]);
  const sliderRef = useRef<Slider | null>(null);

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    source: 'articles',
    language: languageCtx?.language === 'ID' ? 'indonesian' : 'english',
    search: '',
    category: 'all',
    totalPage: 9,
    sort_by: 'all'
  });

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      language: languageCtx?.language === 'EN' ? 'english' : 'indonesian'
    }));
  }, [languageCtx.language]);

  const fetchArticles = async (): Promise<void> => {
    try {
      const response = await getArticleHome({
        ...params,
        source: params.source,
        category: params.category,
        sort_by: params.sort_by
      });

      if (response.status === 200) {
        setArticles(response?.data);
        setArticleMetadata(response?.metadata)
      } else {
        toast.error('Failed to fetch articles');
      }
    } catch (error) {
      toast.error(`Error fetching articles: ${error as string}`);
    }
  };
    
  const fetchArticleCategory = async (): Promise<void> => {
    try {
      const response = await getArticleCategories();
      setCategories(response?.data)

    } catch (error) {
      toast.error(`Error fetching category: ${error as string}`);
    }
  };

  const categoryItemClass = 'py-1 rounded-full text-center w-full text-md px-2';

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchArticles();
    };

    fetchData().catch(error => {
      toast.error('Error fetching data: ', error);
    });
  }, [params?.language, isRefetch]);

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      search: searchInput,
      page: 1
    }));

    void fetchArticles();
  }, [searchInput]);
  
  useEffect(() => {
    void fetchArticles();
  }, [params]);
      
  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      page: 1
    }));
  }, [activeCategory]);

  useEffect(() => {
    void fetchArticleCategory();

    setActiveCategory('all')
    setParams(prevParams => ({
      ...prevParams,
      category: 'all'
    }));
    if (sliderRef.current !== null) {
      sliderRef.current.slickGoTo(0);
    }
  }, []);

  const updateCategory = (newCategory: string): void => {
    setParams(prevParams => ({
      ...prevParams,
      category: newCategory.toLowerCase()
    }));

    setActiveCategory(newCategory);
  };

  const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  const customGradient = (
    <>
      <span className="-z-10 lg:fixed hidden lg:block bottom-[11rem] -right-1 w-96 h-64 bg-seeds-purple-2 blur-[160px] rotate-45 rounded-full" />
      <span className="-z-10 lg:fixed hidden lg:block bottom-36 right-0 w-[10rem] h-64 bg-seeds-purple-2 blur-[160px] rotate-60 rounded-full" />
    </>
  );

  return (
    <>
      <PageGradient
        customGradient={customGradient}
        className="z-0 relative overflow-hidden flex flex-col justify-center mx-5"
      >
        <div className="flex z-10 flex-col lg:flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-3xl font-semibold bg-clip-text text-black">
              {t('articleList.text1')}
            </div>
            <div className=" text-md font-normal text-gray-500">
              {t('articleList.text2')}
            </div>
          </div>
          <div className="lg:flex-col  justify-end mt-4">
            <div className="w-full lg:w-[300px] lg:h-[40px] bg-white rounded-3xl flex border-black border-[1px] px-[8px] justify-between ">
              <input
                type="search"
                className=" text-[#7C7C7C] w-full border-none rounded-3xl lg:w-[340px] px-[8px] focus:outline-none lg:h-[38px] "
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                onChange={e => {
                  setSearchInput(e.target.value);
                }}
              />
              <svg
                className="mt-2 me-3"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <div className="lg:flex justify-end items-center mt-4">
              <div className="hidden lg:block mt-2 font-normal text-base mx-3 text-[#7C7C7C]">
                {t('articleList.text3')}
              </div>
              <select
                className="bg-transparent mt-2 hidden lg:block text-base font-semibold cursor-pointer"
                aria-label="Sort Options"
                onChange={e => {
                  setParams({ ...params, sort_by: e.target.value });
                }}
              >
                <option value="all">{t('articleList.article.sort.all')}</option>
                <option value="relevant">
                  {t('articleList.article.sort.relevant')}
                </option>
                <option value="recent">
                  {t('articleList.article.sort.recent')}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="lg:hidden z-10 flex justify-end items-center mt-5">
          <div className=" justify-end lg:hidden first-line:mt-2 font-normal text-base mx-3 text-[#7C7C7C]">
            {t('articleList.text3')}
          </div>
          <select
            className="justify-end bg-transparent mt-1 lg:hidden text-base font-semibold"
            aria-label="Sort Options"
            onChange={e => {
              setParams({ ...params, sort_by: e.target.value });
            }}
          >
            <option value="all">{t('articleList.article.sort.all')}</option>
            <option value="relevant">
              {t('articleList.article.sort.relevant')}
            </option>
            <option value="recent">{t('articleList.article.sort.recent')}</option>
          </select>
        </div>

        <div className="lg:hidden mt-4 ">
          <Slider
            ref={sliderRef}
            slidesToShow={2}
            speed={500}
            initialSlide={0}
            infinite={true}
            swipeToSlide={true}
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  dots: false,
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  infinite: true
                }
              },
              {
                breakpoint: 1024,
                settings: {
                  dots: false,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  infinite: true
                }
              }
            ]}
          >
            {categories?.map((item, index) => (
              item?.category !== 'crime' &&
                <div key={index} className="px-2 h-full">
                  <div
                    className={`${categoryItemClass} ${
                      activeCategory === item.category
                        ? 'bg-[#3AC4A0] text-white'
                        : 'text-[#3AC4A0] bg-[#DCFCE4]'
                    } py-2 h-full flex rounded-full items-center justify-center text-sm font-medium cursor-pointer font-poppins`}
                    onClick={() => {
                      setActiveCategory(item.category);
                      updateCategory(item.category);
                    }}
                  >
                    {item?.category === 'all' ? t('articleList.text13') : capitalizeWords(item.category)}
                  </div>
                </div>
            ))}
          </Slider>
        </div>

        <div className="hidden lg:block mt-4">
          <Slider
            ref={sliderRef}
            slidesToShow={6}
            speed={500}
            initialSlide={0}
            infinite={true}
            swipeToSlide={true}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  dots: false,
                  slidesToShow: 6,
                  slidesToScroll: 4,
                  infinite: true
                }
              },
              {
                breakpoint: 1280,
                settings: {
                  dots: false,
                  slidesToShow: 6,
                  slidesToScroll: 4,
                  infinite: true
                }
              }
            ]}
          >
            {categories?.map((item, index) => (
              item?.category !== 'crime' &&
                <div key={index} className="px-2 h-full">
                  <div
                    className={`${categoryItemClass} ${
                      activeCategory === item.category
                        ? 'bg-[#3AC4A0] text-white'
                        : 'text-[#3AC4A0] bg-[#F9F9F9] shadow-lg'
                    } py-2 h-full flex rounded-full items-center justify-center text-sm font-medium cursor-pointer font-poppins`}
                    onClick={() => {
                      setActiveCategory(item.category);
                      updateCategory(item.category);
                    }}
                  >
                    {item?.category === 'all' ? t('articleList.text13') : capitalizeWords(item.category)}
                  </div>
                </div>
            ))}
          </Slider>
        </div>
          
        {
          articles?.length > 0 ?
            <div className="grid z-10 lg:grid-cols-4 gap-4 mt-8">
              {
                articles?.map((article, index) => {
                  return (
                    <ArticleCard
                      key={article.id}
                      articles={articles[index]}
                      articleId={Number(article.id)}
                      setIsRefetch={setIsRefetch}
                      isRefetch={isRefetch}
                    />
                  );
                })
              }
            </div>
            :
            (
              <div className='w-full flex flex-col justify-center items-center mt-12'>
                <Image
                  alt=""
                  src={SeedyEmptyData}
                  width={1000}
                  height={1000}
                  className="w-[200px] md:w-[250px] h-auto object-cover"
                />
                <div className="flex flex-wrap mt-4 gap-[4px] text-[#262626] font-poppins text-sm md:text-lg text-center justify-center items-center">
                  {
                    searchInput === '' &&
                      <Typography className="text-[#262626] font-poppins text-sm md:text-lg text-center">
                        {t('articleList.text9')}{' '}
                      </Typography>
                  }
                  {
                    searchInput !== '' &&
                      <Typography className="text-[#262626] font-poppins text-sm md:text-lg text-center">
                        {t('articleList.text10')}{' '}<strong>{`"${searchInput}"`}</strong>{' '}{t('articleList.text11')}{' '}
                      </Typography>
                  }
                  {((params?.category)?.length > 0)
                    ? <Typography className="text-[#262626] font-poppins text-sm md:text-lg text-center font-medium">
                        {`${params.category.charAt(0).toUpperCase() + params.category.slice(1)}`}
                      </Typography>
                    : ""}{t('articleList.text12')}
                </div>
              </div>
            )
        }

        <div className="hidden lg:flex justify-center mx-auto my-8">
          <ArtPagination
            currentPage={params.page}
            totalPages={articleMetadata?.total_page ?? 0}
            onPageChange={page => {
              setParams({ ...params, page });
            }}
          />
        </div>
      </PageGradient>
    </>
  );
}
