import back_nav from '@/assets/circle-page/back_nav.svg';
import {
  getGifFromGhipy,
  searchGifFromGhipy
} from '@/repository/circleDetail.repository';
import { type GiphyI } from '@/utils/interfaces/chat.interface';
import Image from 'next/image';
import { Search } from 'public/assets/vector';
import { useEffect, useState } from 'react';
interface form {
  content_text: string;
  media_url: string;
  media_type: string;
}
interface props {
  setPages: any;
  setForm: any;
  setMedia: any;
}

const GifSection: React.FC<props> = ({ setPages, setForm, setMedia }) => {
  const [dataGif, setData]: any = useState();
  const [search, setSearch] = useState({
    searchGif: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const cancelHandler = (): void => {
    setPages('text');
  };

  const fetchGif = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data } = (await getGifFromGhipy()) as GiphyI;
      setData(data);
    } catch (error: any) {
      console.error('Error fetching Gif from ghipy', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoading = (): JSX.Element => (
    <div className="h-72 flex justify-center">
      <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
    </div>
  );

  useEffect(() => {
    void fetchGif();
  }, []);

  const handlePostGif = (url: any): any => {
    setForm((prevForm: form) => ({
      ...prevForm,
      media_url: url,
      media_type: 'image'
    }));
    setMedia(undefined);
    setPages('text');
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): any => {
    const { name, value } = event.target;
    setSearch(prevSearch => ({ ...prevSearch, [name]: value }));
  };

  const searchGhipy = async (event: any): Promise<void> => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await searchGifFromGhipy(search.searchGif);
      setData(data);
    } catch (error: any) {
      console.error('Error Search Gif from ghipy', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="block bg-white pb-4 w-full">
      <div className="flex h-14 w-[375px]">
        <div className="flex flex-col justify-center">
          <button type="button" onClick={cancelHandler}>
            <Image alt="Back" src={back_nav} className="h-6 w-6 object-cover" />
          </button>
        </div>
        <div className="flex justify-center items-center w-full">
          <h1 className="font-poppins font-semibold text-lg">Choose GIF</h1>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <div className="flex justify-center flex-col relative left-10">
          <Image alt="Search" src={Search} className="h-6 w-6 object-cover" />
        </div>
        <form onSubmit={searchGhipy}>
          <input
            type="text"
            name="searchGif"
            value={search.searchGif}
            onChange={handleFormChange}
            className="h-10 pl-12 focus:outline-none placeholder:text-neutral-soft rounded-xl w-[350px] border border-neutral-ultrasoft"
            placeholder="Memes Stock"
          />
        </form>
      </div>
      {isLoading ? (
        renderLoading()
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-8">
          {dataGif?.map((el: any, i: number) => {
            return (
              <div
                className="max-h-[230px]"
                onClick={() => {
                  handlePostGif(el.images.preview_gif.url);
                }}
                key={`${i} + 'GHIPHY'`}
              >
                <img
                  alt="gif"
                  src={el?.images?.preview_gif.url}
                  className="h-full w-full object-cover cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default GifSection;
