import friends from '@/assets/circle-page/friends.svg';
import globe from '@/assets/circle-page/globe.svg';
import privat from '@/assets/circle-page/private.svg';
import star from '@/assets/circle-page/star.svg';
import PiePreviewPost from '@/components/circle/pie/PiePreviewPost';
import HeaderLogin from '@/components/layouts/HeaderLogin';
import ShowAudioPlayer from '@/components/ui/outputs/AudioPlayerViewer';
import Gif_Post from '@/containers/circle/[id]/GifPost';
import ModalChoosePricePremium from '@/containers/social/main/ModalChoosePricePremium';
import { formatCurrency, stringToNumberCurrency } from '@/helpers/currency';
import { countWords } from '@/helpers/text';
import useMentionForm from '@/hooks/socials/modal-mention/useMentionForm';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  UseUploadMedia,
  createPostCircleDetail,
  getUserTagList,
  updatePostSocialAndCircle
} from '@/repository/circleDetail.repository';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { XIcon } from 'public/assets/vector';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import { Mention, MentionsInput } from 'react-mentions';
import ModalPie from './ModalPie';
import PDFViewer from './PDFViewer';
import { PollInput } from './PollingInput';
import ProfilePost from './ProfilePost';
import Toast from './Toast';
import UniqueInputButton from './UniqueInputButton';
import { VoiceRecorder } from './VoiceRecording';

interface SuccessOrderData {
  id: string;
  play_id: string;
  user_id: string;
  asset: any;
  type: 'BUY' | 'SELL';
  lot: number;
  bid_price: number;
  stop_loss: number;
  pnl: number;
  created_at: string;
  updated_at: string;
}
interface props {
  open: boolean;
  handleOpen: () => void;
  setIsLoading: any;
  setIsLoadingPost?: any;
  dataPost?: any;
  setDataPost?: any;
  setFilter?: any;
  setData?: any;
  setGolId: any;
  assetShare?: SuccessOrderData;
}

interface typeOfPost {
  type: string;
  svg: any;
}

interface typeOfSelection {
  name: string;
  svg: any;
  message: string;
  type: string;
}

