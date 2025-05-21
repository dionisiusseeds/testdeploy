import {
  getGifFromGhipy,
  searchGifFromGhipy
} from '@/repository/circleDetail.repository';
import { type GiphyI } from '@/utils/interfaces/chat.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { Search } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
interface form {
  content_text: string;
  privacy?: string;
  media_urls: string[];
}
interface props {
  setPages: any;
  form: form;
  isTooMuch: boolean;
  setErrorMessage: any;
  setIsError: any;
}

const GifPost: React.FC<props> = ({
  setPages,
  form,
  isTooMuch,
  setErrorMessage,
  setIsError
}) => {
  const [dataGif, setData]: any = useState();
  const [search, setSearch] = useState({
    searchGif: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostGif = (url: any): any => {
    if (isTooMuch) {
      setIsError(true);
      setErrorMessage('You can only post maximum 4 images, video and gif');
    } else {
      form.media_urls.push(url);
    }
    setPages('text');
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): any => {
    const { name, value } = event.target;
    setSearch(prevSearch => ({ ...prevSearch, [name]: value }));
  };

  const searchGhipy = async (): Promise<void> => {
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void searchGhipy();
    }
  };

  return (
    <div className="bg-white w-full">
      <div className="sm:flex hidden justify-start items-center w-full ">
        <button
          onClick={() => {
            setPages('text');
          }}
          className="mr-4"
        >
          <IoMdArrowRoundBack />
        </button>
        <Typography className="">Gift</Typography>
      </div>

      <div className="relative flex justify-start mt-4">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-3 flex items-center z-10">
          <Image alt="Search" src={Search} className="h-5 w-5 object-cover" />
        </div>

        {/* Search Input */}
        <form className="w-full relative">
          <input
            type="text"
            name="searchGif"
            value={search.searchGif}
            onChange={handleFormChange}
            onKeyDown={handleKeyDown}
            placeholder="Memes Stock"
            className="h-10 pl-10 focus:outline-none placeholder:text-neutral-soft rounded-xl w-full border border-neutral-ultrasoft"
          />
        </form>
      </div>

      {isLoading ? (
        <div className="mt-[2rem]">{renderLoading()}</div>
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
export default GifPost;
