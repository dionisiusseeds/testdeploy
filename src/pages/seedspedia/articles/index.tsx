import ArtPagination from '@/components/ArtPagination';
import Footer from '@/components/layouts/Footer';
import ArticleCard from '@/components/seedsPedia/articleCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getArticle, getArticleCategories } from '@/repository/article.repository';
import i18n from '@/utils/common/i18n';
import { type ArticleMetadataI, type CategoryI } from '@/utils/interfaces/article.interface';
import { type ArticleDetail } from '@/utils/interfaces/play.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { SeedyEmptyData } from 'public/assets/vector';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

interface ArticleListProps {
  activeTab: string;
};

export default function ArticleList({
  activeTab
}: ArticleListProps): React.ReactElement {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [articleMetadata, setArticleMetadata] = useState<ArticleMetadataI>();
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<CategoryI[]>([]);
  const sliderRef = useRef<Slider | null>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 9,
    source: 'articles',
    language: '',
    search: '',
    category: 'all',
    totalPage: 9
  });

  async function fetchArticles(): Promise<void> {
    try {
      const response = await getArticle({
        ...params,
        source: params.source,
        category: params.category,
        language: i18n.language
      });

      if (response.status === 200) {
        setArticles(response?.data);
        setArticleMetadata(response?.metadata)
      } else {
        console.error('Failed to fetch articles:', response);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }
  
  const fetchArticleCategory = async (): Promise<void> => {
    try {
      const response = await getArticleCategories();
      setCategories(response?.data)

    } catch (error) {
      toast.error(`Error fetching category: ${error as string}`);
    }
  };

  const categoryItemClass =
    'py-1 rounded-full text-center w-full text-base font-semibold px-2';

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      search: searchInput,
      language: i18n.language,
      page: 1
    }));

    void fetchArticles();
  }, [searchInput, i18n.language]);

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
  }, []);

  useEffect(() => {
    setActiveCategory('all')
    setParams(prevParams => ({
      ...prevParams,
      category: 'all'
    }));
    if (sliderRef.current !== null) {
      sliderRef.current.slickGoTo(0);
    }
  }, [activeTab]);

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

  return (
    <>
      <PageGradient
        className="z-0 relative overflow-hidden flex flex-col justify-center mx-5 lg:mx-20"
      >
        <div className="flex z-10 flex-col lg:flex-col justify-center text-center">
          <div className="flex flex-col">
            <div className="text-3xl font-semibold bg-clip-text text-black font-poppins">
              {t('articleList.text1')}
            </div>
            <div className=" text-base font-normal text-gray-500 font-poppins">
              {t('articleList.text2')}
            </div>
          </div>
          <div className="lg:flex-col mb-2 justify-center items-center mt-4">
            <div className="w-full lg:w-[50%] lg:mx-auto  bg-white rounded-3xl flex border-black border-[1px] p-[8px] justify-between">
              <input
                type="text"
                className="w-full text-[#7C7C7C] border-none rounded-3xl px-[8px] focus:outline-none"
                placeholder="Search"
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                }}
              />
              {
                searchInput !== '' ?
                  <svg
                    onClick={() => { setSearchInput('') }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-1 me-3 cursor-pointer"
                    viewBox="0 0 18 18"
                    width="18"
                    height="18"
                    fill="black"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  :
                  <svg
                    className="mt-1 me-3"
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
              }
            </div>
          </div>
        </div>
        <div className="lg:hidden mt-4">
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
                  slidesToShow: 8,
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
        
        {
          articles?.length > 0 ?
            <div className="grid z-10 lg:grid-cols-6 gap-4 mt-8">
              {
                articles?.map(article => {
                  return (
                    <ArticleCard
                      key={article.id}
                      articleId={article.id}
                      articleName={article.title}
                      data={article}
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

        <div className="flex justify-center mx-auto my-8">
          <ArtPagination
            currentPage={params.page}
            totalPages={articleMetadata?.total_page ?? 0}
            onPageChange={page => {
              setParams({ ...params, page });
            }}
          />
        </div>
      </PageGradient>
      <Footer />
    </>
  );
}