interface AssetInterface {
  id: string;
  quote: string;
  currency: string;
  image: string;
  name: string;
  price: number;
  regularPercentage: number;
  value: number;
  isLock: boolean;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

const initialChartData = {
  labels: ['dummy'],
  datasets: [
    {
      data: [100],
      backgroundColor: ['#9F9F9F']
    }
  ]
};

const tagOption = [
  {
    id: 1,
    name: 'User'
  },
  {
    id: 2,
    name: 'Circle'
  },
  {
    id: 3,
    name: 'Play'
  },
  {
    id: 4,
    name: 'Quiz'
  },
  {
    id: 5,
    name: 'Team Battle'
  }
];
interface typeOfSelected {
  id: string;
  tag: string;
}
const ModalMention: React.FC<props> = ({
  open,
  handleOpen,
  setIsLoading,
  setIsLoadingPost,
  setFilter,
  setData,
  setGolId,
  dataPost,
  setDataPost,
  assetShare
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const circleId: string | any = router.query.circleid;
  const [findId, setFindId] = useState<number>(1);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isEmpty, setisEmpty] = useState<boolean>(false);
  const [isTooMuch, setIsTooMuch] = useState<boolean>(false);
  const [audio, setAudio] = useState<any>(null);
  const [media, setMedia] = useState<File[]>([]);
  const [pages, setPages] = useState('text');
  const [drop, setDrop] = useState(false);
  const [isPieModalOpen, setIsPieModalOpen] = useState(false);
  const [isSymbol, setIsSymbol] = useState(false);
  const [document, setDocument]: any = useState<any>(null);
  const [lastWordWithSymbol, setLastWordsWithSymbol] = useState<string>('');
  const [lastWordWithChar, setLastWordsWithChar] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<typeOfSelected>({
    id: '',
    tag: ''
  });
  const [selectedAsset, setSelectedAsset] = useState<AssetInterface[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [dropVal, setDropVal] = useState<typeOfPost>({
    type: t('social.postSetting.publicTitle'),
    svg: globe
  });
  const [tagLists, setTagLists] = useState<any>([]);
  const [otherTagId, setOtherTagId] = useState(1);
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [dollarLists, setDollarLists] = useState<any>([]);
  const [isOpenPremiumPrice, setIsOpenPremiumPrice] = useState<boolean>(false);
  const [otherTagList, setOtherTagList] = useState<any>({
    peopleList: [],
    circleList: [],
    playList: [],
    quizList: [],
    teamBattle: []
  });

  const {
    errorMessage,
    form,
    isError,
    setForm,
    userInfo,
    setIsError,
    setErrorMessage
  } = useMentionForm();

  const width = useWindowInnerWidth();
  const openPieModal: any = () => {
    setIsPieModalOpen(true);
  };
  const dataSelection: typeOfSelection[] = [
    {
      name: t('social.postSetting.publicTitle'),
      svg: globe,
      message: t('social.postSetting.publicDesc'),
      type: 'PUBLIC'
    },
    {
      name: t('social.postSetting.privateTitle'),
      svg: privat,
      message: t('social.postSetting.privateDesc'),
      type: 'PRIVATE'
    },
    {
      name: t('social.postSetting.friendsTitle'),
      svg: friends,
      message: t('social.postSetting.friendsDesc'),
      type: 'FRIENDS'
    },
    {
      name: t('social.postSetting.premiumTitle'),
      svg: star,
      message: t('social.postSetting.premiumDesc'),
      type: 'PREMIUM'
    }
  ];

  useEffect(() => {
    if (dataPost !== undefined) {
      setForm(prevState => ({
        ...prevState,
        content_text: dataPost.content_text,
        privacy: dataPost.privacy,
        media_urls: dataPost.media_urls?.length > 0 ? dataPost.media_urls : [],
        polling: {
          options: dataPost.pollings !== undefined ? dataPost.pollings : [],
          isMultiVote: dataPost.polling_multiple,
          canAddNewOption: dataPost.polling_new_option,
          endDate:
            dataPost.polling_date === '0001-01-01T00:00:00Z'
              ? ''
              : dataPost.polling_date
        },
        pie: dataPost.pie,
        pie_amount: dataPost.pie_amount,
        pie_title: dataPost.pie_title
      }));
    }
  }, [dataPost]);

  useEffect(() => {
    const findCircle = form.content_text.split('@');
    if (findId - findCircle.length > 1) {
      setFindId((prevState: number) => prevState - 1);
    }
  }, [form.content_text]);

  useEffect(() => {
    if (
      form.content_text.length === 0 &&
      form.media_urls.length === 0 &&
      form.polling.options.length === 0 &&
      form.pie_title.length === 0 &&
      form.pie.length === 0 &&
      form.pie_amount === 0 &&
      audio === null &&
      media.length === 0 &&
      document === null
    ) {
      setisEmpty(true);
    } else {
      setisEmpty(false);
    }
  }, [form, audio, media, document]);

  useEffect(() => {
    if (form.media_urls.length + media.length === 4) {
      setIsTooMuch(true);
    } else if (form.media_urls.length + media.length < 4) {
      setIsTooMuch(false);
    }
  }, [form.media_urls.length, media.length]);

  useEffect(() => {
    const regexPattern = /@\[.*?\]\(.*?\)/g;
    const cleanedString = form.content_text.replace(regexPattern, '');
    const totalChar = cleanedString.length;

    if (totalChar > 500 && form.privacy !== 'premium') {
      setIsError(true);
      setIsDisable(true);
      setErrorMessage(`${t('social.errorState.thread3')}`);
    } else if (totalChar > 1000 && form.privacy === 'premium') {
      setIsError(true);
      setIsDisable(true);
      setErrorMessage(`${t('social.errorState.thread1')}`);
    } else {
      setIsDisable(false);
    }

    if (form.privacy === 'premium') {
      if (countWords(form.content_text) < 10) {
        setIsError(true);
        setIsDisable(true);
        setErrorMessage('Please input minimum 10 words to post premium');
        setLastWordsWithChar('');
      }
    }

    if (form.content_text.length < 1) {
      setLastWordsWithChar('');
    }
  }, [form.content_text]);

  useEffect(() => {
    if (otherTagId === 1) {
      setTagLists(otherTagList?.peopleList);
    } else if (otherTagId === 2) {
      setTagLists(otherTagList?.circleList);
    } else if (otherTagId === 3) {
      setTagLists(otherTagList?.playList);
    }
  }, [otherTagId]);

  useEffect(() => {
    if (selectedValue?.tag?.length > 0) {
      setIsSymbol(false);
      if (form.content_text.includes(' ')) {
        let isSpace = false;
        const words = form.content_text.split(' ');
        const currentWord = words[words.length - 1];
        const wordBefore = words[words.length - 2];
        if (wordBefore.endsWith(' ')) {
          wordBefore.replace(' ', '');
          words.pop();
          isSpace = true;
        }
        words.pop();
        let newVal = '';
        const circleFind = form.content_text.split('@');
        circleFind.pop();
        let str: string = '';
        circleFind.forEach((el: string, i: number) => {
          if (i > 0) {
            str += `@${el}`;
          } else {
            str += el;
          }
        });

        const currentCircleFind = `@${circleFind[circleFind.length - 1]}`;
        if (currentCircleFind.includes('@')) {
          const newActualTag = `@[${selectedValue.tag}](${selectedValue.id}) `;
          newVal = str + newActualTag;
        }

        if (currentWord.includes('@')) {
          const newActualTag = ` @[${selectedValue.tag}](${selectedValue.id}) `;
          if (isSpace) {
            newVal = words.join(' ') + wordBefore + newActualTag;
          } else {
            newVal = words.join(' ') + newActualTag;
          }
        }
        if (currentWord.includes('$')) {
          const newActualTag = ` $[${selectedValue.tag}](${selectedValue.id}) `;
          newVal = words.join(' ') + newActualTag;
        }
        if (currentWord.includes('#')) {
          const newActualTag = ` #[${selectedValue.tag}]() `;
          newVal = words.join(' ') + newActualTag;
        }

        setForm(prevForm => ({
          ...prevForm,
          content_text: newVal
        }));
        setSelectedValue({
          id: '',
          tag: ''
        });
      } else {
        if (form.content_text.includes('@')) {
          const newActualTag = `@[${selectedValue.tag}](${selectedValue.id}) `;
          setForm(prevForm => ({
            ...prevForm,
            content_text: newActualTag
          }));
        }
        if (form.content_text.includes('$')) {
          const newActualTag = `$[${selectedValue.tag}](${selectedValue.id}) `;
          setForm(prevForm => ({
            ...prevForm,
            content_text: newActualTag
          }));
        }
        if (form.content_text.includes('#')) {
          const newActualTag = `#[${selectedValue.tag}]() `;

          setForm(prevForm => ({
            ...prevForm,
            content_text: newActualTag
          }));
        }
        setSelectedValue({
          id: '',
          tag: ''
        });
      }
    }
  }, [selectedValue]);

  useEffect(() => {
    if (
      lastWordWithSymbol.includes('@') ||
      lastWordWithSymbol.includes('#') ||
      lastWordWithSymbol.includes('$')
    ) {
      setIsSymbol(true);
    } else {
      setIsSymbol(false);
    }
  }, [lastWordWithSymbol]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | any
  ): any => {
    const { name, value } = event.target;
    if (name === 'pie_amount') {
      const formattedValue = formatCurrency(value);
      setForm(prevForm => ({ ...prevForm, [name]: formattedValue }));
    } else if (name === 'premium_fee') {
      setForm(prevForm => ({ ...prevForm, premium_fee: parseInt(value)}));
    } else if (name === 'pie_title') {
      setForm(prevForm => ({ ...prevForm, pie_title: value }));
    } else {
      const newActualValue = value;
      setForm(prevForm => ({ ...prevForm, content_text: newActualValue }));
      setForm(prevForm => ({ ...prevForm, [name]: newActualValue }));
    }
    const API_TYPE = ['people', 'plays', 'circles', 'quizes', 'battles'];
    const matches: any = value.match(/[@#$]\[.*?\]\(.*?\)|[@#$]\w+/g);
    const words = value.split(' ');
    const circleFind = value.split('@');
    const currentCircleFind = circleFind[circleFind.length - 1];

    if (circleFind.length - 1 === findId && circleFind.length > 1) {
      setLastWordsWithChar(`@${currentCircleFind as string}`);
    } else {
      setLastWordsWithChar('');
    }

    const currentWord = words[words.length - 1];
    if (words.length > 0) {
      setLastWordsWithSymbol(currentWord);
    } else {
      setLastWordsWithSymbol(value);
    }

    if (matches?.length > 0) {
      const lastMention = matches[matches.length - 1];
      const cleanedValue = lastMention.replace(/[#$@]/g, '');

      if (debounceTimer !== null) clearTimeout(debounceTimer);
      if (lastMention.length > 1) {
        setDebounceTimer(
          setTimeout((): void => {
            void (async (): Promise<void> => {
              try {
                if (lastMention.includes('#') === true) {
                  const { data }: any = await getUserTagList(
                    'hashtags',
                    cleanedValue
                  );

                  setHashtags(
                    data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-hashtag`,
                      display: item.hashtag
                    }))
                  );
                } else if (lastMention.includes('$') === true) {
                  const { data }: any = await getUserTagList(
                    'assets',
                    cleanedValue
                  );

                  setDollarLists(
                    data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-asset`,
                      display: item.ticker
                    }))
                  );
                } else if (lastMention.includes('@') === true) {
                  const promises = API_TYPE.map(async key => {
                    return await getUserTagList(key, cleanedValue);
                  });
                  const results: any = await Promise.all(promises);
                  setOtherTagList({
                    peopleList: results[0]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-people`,
                      display: item.tag
                    })),
                    playList: results[1]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-play`,
                      display: item.name
                    })),
                    circleList: results[2]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-circle`,
                      display: item.name
                    })),
                    quizList: results[3]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-quiz`,
                      display: item.name
                    })),
                    teamBattle: results[4]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-battles`,
                      display: item.name
                    }))
                  });
                  setTimeout(() => {
                    if (results[0]?.data?.length > 0) {
                      setOtherTagId(1);
                      setTagLists(
                        results[0].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-people`
                        }))
                      );
                    } else if (results[1]?.data?.length > 0) {
                      setOtherTagId(3);
                      setTagLists(
                        results[1].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-play`
                        }))
                      );
                    } else if (results[2]?.data?.length > 0) {
                      setOtherTagId(2);
                      setTagLists(
                        results[2].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-circle`
                        }))
                      );
                    } else if (results[3]?.data?.length > 0) {
                      setOtherTagId(4);
                      setTagLists(
                        results[3].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-quiz`
                        }))
                      );
                    } else if (results[4]?.data?.length > 0) {
                      setOtherTagId(5);
                      setTagLists(
                        results[4].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-battles`
                        }))
                      );
                    }
                  }, 500);
                }
              } catch (_) {
                console.log(_);
              }
            })();
          }, 500)
        );
      }
    }
  };

  const selectTypeTag = (type: any): void => {
    setOtherTagId(type?.id);
    if (type?.id === 1) {
      setTagLists(otherTagList?.peopleList);
    }
    if (type?.id === 2) {
      setTagLists(otherTagList?.circleList);
    }
    if (type?.id === 3) {
      setTagLists(otherTagList?.playList);
    }
    if (type?.id === 4) {
      setTagLists(otherTagList?.quizList);
    }
    if (type?.id === 5) {
      setTagLists(otherTagList?.teamBattle);
    }
  };

  const processText = (text: string): string => {
    const processedText = text.replace(/#(\w+)/g, '#[$1]()');
    return processedText;
  };

  useEffect(() => {
    const delay = 2000;
    const timeoutId = setTimeout(() => {
      const processedText = processText(form.content_text);
      if (hashtags?.length < 1) {
        setForm(prevForm => ({
          ...prevForm,
          content_text: processedText
        }));
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [form.content_text]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): any => {
    const { value } = event.target;
    if (value === t('social.postSetting.publicTitle')) {
      setForm(prevForm => ({ ...prevForm, privacy: 'public' }));
      setDropVal(prevDropVal => ({
        ...prevDropVal,
        type: value,
        svg: globe
      }));
    } else if (value === t('social.postSetting.privateTitle')) {
      setForm(prevForm => ({ ...prevForm, privacy: 'private' }));
      setDropVal(prevDropVal => ({
        ...prevDropVal,
        type: value,
        svg: privat
      }));
    } else if (value === t('social.postSetting.friendsTitle')) {
      setForm(prevForm => ({ ...prevForm, privacy: 'friends' }));
      setDropVal(prevDropVal => ({
        ...prevDropVal,
        type: value,
        svg: friends
      }));
    } else if (value === t('social.postSetting.premiumTitle')) {
      setForm(prevForm => ({ ...prevForm, privacy: 'premium' }));
      setDropVal(prevDropVal => ({ ...prevDropVal, type: value, svg: star }));
      setIsOpenPremiumPrice(true);
    }
    setDrop(false);
  };

  const handleDropDown = (): any => {
    if (!drop) {
      setDrop(true);
    } else {
      setDrop(false);
    }
  };

  const postMedia = async (mediaFile: any): Promise<void> => {
    try {
      if (Array.isArray(mediaFile)) {
        for (let index = 0; index < mediaFile.length; index++) {
          const element = mediaFile[index];
          const { data } = await UseUploadMedia(element);
          form.media_urls.push(data.path);
        }
      } else {
        const { data } = await UseUploadMedia(mediaFile);
        form.media_urls.push(data.path);
      }
    } catch (error: any) {
      console.error('Error Post Media:', error.message);
    }
  };

  const handlePostCircle = async (event: any): Promise<void> => {
    event.preventDefault();
    handleOpen();
    try {
      setIsLoading(true);
      if (setIsLoadingPost !== undefined) {
        setIsLoadingPost(true);
      }
      if (media.length > 0) {
        await postMedia(media);
      }

      if (audio !== undefined && audio !== null) {
        await postMedia(audio);
      }
      if (document !== undefined && document !== null) {
        await postMedia(document);
      }
      let payload: any;
      if (circleId !== undefined) {
        payload = {
          content_text: form.content_text.replace(/#\[(.*?)\]\(\)/g, '#$1'),
          media_urls: form.media_urls,
          privacy: form.privacy,
          is_pinned: false,
          user_id: userInfo?.id,
          circleId,
          hashtags
        };
      } else {
        if (assetShare !== undefined) {
          payload = {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            content_text: `%[${assetShare?.asset?.asset_ticker}](${assetShare?.asset?.asset_id}) &[${assetShare?.type}](${assetShare?.bid_price}) *[asset_icon](${assetShare?.asset?.asset_icon})`,
            media_urls: form.media_urls,
            privacy: form.privacy,
            is_pinned: false,
            user_id: userInfo?.id,
            hashtags
          };
        } else {
          payload = {
            content_text: form.content_text.replace(/#\[(.*?)\]\(\)/g, '#$1'),
            media_urls: form.media_urls,
            privacy: form.privacy,
            is_pinned: false,
            user_id: userInfo?.id,
            hashtags
          };
        }
      }
      if (form.polling.options.length > 0) {
        payload.pollings = form.polling.options;
        payload.polling_multiple = form.polling.isMultiVote;
        payload.polling_new_option = form.polling.canAddNewOption;
        payload.polling_date =
          form.polling.endDate.length > 0
            ? new Date(form.polling.endDate)
            : undefined;
      }

      if (form.pie_title !== '') {
        const newDataPie = selectedAsset.map(item => ({
          asset_id: item.id,
          price: item.price,
          allocation: item.value
        }));

        payload.pie = newDataPie;
        payload.pie_title = form.pie_title;
        payload.pie_amount = stringToNumberCurrency(form.pie_amount);
      }

      if (form.privacy === 'premium') {
        payload.premium_fee = parseInt(form.premium_fee);
      }

      if (dataPost !== undefined) {
        const res = await updatePostSocialAndCircle(payload, dataPost.id);
        if (res.status === 200) {
          setDataPost((prevState: any) => {
            if (Array.isArray(prevState)) {
              const newData = prevState.map((el: any) => {
                if (el.id === dataPost.id) {
                  el.content_text = form.content_text;
                  el.privacy = form.privacy;
                  el.media_urls = form.media_urls;
                  el.pollings = form.polling.options;
                  el.polling_multiple = form.polling.isMultiVote;
                  el.canAddNewOption = form.polling.canAddNewOption;
                  el.endDate = form.polling.endDate;
                  el.pie = form.pie;
                  el.pie_amount = form.pie_amount;
                  el.pie_title = form.pie_title;
                }
                return el;
              });
              return newData;
            } else if (prevState.data !== undefined) {
              const newData = prevState.data.map((el: any) => {
                if (el.id === dataPost.id) {
                  el.content_text = form.content_text;
                  el.privacy = form.privacy;
                  el.media_urls = form.media_urls;
                  el.pollings = form.polling.options;
                  el.polling_multiple = form.polling.isMultiVote;
                  el.canAddNewOption = form.polling.canAddNewOption;
                  el.endDate = form.polling.endDate;
                  el.pie = form.pie;
                  el.pie_amount = form.pie_amount;
                  el.pie_title = form.pie_title;
                }
                return el;
              });
              return { data: newData, metadata: prevState.metadata };
            }
            return prevState;
          });
        }
      } else {
        await createPostCircleDetail(payload);
        void router.push('/social');
      }

      setForm({
        content_text: '',
        privacy: 'public',
        media_urls: [],
        polling: {
          options: [],
          isMultiVote: false,
          canAddNewOption: false,
          endDate: ''
        },
        pie_title: '',
        pie_amount: 0,
        pie: [],
        premium_fee: ''
      });
      setGolId((prevState: number) => prevState + 1);
      setAudio(null);
      setMedia([]);
      setDocument(null);
      setHashtags([]);
      setSelectedAsset([]);
      setChartData(initialChartData);
      if (setFilter !== undefined) {
        setFilter((prevState: any) => ({
          ...prevState,
          page: 1
        }));
      }
      if (setData !== undefined) {
        setData([]);
      }
      setOtherTagList({
        peopleList: [],
        circleList: [],
        playList: [],
        quizList: [],
        teamBattle: []
      });
      setDollarLists([]);
      setHashtags([]);
    } catch (error: any) {
      console.error('Error posting or editing:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerRef = useRef<any>(null);
  useEffect(() => {
    if (open) {
      const applyCustomStyle = (): void => {
        const containerElement = containerRef.current?.containerElement;
        if (containerElement !== undefined) {
          const divsWithTextarea = containerElement.querySelectorAll('div');
          divsWithTextarea.forEach((div: HTMLDivElement) => {
            if (div.querySelector('textarea') !== undefined) {
              div.classList.add('custom-div-style');
            }
          });
        }
      };
      applyCustomStyle();
    }
  }, [open, pages]);

  useEffect(() => {
    setTagLists([]);
    setLastWordsWithSymbol('');
  }, [handleOpen]);

  const renderAvatar = (imageUrl: string): JSX.Element => {
    return (
      <img
        src={imageUrl}
        alt={`image avatar`}
        className="rounded-full h-[48px] w-[48px] object-cover"
      />
    );
  };

  const renderNameAndTag = (
    name: string,
    seedsTag: string,
    verified?: boolean
  ): JSX.Element => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Typography className="text-lg text-black font-poppins font-medium">
            {name}
          </Typography>
          {verified !== undefined && verified && (
            <CheckCircleIcon width={20} height={20} color="#5E44FF" />
          )}
        </div>

        <Typography className="font-poppins text-neutral-medium text-base">
          @{seedsTag}
        </Typography>
      </div>
    );
  };
  const renderUserSuggestion = (): JSX.Element | undefined => {
    if (
      (lastWordWithSymbol.length > 1 &&
        lastWordWithSymbol.includes('@') &&
        isSymbol) ||
      (otherTagId !== 1 &&
        lastWordWithChar.length > 1 &&
        lastWordWithChar.includes('@'))
    ) {
      return (
        <div className="absolute z-50 shadow-lg border-x w-[90%] border-b border-black/20 bg-white pb-2 rounded-b-xl">
          <div className="flex justify-center gap-4">
            {tagOption.map((el: { id: number; name: string }, i: number) => {
              return (
                <div
                  className={`flex items-center p-2 border rounded-lg cursor-pointer px-4 ${
                    otherTagId === el.id
                      ? 'border-seeds-button-green bg-seeds-button-green/20'
                      : 'border-neutral-soft'
                  }`}
                  key={el.id}
                  onClick={() => {
                    selectTypeTag(el);
                  }}
                >
                  <Typography
                    className={`font-poppins text-base font-normal ${
                      otherTagId === el.id
                        ? 'text-seeds-button-green'
                        : 'text-neutral-soft'
                    }`}
                  >
                    {el.name}
                  </Typography>
                </div>
              );
            })}
          </div>
          <div className="max-h-[400px] overflow-auto w-[90%] ml-10 bg-white">
            {tagLists?.map((el: any, i: number) => {
              if (
                el?.tag === undefined &&
                el?.name
                  ?.toLowerCase()
                  ?.includes(lastWordWithChar.split('@')[1]) === true
              ) {
                return (
                  <div
                    className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2 hover:bg-[#F2F2F2] duration-300"
                    key={el.id}
                    onClick={() => {
                      const newTag = {
                        tag: el.tag,
                        id: el?.id
                      };
                      if (
                        el?.members !== undefined ||
                        el?.participants !== undefined
                      ) {
                        newTag.tag = el?.name;
                      }
                      setOtherTagList({
                        peopleList: [],
                        circleList: [],
                        playList: [],
                        quizList: [],
                        teamBattle: []
                      });
                      setFindId((prevState: number) => prevState + 1);
                      setLastWordsWithChar('');
                      setSelectedValue(newTag);
                      setIsSymbol(false);
                    }}
                  >
                    {el?.avatar !== undefined
                      ? renderAvatar(el.avatar)
                      : el?.banner !== undefined
                      ? renderAvatar(
                          el?.banner?.image_url !== undefined
                            ? el?.banner?.image_url
                            : el?.banner
                        )
                      : null}

                    {el?.tag !== undefined ? (
                      renderNameAndTag(el?.name, el?.tag)
                    ) : el?.members !== undefined ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Typography className="text-lg text-black font-poppins font-medium">
                            {el?.name}
                          </Typography>
                          <Typography className="font-poppins text-neutral-soft text-base font-normal">
                            {el?.members} members
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          {el?.hashtags?.map((el: any, i: number) => {
                            return (
                              <Typography
                                key={`${el as string}${i}`}
                                className="font-poppins text-seeds-button-green text-base font-semibold"
                              >
                                #{el}
                              </Typography>
                            );
                          })}
                        </div>
                      </div>
                    ) : el?.participants !== undefined ? (
                      <div className="flex flex-col gap-2">
                        <Typography className="text-lg text-black font-poppins font-medium">
                          {el?.name}
                        </Typography>
                        <Typography className="font-poppins text-neutral-soft text-base font-normal">
                          {el?.participants} participants
                        </Typography>
                      </div>
                    ) : null}
                  </div>
                );
              } else if (
                el?.tag === undefined &&
                el?.title
                  ?.toLowerCase()
                  ?.includes(lastWordWithChar.split('@')[1]) === true
              ) {
                return (
                  <div
                    className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2 hover:bg-[#F2F2F2] duration-300"
                    key={el.id}
                    onClick={() => {
                      const newTag = {
                        tag: el.tag,
                        id: el?.id
                      };
                      if (
                        el?.members !== undefined ||
                        el?.participants !== undefined
                      ) {
                        newTag.tag = el?.title;
                      }
                      setOtherTagList({
                        peopleList: [],
                        circleList: [],
                        playList: [],
                        quizList: [],
                        teamBattle: []
                      });
                      setFindId((prevState: number) => prevState + 1);
                      setLastWordsWithChar('');
                      setSelectedValue(newTag);
                      setIsSymbol(false);
                    }}
                  >
                    {el?.avatar !== undefined
                      ? renderAvatar(el.avatar)
                      : el?.banner !== undefined
                      ? renderAvatar(
                          el?.banner?.image_url !== undefined
                            ? el?.banner?.image_url
                            : el?.banner
                        )
                      : null}

                    {el?.tag !== undefined ? (
                      renderNameAndTag(el?.name, el?.tag)
                    ) : el?.participants !== undefined ? (
                      <div className="flex flex-col gap-2">
                        <Typography className="text-lg text-black font-poppins font-medium">
                          {el?.title}
                        </Typography>
                        <Typography className="font-poppins text-neutral-soft text-base font-normal">
                          {el?.participants}{' '}
                          {el?.participants > 1
                            ? t('social.postSection.players')
                            : t('social.postSection.player')}
                        </Typography>
                      </div>
                    ) : null}
                  </div>
                );
              } else if (el?.tag !== undefined) {
                return (
                  <div
                    className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2 hover:bg-[#F2F2F2] duration-300"
                    key={el.id}
                    onClick={() => {
                      const newTag = {
                        tag: el.tag,
                        id: el?.id
                      };
                      if (
                        el?.members !== undefined ||
                        el?.participants !== undefined
                      ) {
                        newTag.tag = el?.name;
                      }
                      setOtherTagList({
                        peopleList: [],
                        circleList: [],
                        playList: [],
                        quizList: [],
                        teamBattle: []
                      });
                      setFindId((prevState: number) => prevState + 1);
                      setLastWordsWithChar('');
                      setSelectedValue(newTag);
                      setIsSymbol(false);
                    }}
                  >
                    {el?.avatar !== undefined
                      ? renderAvatar(el?.avatar)
                      : el?.banner !== undefined
                      ? renderAvatar(el?.banner)
                      : null}
                    {el?.tag !== undefined ? (
                      renderNameAndTag(el?.name, el?.tag)
                    ) : el?.members !== undefined ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Typography className="text-lg text-black font-poppins font-medium">
                            {el?.name}
                          </Typography>
                          <Typography className="font-poppins text-neutral-soft text-base font-normal">
                            {el?.members} members
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          {el?.hashtags?.map((el: any, i: number) => {
                            return (
                              <Typography
                                key={`${el as string}${i}`}
                                className="font-poppins text-seeds-button-green text-base font-semibold"
                              >
                                #{el}
                              </Typography>
                            );
                          })}
                        </div>
                      </div>
                    ) : el?.participants !== undefined ? (
                      <div className="flex flex-col gap-2">
                        <Typography className="text-lg text-black font-poppins font-medium">
                          {el?.name}
                        </Typography>
                        <Typography className="font-poppins text-neutral-soft text-base font-normal">
                          {el?.participants}{' '}
                          {el?.participants > 1
                            ? t('social.postSection.players')
                            : t('social.postSection.player')}
                        </Typography>
                      </div>
                    ) : null}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
  };

  const renderDollarSuggestion = (): JSX.Element | undefined => {
    if (
      lastWordWithSymbol.length > 1 &&
      lastWordWithSymbol.includes('$') &&
      isSymbol
    ) {
      return (
        <div className="absolute shadow-lg border-x w-[90%] z-50 border-b border-black/20 bg-white pb-2 rounded-b-xl">
          <div className="max-h-[400px] overflow-auto w-[90%] ml-10">
            {dollarLists?.map((el: any) => {
              return (
                <div
                  className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2"
                  key={el.id}
                  onClick={() => {
                    const newDollar = {
                      tag: el.ticker,
                      id: el?.id
                    };
                    setDollarLists([]);
                    setSelectedValue(newDollar);
                    setIsSymbol(false);
                  }}
                >
                  {renderAvatar(el?.logo)}
                  <div className="flex flex-col">
                    <Typography className="text-lg text-black font-poppins font-medium">
                      {el?.ticker} / <span>{el?.currency}</span>
                    </Typography>
                    <Typography className="font-poppins text-neutral-soft text-base font-normal">
                      {el?.name}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderUserHashtags = (): JSX.Element | undefined => {
    if (
      lastWordWithSymbol.length > 1 &&
      lastWordWithSymbol.includes('#') &&
      isSymbol
    ) {
      return (
        <div className="absolute shadow-lg border-x w-[90%] z-50 border-b border-black/20 bg-white pb-2 rounded-b-xl">
          <div className="max-h-[400px] overflow-auto w-[90%] ml-10">
            {hashtags?.map((hashtag: any) => {
              return (
                <div
                  className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2"
                  key={hashtag.counter}
                  onClick={() => {
                    const newTag = {
                      tag: hashtag.hashtag,
                      id: ''
                    };
                    setHashtags([]);
                    setSelectedValue(newTag);
                    setIsSymbol(false);
                  }}
                >
                  {renderHashtags(hashtag.hashtag, hashtag.counter)}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const handleTextPages = (): any => {
    if (pages === 'text') {
      return (
        <div className="md:my-4 mt-4 mb-2">
          <MentionsInput
            onChange={e => {
              handleFormChange(e)
            }}
            ref={containerRef}
            value={form.content_text}
            allowSpaceInQuery
            placeholder={`${t('circleDetail.textAreaPlaceholder')}`}
            style={{ outline: 'none' }}
            className={`w-[100%] focus:outline-black MentionInputTextArea bg-transparent font-poppins placeholder:font-poppins text-base placeholder:text-neutral-soft placeholder:text-base ${
              form.content_text === ''
                ? 'lg:min-h-[70px] md:min-h-[70px] sm:min-h-[80px] min-h-[90px]'
                : 'min-h-auto'
            }`}
            a11ySuggestionsListLabel={'Suggested mentions'}
          >
            <Mention
              trigger={'@'}
              data={[]}
              markup="@[__display__](__id__)"
              style={{ color: '#4FE6AF' }}
            />
            <Mention
              trigger={'$'}
              data={[]}
              markup="$[__display__](__id__)"
              style={{ color: '#4FE6AF' }}
            />
            <Mention
              trigger={'#'}
              data={[]}
              markup="#[__display__]()"
              style={{ color: '#4FE6AF' }}
            />
          </MentionsInput>
          {assetShare !== undefined && (
            <div className="bg-[#b9fae2] text-[#2e745a] rounded-xl p-2 flex justify-between ">
              <div className="flex gap-2">
                <p className="font-poppins ">{assetShare?.type as string}</p>
                <p className="font-semibold font-poppins">
                  {assetShare?.asset?.asset_ticker as string}
                </p>
                <p className="font-poppins">at</p>
                <p className="font-semibold font-poppins">
                  IDR {assetShare?.bid_price}
                </p>
              </div>
              <img
                src={assetShare?.asset?.asset_icon}
                alt="icon"
                className="w-[40px] rounded-full object-scale-down"
                width={40}
                height={40}
              />
            </div>
          )}
          {renderUserSuggestion()}
          {renderDollarSuggestion()}
          {renderUserHashtags()}
        </div>
      )
    } else {
      return (
        <>
          <MentionsInput
            onChange={e => {
              handleFormChange(e)
            }}
            ref={containerRef}
            value={form.content_text}
            allowSpaceInQuery
            placeholder={`${t('circleDetail.textAreaPlaceholder')}`}
            style={{ outline: 'none' }}
            className={`w-[100%] focus:outline-black MentionInputTextArea bg-transparent font-poppins placeholder:font-poppins text-base placeholder:text-neutral-soft placeholder:text-base ${
              form.content_text === ''
                ? 'lg:min-h-[70px] md:min-h-[70px] sm:min-h-[80px] min-h-[90px]'
                : 'min-h-auto'
            }`}
            a11ySuggestionsListLabel={'Suggested mentions'}
          >
            <Mention
              trigger={'@'}
              data={[]}
              markup="@[__display__](__id__)"
              style={{ color: '#4FE6AF' }}
            />
            <Mention
              trigger={'$'}
              data={[]}
              markup="$[__display__](__id__)"
              style={{ color: '#4FE6AF' }}
            />
            <Mention
              trigger={'#'}
              data={[]}
              markup="#[__display__]()"
              style={{ color: '#4FE6AF' }}
            />
          </MentionsInput>
        </>
      )
    }
  };

  const handlePages = (): any => {
    if (pages === 'gif') {
      return (
        <Gif_Post
          setPages={setPages}
          form={form}
          isTooMuch={isTooMuch}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
        />
      );
    } else if (pages === 'talk') {
      return (
        <VoiceRecorder
          setPages={setPages}
          setAudio={setAudio}
          setLoading={setIsLoading}
          audio={audio}
        />
      );
    } else if (pages === 'pie' && isPieModalOpen) {
      return (
        <ModalPie
          setPages={setPages}
          changeForm={handleFormChange}
          form={form}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          chartData={chartData}
          setChartData={setChartData}
        />
      );
    } else if (pages === 'poll') {
      return (
        <PollInput
          setPages={setPages}
          form={form}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
        />
      );
    }
  };

  const renderHashtags = (name: string, desc: string): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Typography className="text-lg text-black font-poppins font-medium">
          #{name}
        </Typography>
        <Typography className="font-poppins text-neutral-medium text-base">
          {desc} posts
        </Typography>
      </div>
    );
  };

  return (
    <>
      {width !== undefined && width > 640 ? (
        <Dialog
          open={open}
          handler={() => {
            setPages('text')
            handleOpen()
            setForm({
              content_text: '',
              privacy: 'public',
              media_urls: [],
              polling: {
                options: [],
                isMultiVote: false,
                canAddNewOption: false,
                endDate: ''
              },
              pie_title: '',
              pie_amount: 0,
              pie: [],
              premium_fee: ''
            })
            setAudio(null)
            setMedia([])
            setDocument(null)
            setHashtags([])
            setSelectedAsset([])
            setChartData(initialChartData)

            setOtherTagList({
              peopleList: [],
              circleList: [],
              playList: [],
              quizList: [],
              teamBattle: []
            })
            setDollarLists([])
            setHashtags([])
          }}
          size="lg"
          className="max-w-full w-[90%] md:w-[50%] lg:w-[40%]"
        >
          <div className="block bg-white w-full rounded-xl">
            <ModalChoosePricePremium
              isOpen={isOpenPremiumPrice}
              setIsOpen={setIsOpenPremiumPrice}
              changeForm={handleFormChange}
              form={form}
            />
            <div className="flex flex-col px-8 pt-8">
              <Toast
                message={errorMessage}
                show={isError}
                onClose={(): void => {
                  setIsError(false)
                }}
              />
              {pages !== 'gif' && pages !== 'talk' && (
                <div className="flex justify-between">
                  <div
                    onClick={() => {
                      setPages('text')
                    }}
                    className="cursor-pointer"
                  >
                    <ProfilePost
                      handleDropDown={handleDropDown}
                      dropVal={dropVal}
                      drop={drop}
                      dataSelection={dataSelection}
                      handleInputChange={handleInputChange}
                    />
                  </div>
                  <div
                    className="flex flex-col justify-start cursor-pointer"
                    onClick={() => {
                      handleOpen()
                      setForm({
                        content_text: '',
                        privacy: 'public',
                        media_urls: [],
                        polling: {
                          options: [],
                          isMultiVote: false,
                          canAddNewOption: false,
                          endDate: ''
                        },
                        pie_title: '',
                        pie_amount: 0,
                        pie: [],
                        premium_fee: ''
                      })
                      setAudio(null)
                      setMedia([])
                      setDocument(null)
                      setHashtags([])
                      setSelectedAsset([])
                      setChartData(initialChartData)
                      setOtherTagList({
                        peopleList: [],
                        circleList: [],
                        playList: [],
                        quizList: [],
                        teamBattle: []
                      })
                      setDollarLists([])
                      setHashtags([])
                    }}
                  >
                    <Image src={XIcon} alt="close" width={30} height={30} />
                  </div>
                </div>
              )}
              {/* form text section */}
              <form onSubmit={handlePostCircle}>
                {pages !== 'gif' && pages !== 'talk' && (
                  <div className="mt-3"> {handleTextPages()}</div>
                )}
                {audio !== null && pages !== 'gif' && pages !== 'talk' && (
                  <div className="flex justify-start pb-4 z-0">
                    <ShowAudioPlayer audioFile={audio} />
                  </div>
                )}
                <div className="flex flex-col max-w-1/2  max-h-full overflow-auto ">
                  <div className="flex justify-start ">
                    {document !== undefined &&
                      document !== null &&
                      pages !== 'gif' &&
                      pages !== 'talk' && (
                        <PDFViewer
                          file={document}
                          handleRemove={() => {
                            setDocument(null)
                          }}
                        />
                      )}
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-wrap gap-4">
                      {media.length > 0 &&
                        pages !== 'gif' &&
                        pages !== 'talk' &&
                        media.map((el: File, i: number) => (
                          <div
                            className="flex flex-col gap-4"
                            key={`${i} this is file`}
                          >
                            {el.type.includes('image') ? (
                              <div className="max-h-[30vh] max-w-[30vw] relative -top-6">
                                <div className="relative flex justify-end ">
                                  <div
                                    className="relative  flex justify-center items-center right-2 top-10 p-1 w-[32px] h-[32px] cursor-pointer rounded-full bg-transparent before:absolute before:inset-0 before:bg-neutral-ultrasoft before:opacity-40 before:rounded-full"
                                    onClick={() => {
                                      const newMedia = media.filter(
                                        (element, index) =>
                                          index !== i ? element : null
                                      )
                                      setMedia(media.length > 1 ? newMedia : [])
                                    }}
                                  >
                                    <IoCloseOutline
                                      size={16}
                                      color="#FFFFFF"
                                      className="relative z-10"
                                    />
                                  </div>
                                </div>

                                <Image
                                  src={URL?.createObjectURL(el)}
                                  alt="Preview Image"
                                  width={0}
                                  height={0}
                                  sizes="100vw"
                                  className="w-full h-auto object-cover sm:max-w-1/2 max-w-full rounded-2xl"
                                />
                              </div>
                            ) : (
                              <div className="max-h-[30vh]  sm:max-w-3/4 max-w-full relative -top-6">
                                <div className="relative flex justify-end ">
                                  <div
                                    className="relative  flex justify-center items-center right-2 top-10 p-1 w-[32px] h-[32px] cursor-pointer rounded-full bg-transparent before:absolute before:inset-0 before:bg-neutral-ultrasoft before:opacity-40 before:rounded-full"
                                    onClick={() => {
                                      const newMedia = media.filter(
                                        (element, index) =>
                                          index !== i ? element : null
                                      )
                                      setMedia(media.length > 1 ? newMedia : [])
                                    }}
                                  >
                                    <IoCloseOutline
                                      size={16}
                                      color="#FFFFFF"
                                      className="relative z-10"
                                    />
                                  </div>
                                </div>
                                <video
                                  controls
                                  className="max-w-full max-h-[30vh] object-fit rounded-2xl"
                                  key={el.name}
                                >
                                  <source
                                    src={URL?.createObjectURL(el)}
                                    type="video/mp4"
                                  />
                                </video>
                              </div>
                            )}
                          </div>
                        ))}
                      {form.media_urls.length > 0 &&
                        pages !== 'gif' &&
                        pages !== 'talk' &&
                        form.media_urls.map((el: any, i: number) => {
                          return (
                            <div
                              className="max-h-[230px] max-w-[230px] relative -top-6 "
                              key={`${i} + 'MEDIA_URL'`}
                            >
                              <div className="relative flex justify-end ">
                                <div
                                  className="relative  flex justify-center items-center right-2 top-10 p-1 w-[32px] h-[32px] cursor-pointer rounded-full bg-transparent before:absolute before:inset-0 before:bg-neutral-ultrasoft before:opacity-40 before:rounded-full"
                                  onClick={() => {
                                    const newMedia = form.media_urls.filter(
                                      (element, index) => {
                                        if (index !== i) {
                                          return element
                                        }
                                        return null
                                      }
                                    )
                                    if (form.media_urls.length > 1) {
                                      setForm(prevState => ({
                                        ...prevState,
                                        media_urls: newMedia
                                      }))
                                    } else {
                                      setForm(prevState => ({
                                        ...prevState,
                                        media_urls: []
                                      }))
                                    }
                                  }}
                                >
                                  <IoCloseOutline
                                    size={16}
                                    color="#FFFFFF"
                                    className="relative z-10"
                                  />
                                </div>
                              </div>
                              <img
                                src={el}
                                alt="gif"
                                className="h-[230px] w-[230px] object-cover rounded-2xl"
                              />
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  {form.polling?.options?.length > 0 && pages === 'text' ? (
                    form.polling?.options.map((el: any, i: number) => {
                      return (
                        <div
                          className="max-h-[230px] max-w-[230px] ml-16 mb-2 py-3 px-6 border border-[#BDBDBD] rounded-lg w-80"
                          key={`${i} + 'Polling'`}
                        >
                          {el.content_text}
                        </div>
                      )
                    })
                  ) : (
                    <></>
                  )}
                  {form.pie_title !== '' ? (
                    <div className={`mt-4 `}>
                      <PiePreviewPost
                        form={form}
                        userData={userInfo}
                        chartData={chartData}
                        data={selectedAsset}
                      />
                    </div>
                  ) : null}
                </div>

                {pages !== 'gif' && pages !== 'talk' && (
                  <div className="pt-4">
                    {' '}
                    <UniqueInputButton
                      setIsError={setIsError}
                      setErrorMessage={setErrorMessage}
                      setPages={setPages}
                      pageActive={pages}
                      setMedia={setMedia}
                      openPieModal={openPieModal}
                      setDocument={setDocument}
                      isEmpty={isDisable}
                      isError={isEmpty}
                      isTooMuch={isTooMuch}
                    />
                  </div>
                )}
                <div className="pb-12">{handlePages()}</div>
              </form>
            </div>
          </div>
        </Dialog>
      ) : (
        // Mobile Version
        <>
          {open && (
            <>
              <div className="flex fixed top-0 left-0 z-[1000] flex-col bg-white h-screen w-screen">
                <header className={`bg-white border-b p-5 rounded-xl md:mx-14`}>
                  <HeaderLogin />
                </header>
                <div className="flex-col bg-white h-full">
                  <div className="block bg-white w-full rounded-xl h-full ">
                    <ModalChoosePricePremium
                      isOpen={isOpenPremiumPrice}
                      setIsOpen={setIsOpenPremiumPrice}
                      changeForm={handleFormChange}
                      form={form}
                    />
                    <div className="flex flex-col px-6 pt-8 h-full">
                      <Toast
                        message={errorMessage}
                        show={isError}
                        onClose={(): void => {
                          setIsError(false)
                        }}
                      />
                      {pages !== 'gif' && (
                        <div className="flex justify-between">
                          <div
                            onClick={() => {
                              setPages('text')
                            }}
                            className="cursor-pointer"
                          >
                            <ProfilePost
                              handleDropDown={handleDropDown}
                              dropVal={dropVal}
                              drop={drop}
                              dataSelection={dataSelection}
                              handleInputChange={handleInputChange}
                            />
                          </div>
                          <div
                            className="flex flex-col justify-start cursor-pointer"
                            onClick={() => {
                              handleOpen()
                              setForm({
                                content_text: '',
                                privacy: 'public',
                                media_urls: [],
                                polling: {
                                  options: [],
                                  isMultiVote: false,
                                  canAddNewOption: false,
                                  endDate: ''
                                },
                                pie_title: '',
                                pie_amount: 0,
                                pie: [],
                                premium_fee: ''
                              })
                              setAudio(null)
                              setMedia([])
                              setDocument(null)
                              setHashtags([])
                              setSelectedAsset([])
                              setChartData(initialChartData)
                              setOtherTagList({
                                peopleList: [],
                                circleList: [],
                                playList: [],
                                quizList: [],
                                teamBattle: []
                              })
                              setDollarLists([])
                              setHashtags([])
                            }}
                          >
                            <div className="flex gap-2">
                              <div className="sm:hidden flex justify-end">
                                <button
                                  type="submit"
                                  disabled={isEmpty || isError}
                                  onClick={handlePostCircle}
                                  className={`flex justify-center py-2 items-center rounded-full px-6 font-semibold font-poppins h-fit ${
                                    isEmpty || isError
                                      ? 'bg-neutral-ultrasoft text-neutral-soft cursor-not-allowed'
                                      : 'bg-seeds-button-green text-white'
                                  }`}
                                >
                                  Post
                                </button>
                              </div>
                              <Image
                                src={XIcon}
                                alt="close"
                                width={30}
                                height={30}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {/* form text section */}
                      <form onSubmit={handlePostCircle} className="h-full">
                        {pages !== 'gif' && handleTextPages()}
                        <div className="flex justify-start pb-4 z-0">
                          {audio !== null && pages !== 'gif' && (
                            <ShowAudioPlayer audioFile={audio} />
                          )}
                        </div>

                        <div className="flex flex-col max-h-[300px] overflow-auto pb-2 ">
                          <div className="flex justify-center">
                            {document !== undefined &&
                              document !== null &&
                              pages !== 'gif' && <PDFViewer file={document} />}
                          </div>

                          <div className="flex items-center w-full">
                            <div className="flex flex-wrap gap-4 w-full ">
                              {media.length > 0 &&
                                pages !== 'gif' &&
                                media.map((el: File, i: number) => (
                                  <div
                                    className="flex flex-col gap-4 w-full"
                                    key={`${i} this is file`}
                                  >
                                    {el.type.includes('image') ? (
                                      <div className="max-h-[30vh] max-w-full relative -top-6">
                                        <div className="relative flex justify-end ">
                                          <div
                                            className="relative  flex justify-center items-center right-2 top-10 p-1 w-[32px] h-[32px] cursor-pointer rounded-full bg-transparent before:absolute before:inset-0 before:bg-neutral-ultrasoft before:opacity-40 before:rounded-full"
                                            onClick={() => {
                                              const newMedia = media.filter(
                                                (element, index) =>
                                                  index !== i ? element : null
                                              )
                                              setMedia(
                                                media.length > 1 ? newMedia : []
                                              )
                                            }}
                                          >
                                            <IoCloseOutline
                                              size={16}
                                              color="#FFFFFF"
                                              className="relative z-10"
                                            />
                                          </div>
                                        </div>
                                        <Image
                                          src={URL?.createObjectURL(el)}
                                          alt="Preview Image"
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          className="w-full h-auto object-cover  "
                                        />
                                      </div>
                                    ) : (
                                      <div className="max-h-[30vh] w-full relative -top-6">
                                        <div className="relative flex justify-end ">
                                          <div
                                            className="relative  flex justify-center items-center right-2 top-10 p-1 w-[32px] h-[32px] cursor-pointer rounded-full bg-transparent before:absolute before:inset-0 before:bg-neutral-ultrasoft before:opacity-40 before:rounded-full"
                                            onClick={() => {
                                              const newMedia = media.filter(
                                                (element, index) =>
                                                  index !== i ? element : null
                                              )
                                              setMedia(
                                                media.length > 1 ? newMedia : []
                                              )
                                            }}
                                          >
                                            <IoCloseOutline
                                              size={16}
                                              color="#FFFFFF"
                                              className="relative z-10"
                                            />
                                          </div>
                                        </div>
                                        <video
                                          controls
                                          className="max-w-full max-h-[30vh] object-fit rounded-2xl"
                                          key={el.name}
                                        >
                                          <source
                                            src={URL?.createObjectURL(el)}
                                            type="video/mp4"
                                          />
                                        </video>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              {form.media_urls.length > 0 &&
                                pages !== 'gif' &&
                                form.media_urls.map((el: any, i: number) => {
                                  return (
                                    <div
                                      className="max-h-full max-w-full w-full relative -top-6"
                                      key={`${i} + 'MEDIA_URL'`}
                                    >
                                      <div className="relative flex justify-end ">
                                        <div
                                          className="relative  flex justify-center items-center right-2 top-10 p-1 w-[32px] h-[32px] cursor-pointer rounded-full bg-transparent before:absolute before:inset-0 before:bg-neutral-ultrasoft before:opacity-40 before:rounded-full"
                                          onClick={() => {
                                            const newMedia =
                                              form.media_urls.filter(
                                                (element, index) => {
                                                  if (index !== i) {
                                                    return element
                                                  }
                                                  return null
                                                }
                                              )
                                            if (form.media_urls.length > 1) {
                                              setForm(prevState => ({
                                                ...prevState,
                                                media_urls: newMedia
                                              }))
                                            } else {
                                              setForm(prevState => ({
                                                ...prevState,
                                                media_urls: []
                                              }))
                                            }
                                          }}
                                        >
                                          <IoCloseOutline
                                            size={16}
                                            color="#FFFFFF"
                                            className="relative z-10"
                                          />
                                        </div>
                                      </div>
                                      <img
                                        src={el}
                                        alt="gif"
                                        className="h-full w-full object-cover rounded-2xl"
                                      />
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                          {form.polling?.options?.length > 0 &&
                          pages === 'text' ? (
                            form.polling?.options.map((el: any, i: number) => {
                              return (
                                <div
                                  className="max-h-[230px] max-w-[230px] ml-16 mb-2 py-3 px-6 border border-[#BDBDBD] rounded-lg w-80"
                                  key={`${i} + 'Polling'`}
                                >
                                  {el.content_text}
                                </div>
                              )
                            })
                          ) : (
                            <></>
                          )}
                          {form.pie_title !== '' ? (
                            <PiePreviewPost
                              form={form}
                              userData={userInfo}
                              chartData={chartData}
                              data={selectedAsset}
                            />
                          ) : null}
                        </div>
                        {pages !== 'gif' && (
                          <div
                            className={`flex flex-col sticky bottom-14 w-full`}
                          >
                            <div className="sm:hidden flex flex-col justify-center pl-3 ">
                              {drop && (
                                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl border border-neutral-soft w-full max-h-[50vh] overflow-y-auto transition-all">
                                  {dataSelection.map(
                                    (el: typeOfSelection, i) => (
                                      <label
                                        key={`${i}radioSelection`}
                                        className="cursor-pointer w-full"
                                      >
                                        <input
                                          type="radio"
                                          className="peer sr-only"
                                          name="type"
                                          onChange={handleInputChange}
                                          value={el.name}
                                        />
                                        <div className="w-[90%] mx-auto my-3 cursor-pointer z-50 rounded-md bg-white p-3 text-gray-600 ring-1 ring-[#7C7C7C] transition-all peer-checked:ring-seeds-green peer-checked:ring-offset-1 hover:shadow hover:text-seeds-green hover:ring-seeds-green">
                                          <div className="flex gap-3 items-center">
                                            <div className="flex flex-col justify-center">
                                              <Image
                                                alt={el.name}
                                                src={el.svg}
                                                className="h-[22px] w-[22px]"
                                              />
                                            </div>
                                            <div className="flex justify-between w-full gap-5">
                                              <div className="flex flex-col justify-start">
                                                <p className="text-xs font-semibold font-poppins text-[#262626]">
                                                  {el.name}
                                                </p>
                                                <p className="text-xs font-poppins text-[#7C7C7C]">
                                                  {el.message}
                                                </p>
                                              </div>
                                              <div className="flex flex-col justify-center">
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </label>
                                    )
                                  )}
                                </div>
                              )}

                              <button
                                className="font-poppins text-xs mb-4"
                                type="button"
                                onClick={handleDropDown}
                              >
                                <div className="flex w-fit px-2 rounded-full bg-neutral-ultrasoft gap-1">
                                  <div className="flex items-center">
                                    <Image
                                      alt="type"
                                      src={dropVal.svg}
                                      className="h-3 w-3 rounded-full"
                                    />
                                  </div>
                                  <Typography className="text-black text-xs font-poppins">
                                    {dropVal.type}
                                  </Typography>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M4.16516 6.61704L5.60796 8.30893C5.82521 8.56369 6.17616 8.56369 6.39342 8.30893L7.83622 6.61704C8.18717 6.2055 7.93649 5.5 7.4407 5.5H4.5551C4.05931 5.5 3.81421 6.2055 4.16516 6.61704Z"
                                      fill="#262626"
                                    />
                                  </svg>
                                </div>
                              </button>
                            </div>
                            <div className="w-full ">
                              {' '}
                              <UniqueInputButton
                                setIsError={setIsError}
                                setErrorMessage={setErrorMessage}
                                setPages={setPages}
                                setMedia={setMedia}
                                openPieModal={openPieModal}
                                setDocument={setDocument}
                                isEmpty={isDisable}
                                isError={isEmpty}
                                isTooMuch={isTooMuch}
                                pageActive={pages}
                              />
                            </div>
                          </div>
                        )}
                        {handlePages()}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
};

export default ModalMention;
