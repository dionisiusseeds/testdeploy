/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @next/next/no-img-element */
import back_nav from '@/assets/circle-page/back_nav.svg';
import more_vertical from '@/assets/more-option/more_vertical.svg';
import CCard from '@/components/CCard';
import MediaItem from '@/components/chat/MediaItem';
import ModalNewChat from '@/components/chat/ModalNewChat';
import MutePopUp from '@/components/chat/MutePopup';
import DeleteChatPopUp from '@/components/chat/PopUpDelete';
import LeaveCommunityPopUp from '@/components/chat/PopUpLeave';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { ChatVoiceRecorder } from '@/containers/chat/ChatVoiceRecording';
import ContactList from '@/containers/chat/ContactList';
import GifChat from '@/containers/chat/GifChat';
import withAuth from '@/helpers/withAuth';
import LeaveButton from '../../../public/assets/chat/logout-icon.svg';
// import useGetOnlineStatus from '@/hooks/useGetOnlineStatus';
import ModalCamera from '@/components/chat/ModalCamera';
import ModalRecordVideo from '@/components/chat/ModalRecordVideo';
import { getChatDate } from '@/helpers/dateFormat';
import {
  acceptRequest,
  deleteGroupChat,
  deletePersonalChat,
  getChat,
  getChatLinks,
  getChatMedia,
  getChatNotes,
  getGroupDetail,
  getListChat,
  getPersonalChatCommonGroups,
  getStorageMetadata,
  leaveGroupChat,
  muteGroupChat,
  mutePersonalChat,
  readGroupMessage,
  readPersonalMessage,
  rejectRequest,
  sendPersonalMessage
} from '@/repository/chat.repository';
import { UseUploadMedia } from '@/repository/circleDetail.repository';
import { getOtherUser } from '@/repository/profile.repository';
import socketService from '@/repository/socket.repository';
import { setFileMetadata } from '@/store/redux/features/chat-documents';
import {
  type AppDispatch,
  type RootState,
  useAppSelector
} from '@/store/redux/store';
import type {
  Chat,
  CommonGroupData,
  GetListChatParams,
  IChatBubble,
  IGroupChatDetail,
  MetadataFileInfo,
  PersonalChatMediaData,
  PersonalChatNotesData
} from '@/utils/interfaces/chat.interface';
import type { IOtherUserProfile } from '@/utils/interfaces/user.interface';
import {
  Avatar,
  Button,
  TabPanel,
  Tabs,
  TabsBody,
  Typography
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  newChat,
  noMessage,
  optionFolder,
  optionImage,
  optionMic,
  popUpOption,
  readChatIcon,
  sendChat
} from 'public/assets/chat';
import { ArrowBackwardIconWhite, XIcon } from 'public/assets/vector';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePicture } from 'react-icons/ai';
import {
  BsFileEarmark,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypePdf,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypeXls,
  BsFiletypeXlsx,
  BsThreeDotsVertical
} from 'react-icons/bs';
import {
  CiBellOff,
  CiCamera,
  CiSearch,
  CiTrash,
  CiVideoOn
} from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import defaultAvatar from '../../../public/assets/chat/default-avatar.svg';

const initialFilter: GetListChatParams = {
  page: 1,
  limit: 10,
  type: 'PERSONAL',
  search: '',
  unread: false
};

const ChatPages: React.FC = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dataUser } = useAppSelector(state => state.user);
  const { roomId, isGroupChat, newPersonalChat } = router.query;
  const [chatList, setChatList] = useState<Chat[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [isShowSeeMore, setIsShowSeeMore] = useState<boolean>(false);
  const [detailType, setDetailType] = useState<string>('media');
  const [filter, setFilter] = useState<GetListChatParams>(initialFilter);
  const [otherUserData, setOtherUserData] = useState<IOtherUserProfile | null>(
    null
  );
  const [groupData, setgroupData] = useState<IGroupChatDetail | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);
  const [isMutePopupOpen, setIsMutePopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLeavePopupOpen, setIsLeavePopupOpen] = useState<boolean>(false);
  const [isShowGifPopup, setIsShowGifPopup] = useState<boolean>(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [isShowPopUpOption, setIsShowPopUpOption] = useState<boolean>(false);
  const [isShowMediaOption, setIsShowMediaOption] = useState<boolean>(false);
  const [isModalCameraOpen, setIsModalCameraOpen] = useState<boolean>(false);
  const [isModalRecordOpen, setIsModalRecordOpen] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<IChatBubble[] | []>([]);
  const [message, setMessage] = useState<string>('');
  const [chatRequest, setChatRequest] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [personalMediaData, setPersonalMediaData] = useState<
    PersonalChatMediaData[] | []
  >([]);

  const [personalNotesData, setPersonalNotesData] = useState<
    PersonalChatNotesData[] | []
  >([]);

  const [personalLinksData, setPersonalLinksData] = useState<
    PersonalChatMediaData[] | []
  >([]);

  const [commonGroupData, setCommonGroupData] = useState<
    CommonGroupData[] | []
  >([]);
  const [audio, setAudio] = useState<File | null>(null);

  // const isOnline = useGetOnlineStatus(roomId as string);

  const [activeTab, setActiveTab] = useState<
    'PERSONAL' | 'COMMUNITY' | 'REQUEST'
  >('PERSONAL');
  const { t } = useTranslation();

  const handleChangeTab = (
    value: 'PERSONAL' | 'COMMUNITY' | 'REQUEST'
  ): void => {
    if (activeTab !== value) {
      setIsChatActive(false);
      setActiveTab(value);
      setChatList([]);
      // setHasMore(true);
      setFilter(prevState => ({
        ...prevState,
        type: value,
        page: 1
      }));
    }
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      dropdownRef.current !== null &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleListClick = (statusIsJoined: boolean): void => {
    if (statusIsJoined) {
      setActiveTab('COMMUNITY');
    } else {
      if (activeTab !== 'REQUEST') {
        setActiveTab('PERSONAL');
      } else {
        setActiveTab('REQUEST');
      }
    }
    setIsDropdownOpen(false);
    setIsChatActive(true);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleSendMessage = async (): Promise<void> => {
    const data =
      activeTab === 'COMMUNITY'
        ? { content_text: message, group_id: roomId as string }
        : { content_text: message, user_id: roomId as string };
    try {
      if (message !== '') {
        await sendPersonalMessage(data);
        void fetchChat();
        setMessage('');
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const handleSendGifMessage = async (mediaUrl: string): Promise<void> => {
    const data =
      activeTab === 'COMMUNITY'
        ? { media_urls: [mediaUrl], group_id: roomId as string }
        : { media_urls: [mediaUrl], user_id: roomId as string };
    try {
      await sendPersonalMessage(data);
      void fetchChat();
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleFilterUnreadChange = (): void => {
    setFilter((prevState: GetListChatParams) => ({
      ...prevState,
      unread: !filter.unread
    }));
  };

  const handleToggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSearchActive(false);
  };
  const handleDropdownOptionClick = (option: string): void => {
    switch (option) {
      case 'Search':
        setIsSearchActive(true);
        break;
      case 'Delete':
        setIsDeletePopupOpen(true);
        break;
      case 'Mute':
        setIsMutePopupOpen(true);
        break;
      case 'New':
        setIsNewPopupOpen(true);
        break;
      case 'Leave':
        setIsLeavePopupOpen(true);
        break;
      case 'Gif':
        setIsShowGifPopup(true);
        break;

      default:
    }
  };

  const fetchListChat = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (activeTab !== 'REQUEST') {
        const response = await getListChat({
          ...filter,
          type: 'PERSONAL'
        });
        const getListChatGroup = await getListChat({
          ...filter,
          type: 'COMMUNITY'
        });
        const getListChatRequest = await getListChat({
          ...filter,
          unread: true,
          type: 'REQUEST'
        });

        const newChatList = response.data;
        const newChatGroupList = getListChatGroup.data;
        const combinedChatList = [...newChatList, ...newChatGroupList];
        combinedChatList.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setChatRequest(getListChatRequest?.data?.length ?? 0);
        setChatList(combinedChatList);
      } else {
        const getListChatRequest = await getListChat({
          ...filter,
          type: 'REQUEST'
        });
        setChatList(getListChatRequest?.data);
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChat = useCallback(
    async (isRefetch: boolean = true): Promise<void> => {
      try {
        setIsLoading(true);
        if (activeTab === 'PERSONAL' || activeTab === 'REQUEST') {
          const response = await getChat({ user_id: roomId as string, limit });
          setMessageList(response.data);
          await readPersonalMessage(roomId as string);
        } else if (activeTab === 'COMMUNITY') {
          const response = await getChat({ group_id: roomId as string, limit });
          setMessageList(response.data);
          await readGroupMessage(roomId as string);
        }
      } catch (error: any) {
        toast('Oops! Error when try to get chat');
      } finally {
        setIsLoading(false);
        if (containerRef.current != null && isRefetch) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }
    },
    [activeTab, containerRef, limit, roomId]
  );

  useEffect(() => {
    const handleScrollEvent = (): void => {
      if (containerRef?.current?.scrollTop === 0) {
        setLimit(limit + 10);
        void fetchChat(false);
      }
    };

    containerRef?.current?.addEventListener('scroll', handleScrollEvent);
  }, [fetchChat, limit]);

  const muteChat = async (type: string): Promise<void> => {
    try {
      activeTab === 'PERSONAL'
        ? await mutePersonalChat({ user_id: roomId as string, type })
        : await muteGroupChat({ group_id: roomId as string, type });
    } catch (error: any) {
      toast('Oops! Error when try to mute chat');
    } finally {
      setIsMutePopupOpen(false);
    }
  };

  const deleteChat = async (): Promise<void> => {
    try {
      activeTab === 'PERSONAL'
        ? await deletePersonalChat(roomId as string)
        : await deleteGroupChat(roomId as string);
    } catch (error: any) {
      toast('Oops! Error when try to delete chat');
    } finally {
      setIsDeletePopupOpen(false);
      await router.push('/chat');
      await fetchListChat();
      setIsChatActive(false);
    }
  };

  const acceptRequestChat = async (): Promise<void> => {
    try {
      await acceptRequest(roomId as string);
    } catch (error: any) {
      toast('Oops! Error when try to accept request');
    } finally {
      setActiveTab('PERSONAL');
      setIsChatActive(false);
    }
  };

  const rejectRequestChat = async (): Promise<void> => {
    try {
      await rejectRequest(roomId as string);
    } catch (error: any) {
      toast('Oops! Error when try to reject request');
    } finally {
      setActiveTab('PERSONAL');
      setIsChatActive(false);
    }
  };

  const leaveCommunity = async (): Promise<void> => {
    try {
      await leaveGroupChat(roomId as string, {
        user_id: dataUser.id
      });
      await router.push('/chat');
    } catch (error: any) {
      toast('Oops! Error when try to Leave Community');
    } finally {
      setIsDeletePopupOpen(false);
      setIsLeavePopupOpen(false);
      setIsChatActive(false);
    }
  };

  useEffect(() => {
    void fetchListChat();
  }, [filter, isChatActive]);
  const fetchOtherUser = async (): Promise<void> => {
    try {
      const userData = await getOtherUser(roomId as string);
      setOtherUserData(userData);
    } catch (error: any) {
      toast(error, { type: 'error' });
      setOtherUserData(null);
    }
  };

  const fetchGroup = async (): Promise<void> => {
    try {
      const groupData: IGroupChatDetail = await getGroupDetail(
        roomId as string
      );
      setgroupData(groupData);
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const fetchNotes = async (): Promise<void> => {
    try {
      const personalNotes =
        activeTab === 'COMMUNITY'
          ? await getChatNotes({
              group_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            })
          : await getChatNotes({
              user_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            });
      setPersonalNotesData(personalNotes.data);
    } catch (error: any) {
      toast('Failed to fetch Notes');
      setPersonalNotesData([]);
    }
  };
  const fetchMedia = async (): Promise<void> => {
    try {
      const personalMedia =
        activeTab === 'COMMUNITY'
          ? await getChatMedia({
              group_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            })
          : await getChatMedia({
              user_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            });
      setPersonalMediaData(personalMedia.data);
    } catch (error: any) {
      toast('Failed to fetch Media');
      setPersonalMediaData([]);
    }
  };
  const fetchLink = async (): Promise<void> => {
    try {
      const personalLinks =
        activeTab === 'COMMUNITY'
          ? await getChatLinks({
              group_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            })
          : await getChatLinks({
              user_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            });
      setPersonalLinksData(personalLinks.data);
    } catch (error: any) {
      toast('Failed to fetch Links');
      setPersonalLinksData([]);
    }
  };
  const fetchCommonGroup = async (): Promise<void> => {
    try {
      const commonGroup = await getPersonalChatCommonGroups({
        user_id: roomId as string,
        page: 1,
        limit: 3
      });
      setCommonGroupData(commonGroup.data);
    } catch (error: any) {
      toast('Failed to fetch Group list');
      setCommonGroupData([]);
    }
  };
  const fetchDetailPersonal = async (): Promise<void> => {
    void fetchNotes();
    void fetchMedia();
    void fetchLink();
    void fetchCommonGroup();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setMessage(message + '\n');
    }
  };

  const postMedia = async (mediaFile: File): Promise<string | undefined> => {
    try {
      const { data } = await UseUploadMedia(mediaFile);
      return data?.path as string;
    } catch (error: any) {
      toast('error uploading file');
    }
  };

  const handleSendVoiceMessage = async (mediaFile: File): Promise<void> => {
    const mediaUrl = (await postMedia(mediaFile)) as string;
    const data =
      activeTab === 'COMMUNITY'
        ? { media_urls: [mediaUrl], group_id: roomId as string }
        : { media_urls: [mediaUrl], user_id: roomId as string };
    try {
      await sendPersonalMessage(data);
      void fetchChat();
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const handleSendImageMessage = async (event: any): Promise<any> => {
    const fileMedia = event.target.files[0];
    const fileMediaEle = event.target;
    if (fileMedia?.type?.includes('video') === true) {
      const validation =
        fileMedia?.type !== 'video/mp4' &&
        fileMedia?.type !== 'video/mov' &&
        fileMedia?.type !== 'video/webm';
      const maxFileMediaSize = 20;
      const sizeFileOnMB: any = parseFloat(
        (fileMedia?.size / 1024 / 1024).toFixed(20)
      );
      if (validation) {
        fileMediaEle.value = null;
        // setIsError(true);
        toast(`${t('social.errorState.video1')}`);
        return new Error(
          'You can only insert image in JPG, JPEG, PNG, .HEIC, .HEIF. format.'
        );
      }
      if (sizeFileOnMB > maxFileMediaSize) {
        fileMediaEle.value = null;
        // setIsError(true);
        toast(`${t('social.errorState.video3')}`);
        return new Error('Your image is exceeding the 20MB size limit');
      } else {
        const mediaUrl = (await postMedia(fileMedia)) as string;
        const data =
          activeTab === 'COMMUNITY'
            ? { media_urls: [mediaUrl], group_id: roomId as string }
            : { media_urls: [mediaUrl], user_id: roomId as string };
        try {
          await sendPersonalMessage(data);
          void fetchChat();
        } catch (error: any) {
          toast(error, { type: 'error' });
        }
      }
    }
    if (fileMedia?.type?.includes('image') === true) {
      const allowedTypes = [
        'image/jpeg',
        'image/heic',
        'image/heif',
        'image/svg+xml',
        'image/png'
      ];
      const validation = !allowedTypes.includes(fileMedia?.type);
      const maxFileMediaSize = 5;
      const sizeFileOnMB: any = parseFloat(
        (fileMedia?.size / 1024 / 1024).toFixed(20)
      );

      if (validation) {
        fileMediaEle.value = null;

        toast(`${t('social.errorState.image2')}`);
        return new Error(
          'You can only insert image in JPG, JPEG, PNG, .HEIC, .HEIF. format.'
        );
      }
      if (sizeFileOnMB > maxFileMediaSize) {
        fileMediaEle.value = null;

        toast(`${t('social.errorState.image1')}`);
        return new Error('Your image is exceeding the 5MB size limit');
      } else {
        const mediaUrl = (await postMedia(fileMedia)) as string;
        const data =
          activeTab === 'COMMUNITY'
            ? { media_urls: [mediaUrl], group_id: roomId as string }
            : { media_urls: [mediaUrl], user_id: roomId as string };
        try {
          await sendPersonalMessage(data);
          void fetchChat();
        } catch (error: any) {
          toast(error, { type: 'error' });
        }
      }
    }
    setIsShowMediaOption(!isShowMediaOption);
  };

  const handleMediaCapture = async (
    file: File,
    text?: string
  ): Promise<void> => {
    setIsShowPopUpOption(!isShowPopUpOption);
    setIsShowMediaOption(!isShowMediaOption);

    if (file === null || file === undefined) {
      return;
    }

    const maxFileSize = 64 * 1024 * 1024;

    if (file.size > maxFileSize) {
      toast.error(`${t('chat.maxFileAlert')} 64Mb`);
      return;
    }

    const mediaUrl = (await postMedia(file)) as string;
    if (mediaUrl !== '') {
      const data =
        activeTab === 'COMMUNITY'
          ? {
              media_urls: [mediaUrl],
              content_text: text as string,
              group_id: roomId as string
            }
          : {
              media_urls: [mediaUrl],
              content_text: text as string,
              user_id: roomId as string
            };
      try {
        await sendPersonalMessage(data);
        void fetchChat();
      } catch (error: any) {
        toast(error, { type: 'error' });
      }
    }
  };

  const handleSendDocument = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const fileMedia = event.target.files?.[0];
    setIsShowPopUpOption(!isShowPopUpOption);

    if (fileMedia == null) {
      return;
    }

    const maxFileSize = 50 * 1024 * 1024;

    if (fileMedia.size > maxFileSize) {
      toast.error(`${t('chat.maxFileAlert')} 64Mb`);
      return;
    }

    const mediaUrl = (await postMedia(fileMedia)) as string;
    if (mediaUrl !== '') {
      const data =
        activeTab === 'COMMUNITY'
          ? { media_urls: [mediaUrl], group_id: roomId as string }
          : { media_urls: [mediaUrl], user_id: roomId as string };
      try {
        await sendPersonalMessage(data);
        void fetchChat();
      } catch (error: any) {
        toast(error, { type: 'error' });
      }
    }
  };

  const allowedExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx'
  ];

  const processFileUrl = async (url: string): Promise<MetadataFileInfo> => {
    const response: MetadataFileInfo = await getStorageMetadata(url);
    return response;
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    }
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(0)} KB`;
    }
    return `${(sizeInBytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const RenderDocumentInfo = ({
    message
  }: {
    message: string;
  }): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
    const fileMetadataCache = useSelector(
      (state: RootState) => state.chatDocuments.cache
    );
    const [fileDetails, setFileDetails] = useState<MetadataFileInfo>({
      id: '',
      name: '',
      size: 0,
      extension: '',
      type: '',
      url: '',
      created_at: '',
      updated_at: ''
    });

    const fetchFileDetails = async (): Promise<void> => {
      if (
        fileMetadataCache[message] !== null &&
        fileMetadataCache[message] !== undefined
      ) {
        setFileDetails(fileMetadataCache[message]);
        return;
      }
      try {
        const details = await processFileUrl(message);
        dispatch(setFileMetadata({ url: message, metadata: details }));
        setFileDetails(details);
      } catch (error: any) {
        toast.error('Error processing document:', error);
      }
    };

    useEffect(() => {
      void fetchFileDetails();
    }, [message]);

    const fileTypeIcons: Record<string, JSX.Element> = {
      pdf: <BsFiletypePdf size={24} />,
      doc: <BsFiletypeDoc size={24} />,
      docx: <BsFiletypeDocx size={24} />,
      xls: <BsFiletypeXls size={24} />,
      xlsx: <BsFiletypeXlsx size={24} />,
      ppt: <BsFiletypePpt size={24} />,
      pptx: <BsFiletypePptx size={24} />
    };

    return (
      <a
        href={message}
        target="_blank"
        download={fileDetails.name.slice(0, fileDetails.name.indexOf('.'))}
        className="w-full flex items-center gap-2 cursor-pointer no-underline"
      >
        {fileTypeIcons[fileDetails.extension] ?? <BsFileEarmark size={24} />}
        <div className="flex flex-col text-nowrap">
          <Typography className="font-normal text-sm font-poppins text-black text-nowrap">
            {fileDetails.name.length > 15
              ? `${fileDetails.name.slice(0, 8)}...`
              : fileDetails.name}
          </Typography>
          <Typography className="font-normal text-xs font-poppins">
            {formatFileSize(fileDetails.size)} . {fileDetails?.extension}
          </Typography>
        </div>
      </a>
    );
  };

  useEffect(() => {
    if (roomId === null) {
      return;
    }

    socketService.addListener(`chat.personal.${roomId as string}`, () => {
      void fetchChat(false);
    });

    return () => {};
  }, [roomId]);

  useEffect(() => {
    socketService.connect(dataUser.id);
    return () => {};
  }, []);

  useEffect(() => {
    if (roomId !== undefined) {
      if (activeTab === 'COMMUNITY' || isGroupChat !== undefined) {
        void fetchGroup();
      } else {
        void fetchOtherUser();
      }
      void fetchChat();
    }
  }, [roomId, isGroupChat]);

  const fetchGroupChat = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (messageList.length === 0) {
        const message = await getChat({ group_id: roomId as string, limit });
        setMessageList(message.data);
      }
    } catch (error: any) {
      toast.error('Error fetching chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isGroupChat === undefined) return;
    setActiveTab('COMMUNITY');
    setIsChatActive(true);

    const timeoutId = setTimeout(() => {
      void fetchGroupChat();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isGroupChat, roomId]);

  useEffect(() => {
    if (newPersonalChat !== undefined) {
      setIsChatActive(true);
    }
  }, [newPersonalChat]);

  const renderDetailChatItem = (): JSX.Element | undefined => {
    if (detailType === 'media') {
      return (
        <div className="w-full flex gap-4">
          {personalMediaData?.map((item: PersonalChatMediaData) => (
            <MediaItem key={item.id} message={item} />
          ))}
        </div>
      );
    }
    if (detailType === 'note') {
      return (
        <div className="w-full flex">
          {personalNotesData?.map((item: PersonalChatNotesData) => (
            <div key={item?.id}>
              <div className="flex gap-4">
                <Image
                  src={otherUserData?.avatar as string}
                  alt="Avatar"
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] h-[30px]"
                />
                <div className="flex flex-col">
                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                    {otherUserData?.name}
                  </Typography>
                  <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                    {moment(item?.created_at).format('MM/DD/YY, HH:mm')}
                  </Typography>
                  <Typography className="text-mxl font-medium text-[#262626] font-poppins mb-2">
                    {item?.content_text}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (detailType === 'link') {
      return (
        <div className="w-full flex">
          {personalLinksData?.map((item: PersonalChatMediaData) => (
            <div key={item?.id}>
              <div className="flex gap-4">
                <Image
                  src={otherUserData?.avatar as string}
                  alt="Avatar"
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] h-[30px]"
                />
                <div className="flex flex-col">
                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                    {otherUserData?.name}
                  </Typography>
                  <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                    {moment(item?.created_at).format('MM/DD/YYYY')}
                  </Typography>

                  <Typography
                    href={item?.content_text}
                    className="text-mxl underline font-medium text-[#262626] font-poppins mb-2"
                  >
                    {item?.content_text}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (detailType === 'groups') {
      return (
        <div className="w-full flex">
          {commonGroupData?.map((item: CommonGroupData) => (
            <div key={item?.id}>
              <div className="flex gap-4">
                <Image
                  src={item?.avatar}
                  alt="Avatar"
                  width={56}
                  height={56}
                  className="rounded-full w-14 h-14"
                />
                <div className="flex flex-col">
                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                    {item?.name}
                  </Typography>
                  <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                    {item?.top_members?.map(member => member.name).join(', ')}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {router?.asPath === '/chat' && (
        <div className="flex items-center gap-2 fixed right-6 md:right-24 bottom-10 z-10">
          <div
            className="flex justify-center items-center w-[60px] h-auto cursor-pointer hover:scale-110 duration-300"
            onClick={() => {
              handleDropdownOptionClick('New');
            }}
          >
            <Image
              src={newChat}
              alt="newChat"
              width={1000}
              height={1000}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
      {isDeletePopupOpen && (
        <DeleteChatPopUp
          onClose={() => {
            setIsDeletePopupOpen(false);
          }}
          onClick={deleteChat}
        />
      )}
      {isLeavePopupOpen && (
        <LeaveCommunityPopUp
          onClose={() => {
            setIsLeavePopupOpen(false);
          }}
          onClick={leaveCommunity}
        />
      )}
      {isMutePopupOpen && (
        <MutePopUp
          onClose={() => {
            setIsMutePopupOpen(false);
          }}
          onMute={muteChat}
        />
      )}
      {isNewPopupOpen && (
        <ModalNewChat
          onClose={() => {
            setIsNewPopupOpen(false);
          }}
          onPersonalClick={() => {
            setIsNewPopupOpen(false);
            void router.push('/chat/create-message');
          }}
          onGroupClick={() => {
            setIsNewPopupOpen(false);
            void router.push('/chat/group/create');
          }}
        />
      )}
      {isShowDetail ? (
        <div className="w-full bg-white py-4 px-5">
          {isShowSeeMore ? (
            <>
              <div className="flex justify-between items-center">
                <div
                  onClick={() => {
                    setIsShowSeeMore(false);
                  }}
                >
                  <Image
                    alt="Back"
                    src={back_nav}
                    className="h-6 w-6 object-cover"
                  />
                </div>
                <Image
                  src={more_vertical}
                  alt="threeDots"
                  className="cursor-pointer"
                />
              </div>
              {renderDetailChatItem()}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div
                  onClick={() => {
                    setIsShowDetail(false);
                  }}
                >
                  <Image
                    alt="Back"
                    src={back_nav}
                    className="h-6 w-6 object-cover"
                  />
                </div>
                <Image
                  src={more_vertical}
                  alt="threeDots"
                  className="cursor-pointer"
                />
              </div>
              <div className="w-full py-4 flex flex-col gap-4 justify-center items-center bg-[#DCFCE4]">
                <img
                  src={otherUserData?.avatar as string}
                  alt="avatar"
                  className="rounded-full w-36 h-36 bg-[#3AC4A0]"
                />
                <Typography className="text-md text-[#3AC4A0] font-poppins">
                  @{otherUserData?.seeds_tag}
                </Typography>
              </div>
              <div className="w-full flex flex-col p-4 gap-8">
                <div>
                  <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                    Bio
                  </Typography>
                  <Typography className="text-md text-[#262626] font-poppins">
                    {otherUserData?.bio}
                  </Typography>
                </div>
                <div className="w-full border-b border-[#E9E9E9]">
                  <div className="w-full flex justify-between">
                    <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                      Notes
                    </Typography>
                    <Typography
                      onClick={() => {
                        setDetailType('note');
                        void fetchDetailPersonal();
                        setIsShowSeeMore(true);
                      }}
                      className="text-md text-[#3AC4A0] font-poppins mb-2"
                    >
                      {t('chat.seeMore')}
                    </Typography>
                  </div>

                  {personalNotesData?.map((item: PersonalChatNotesData) => (
                    <div key={item?.id}>
                      <div className="flex gap-4">
                        <Image
                          src={otherUserData?.avatar as string}
                          alt="Avatar"
                          width={30}
                          height={30}
                          className="rounded-full w-[30px] h-[30px]"
                        />
                        <div className="flex flex-col">
                          <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                            {otherUserData?.name}
                          </Typography>
                          <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                            {moment(item?.created_at).format('MM/DD/YY, HH:mm')}
                          </Typography>
                          <Typography className="text-mxl font-medium text-[#262626] font-poppins mb-2">
                            {item?.content_text}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full">
                  <div className="w-full flex justify-between">
                    <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                      Media
                    </Typography>
                    <Typography
                      onClick={() => {
                        setDetailType('media');
                        setIsShowSeeMore(true);
                      }}
                      className="text-md text-[#3AC4A0] font-poppins mb-2"
                    >
                      {t('chat.seeMore')}
                    </Typography>
                  </div>
                  <div className="w-full flex gap-4">
                    {personalMediaData?.map((item: PersonalChatMediaData) => {
                      if (item.media_url.includes('mp3')) {
                        return null;
                      }
                      if (
                        item.media_url.includes('mp4') ||
                        item.media_url.includes('mov') ||
                        item.media_urls.includes('webm')
                      ) {
                        return (
                          <div key={item.id} className="w-1/3 h-42 rounded-md">
                            <video width="320" height="144" controls>
                              <source src={item.media_url} type="video/mp4" />
                            </video>
                          </div>
                        );
                      } else {
                        return (
                          <div key={item.id} className="w-1/3 h-36 rounded-md">
                            <img
                              src={item?.media_url}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                <div className="w-full border-b border-[#E9E9E9]">
                  <div className="w-full flex justify-between">
                    <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                      Links
                    </Typography>
                    <Typography
                      onClick={() => {
                        setDetailType('link');
                        setIsShowSeeMore(true);
                      }}
                      className="text-md text-[#3AC4A0] font-poppins mb-2"
                    >
                      {t('chat.seeMore')}
                    </Typography>
                  </div>
                  {personalLinksData?.map((item: PersonalChatMediaData) => (
                    <div key={item?.id} className="w-full overflow-hidden">
                      <div className="flex gap-4">
                        <Image
                          src={otherUserData?.avatar as string}
                          alt="Avatar"
                          width={30}
                          height={30}
                          className="rounded-full w-[30px] h-[30px]"
                        />
                        <div className="flex flex-col">
                          <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                            {otherUserData?.name}
                          </Typography>
                          <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                            {moment(item?.created_at).format('MM/DD/YYYY')}
                          </Typography>

                          <Link
                            href={item?.content_text}
                            className="text-mxl underline font-medium text-[#262626] font-poppins mb-2 break-all overflow-hidden text-ellipsis"
                          >
                            {item?.content_text}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full border-b border-[#E9E9E9]">
                  <div className="w-full flex justify-between">
                    <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                      {t('chat.commonGroup')}
                    </Typography>
                    <Typography
                      onClick={() => {
                        setDetailType('groups');
                        setIsShowSeeMore(true);
                      }}
                      className="text-md text-[#3AC4A0] font-poppins mb-2"
                    >
                      {t('chat.seeMore')}
                    </Typography>
                  </div>
                  {commonGroupData?.map((item: CommonGroupData) => (
                    <div key={item?.id}>
                      <div className="flex gap-4">
                        <Image
                          src={item?.avatar}
                          alt="Avatar"
                          width={56}
                          height={56}
                          className="rounded-full w-14 h-14"
                        />
                        <div className="flex flex-col">
                          <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                            {item?.name}
                          </Typography>
                          <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                            {item?.top_members
                              ?.map(member => member.name)
                              .join(', ')}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-start gap-4">
          <CCard
            className={`w-full border-none rounded-xl h-fit ${
              chatList?.length !== 0 || isChatActive
                ? 'hidden'
                : 'lg:flex flex-col'
            } ${isChatActive ? 'hidden' : 'flex'}`}
          >
            <div
              style={{ backgroundImage: "url('/assets/chat/bg-chat.svg')" }}
              className="w-full bg-cover rounded-t-xl lg:h-[150px] h-[130px] flex items-center"
            >
              <div className="w-full flex justify-between items-center mx-[18px]">
                <Image
                  src={ArrowBackwardIconWhite}
                  alt="icon"
                  width={24}
                  height={24}
                  className="text-white cursor-pointer hover:scale-110 duration-150"
                  onClick={async () => {
                    activeTab !== 'REQUEST'
                      ? await router.push('/homepage')
                      : handleChangeTab('PERSONAL');
                  }}
                />
                <Typography className="flex-1 text-center font-poppins font-semibold text-lg text-white">
                  {t('chat.chat')}
                </Typography>
              </div>
            </div>
            <div className="flex flex-col mb-4 bg-white px-4 mt-[-20px] rounded-t-3xl">
              <Tabs value={activeTab}>
                <TabsBody>
                  <TabPanel value="PERSONAL" className="py-0 pt-2 px-0 mt-2">
                    <ContactList
                      data={chatList}
                      userId={dataUser?.id ?? ''}
                      handleFilterUnreadChange={handleFilterUnreadChange}
                      handleListClick={handleListClick}
                      handleChangeTab={handleChangeTab}
                      activeTab={activeTab}
                      isLoading={isLoading}
                      chatRequest={chatRequest}
                    />
                    {isLoading ? (
                      <div className="flex items-center justify-center my-8">
                        <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
                      </div>
                    ) : (
                      chatList?.length === 0 && (
                        <div className="flex flex-col items-center pt-10 pb-16">
                          <Image src={noMessage} alt="Seedy No Chat" />
                          <Typography className="font-poppins text-md text-[#BDBDBD] mt-[-24px]">
                            {t('chat.personalEmptyState')}
                          </Typography>
                          <Typography className="font-poppins text-md text-[#BDBDBD]">
                            {t('chat.startChat')}
                          </Typography>
                        </div>
                      )
                    )}
                  </TabPanel>
                  <TabPanel value="REQUEST" className="py-0 pt-2 px-0">
                    <ContactList
                      data={chatList}
                      userId={dataUser?.id ?? ''}
                      handleFilterUnreadChange={handleFilterUnreadChange}
                      handleListClick={handleListClick}
                      handleChangeTab={handleChangeTab}
                      activeTab={activeTab}
                      isLoading={isLoading}
                    />
                    {isLoading ? (
                      <div className="flex items-center justify-center my-8">
                        <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
                      </div>
                    ) : (
                      chatList?.length === 0 && (
                        <div className="flex flex-col items-center pt-10 pb-16">
                          <Image src={noMessage} alt="Seedy No Chat" />
                          <Typography className="font-poppins text-md text-[#BDBDBD] mt-[-24px]">
                            {t('chat.requestEmptyState')}
                          </Typography>
                        </div>
                      )
                    )}
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </div>
          </CCard>
          {isChatActive && (
            <CCard
              className={`lg:flex lg:flex-col border-none rounded-xl bg-white ${
                isChatActive ? 'w-full flex' : 'w-full'
              }`}
            >
              {roomId !== undefined && isChatActive && (
                <>
                  {isSearchActive ? (
                    <div className="flex w-full justify-around">
                      <Image
                        src={XIcon}
                        alt="X"
                        width={30}
                        height={30}
                        onClick={() => {
                          setIsSearchActive(false);
                        }}
                        className="mx-2 w-1/8 hover:scale-110 transition ease-out cursor-pointer"
                      />
                      <input
                        type="text"
                        className="p-2 border-2 w-full rounded-xl m-2"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder="Search..."
                      />
                      <div className="justify-center items-center  w-1/8 mx-2 my-auto">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 7L7 1L1 7"
                            stroke="#262626"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="justify-center my-auto items-center mx-2 w-1/8">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="#262626"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundImage: "url('/assets/chat/bg-chat.svg')"
                      }}
                      className={`w-full bg-cover flex rounded-t-xl border-b border-solid ${
                        isLoading ? 'justify-center' : 'justify-between'
                      } items-center lg:h-[150px] h-[130px]`}
                    >
                      {isLoading ? (
                        <div className="animate-spinner w-8 h-8 border-8 border-seeds-green border-t-gray-200 rounded-full"></div>
                      ) : (
                        <div className="w-full flex justify-between items-center mx-[18px]">
                          <div className="w-fit flex justify-between items-center">
                            <Image
                              src={ArrowBackwardIconWhite}
                              alt="icon"
                              width={24}
                              height={24}
                              className="text-white cursor-pointer hover:scale-110 duration-150"
                              onClick={async () => {
                                await router.push('/chat');
                                setIsChatActive(false);
                              }}
                            />
                          </div>
                          <div className="grid bg-[#DCFCE4] py-2 px-4 gap-2 items-center rounded-full grid-cols-[auto_1fr] place-items-center">
                            <div className="relative">
                              <Avatar
                                onClick={async () => {
                                  activeTab === 'COMMUNITY'
                                    ? await router.push(
                                        `/chat/group/${roomId as string}`
                                      )
                                    : setIsShowDetail(true);
                                  if (activeTab === 'PERSONAL') {
                                    await fetchDetailPersonal();
                                  }
                                }}
                                src={
                                  activeTab === 'COMMUNITY'
                                    ? groupData?.avatar === ''
                                      ? defaultAvatar.src
                                      : groupData?.avatar
                                    : (otherUserData?.avatar as string)
                                }
                                className="block max-w-8 max-h-8 cursor-pointer"
                                alt="avatar"
                                width={24}
                                height={24}
                              />
                              <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                                  (otherUserData?.status_online as boolean)
                                    ? 'bg-[#3AC4A0]'
                                    : 'bg-transparent'
                                }`}
                              />
                            </div>
                            <div className="flex flex-col w-full h-fit">
                              {activeTab === 'COMMUNITY' ? (
                                <div>
                                  <Typography className="font-semibold text-xs text-[#3AC4A0] font-poppins">
                                    {groupData?.name}
                                  </Typography>
                                  <Typography className="font-normal text-[10px] text-[#3AC4A0] font-poppins">
                                    {`${
                                      groupData?.total_memberships as number
                                    } ${t('chat.members')}`}
                                  </Typography>
                                </div>
                              ) : (
                                <div
                                  className="flex flex-col gap-2 h-fit"
                                  onClick={() => {
                                    setIsShowDetail(true);
                                    void fetchDetailPersonal();
                                  }}
                                >
                                  <Typography className="font-semibold text-sm text-[#3AC4A0] font-poppins">
                                    {otherUserData?.name}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className="relative flex items-center cursor-pointer"
                            ref={dropdownRef}
                          >
                            <BsThreeDotsVertical
                              className="cursor-pointer text-white"
                              width={24}
                              height={24}
                              onClick={e => {
                                // Menambahkan event.stopPropagation() untuk menghentikan propogasi klik
                                e.stopPropagation();
                                handleToggleDropdown();
                              }}
                            />
                            {isDropdownOpen && (
                              <div className="absolute z-10 right-2 top-8 flex flex-col bg-white border border-gray-300 rounded-md shadow-md w-[170px]">
                                <div
                                  className="dropdown-option flex items-center p-2 gap-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleDropdownOptionClick('Search');
                                  }}
                                >
                                  <CiSearch
                                    size={24}
                                    className="text-[#201B1C"
                                  />
                                  <h1 className="text-sm font-poppins font-normal text-[#201B1C]">
                                    {t('chat.search')}
                                  </h1>
                                </div>
                                <div
                                  className="dropdown-option flex items-center p-2 gap-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleDropdownOptionClick('Mute');
                                  }}
                                >
                                  <CiBellOff
                                    size={24}
                                    className="text-[#201B1C]"
                                  />
                                  <h1 className="text-sm font-poppins font-normal text-[#201B1C]">
                                    {t('chat.mute')}
                                  </h1>
                                </div>
                                <div
                                  className="dropdown-option flex items-center p-2 gap-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleDropdownOptionClick('Delete');
                                  }}
                                >
                                  <CiTrash
                                    size={24}
                                    className="text-[#DD2525]"
                                  />
                                  <h1 className="text-sm font-normal font-poppins text-[#DD2525]">
                                    {t('chat.deleteChat')}
                                  </h1>
                                </div>
                                {activeTab === 'COMMUNITY' && (
                                  <div
                                    className="dropdown-option flex items-center p-2 gap-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      handleDropdownOptionClick('Leave');
                                    }}
                                  >
                                    <Image
                                      src={LeaveButton}
                                      width={24}
                                      height={24}
                                      alt="Leave"
                                    />
                                    <h1 className="text-sm font-normal font-poppins text-[#DD2525] whitespace-nowrap">
                                      {t('chat.menuBar.leaveGroup')}
                                    </h1>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    ref={containerRef}
                    className={`relative bg-white shadow-sm flex-grow w-full min-h-[420px] py-4 max-h-[70vh] overflow-y-scroll`}
                  >
                    {messageList.length === 0 && (
                      <div className="flex flex-col items-center py-10">
                        <Image
                          src={noMessage}
                          alt="Seedy No Chat"
                          className=""
                        />
                        <Typography className="font-poppins text-md text-[#BDBDBD] mt-[-24px]">
                          {t('chat.personalEmptyState')}
                        </Typography>
                        <Typography className="font-poppins text-md text-[#BDBDBD]">
                          {t('chat.startChat')}
                        </Typography>
                      </div>
                    )}
                    {messageList?.length > 0 && (
                      <div className="flex flex-col gap-4 justify-end">
                        {messageList?.map((message: IChatBubble, index) => {
                          if (message.created_by === dataUser.id) {
                            if (
                              message.content_text?.length > 0 &&
                              message?.media_urls?.length === 0
                            ) {
                              return (
                                <div
                                  key={message.id}
                                  className="flex flex-col w-full"
                                >
                                  <div className="flex gap-3 bg-[#EDFCD3] px-4 self-end max-w-[60%] rounded-full mx-4">
                                    <Typography
                                      className={`my-1 ${
                                        message.content_text.includes(
                                          searchText
                                        ) && searchText !== ''
                                          ? 'font-poppins break-all text-black bg-[#FBF719]'
                                          : 'font-poppins break-all text-black'
                                      }`}
                                    >
                                      {message.content_text}
                                    </Typography>
                                    <div className="flex justify-center items-center gap-2 mt-3">
                                      <Typography className="text-xs text-[#7C7C7C]">
                                        {getChatDate(
                                          message?.created_at ??
                                            '0001-01-01T00:00:00Z'
                                        )}
                                      </Typography>
                                      {message?.read_at !==
                                        '0001-01-01T00:00:00Z' && (
                                        <div className="flex justify-center items-center w-auto h-[10px]">
                                          <Image
                                            src={readChatIcon}
                                            width={1000}
                                            height={1000}
                                            alt="readChatIcon"
                                            className="w-full h-auto"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              message.media_urls[0]?.includes('mp3')
                            ) {
                              return (
                                <div
                                  key={message?.id}
                                  className="w-fit flex flex-col justify-center items-center bg-[#EDFCD3] rounded-2xl p-3 relative self-end mx-4"
                                >
                                  <div className="flex justify-center items-center gap-2">
                                    <div className="flex justify-center items-center h-[50px] w-auto rounded-full overflow-hidden">
                                      <img
                                        src={dataUser?.avatar}
                                        alt="Seedy No Chat"
                                        className="h-full w-auto"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <audio
                                        controls
                                        className="self-end w-[200px] md:w-[300px]"
                                      >
                                        <source
                                          src={message.media_urls[0]}
                                          type="audio/wav"
                                          className="w-full"
                                        />
                                        Your browser does not support the audio
                                        element.
                                      </audio>
                                    </div>
                                  </div>
                                  <div className="w-full flex justify-end items-center gap-2 mt-2">
                                    <Typography className="text-xs text-[#7C7C7C]">
                                      {getChatDate(
                                        message?.created_at ??
                                          '0001-01-01T00:00:00Z'
                                      )}
                                    </Typography>
                                    {message?.read_at !==
                                      '0001-01-01T00:00:00Z' && (
                                      <div className="flex justify-center items-center w-auto h-[10px]">
                                        <Image
                                          src={readChatIcon}
                                          width={1000}
                                          height={1000}
                                          alt="readChatIcon"
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              (message.media_urls[0]?.includes('mp4') ||
                                message.media_urls[0]?.includes('mov') ||
                                message.media_urls[0]?.includes('webm'))
                            ) {
                              return (
                                <div
                                  key={message.id}
                                  className="flex flex-col p-2 self-end max-w-[60%] rounded-lg mx-4 bg-[#EDFCD3]"
                                >
                                  <video
                                    width="320"
                                    height="240"
                                    controls
                                    className="rounded-2xl"
                                  >
                                    <source
                                      src={message.media_urls[0]}
                                      type="video/mp4"
                                    />
                                  </video>
                                  <div className="mt-2">
                                    {message?.content_text?.length > 0 && (
                                      <Typography
                                        className={`${
                                          message?.content_text.includes(
                                            searchText
                                          ) && searchText !== ''
                                            ? 'font-poppins break-all text-black bg-[#FBF719]'
                                            : 'font-poppins break-all text-black'
                                        }`}
                                      >
                                        {message?.content_text}
                                      </Typography>
                                    )}
                                    <div className="w-full flex justify-end items-center gap-2">
                                      <Typography className="text-xs text-[#7C7C7C]">
                                        {getChatDate(
                                          message?.created_at ??
                                            '0001-01-01T00:00:00Z'
                                        )}
                                      </Typography>
                                      {message?.read_at !==
                                        '0001-01-01T00:00:00Z' && (
                                        <div className="flex justify-center items-center w-auto h-[10px]">
                                          <Image
                                            src={readChatIcon}
                                            width={1000}
                                            height={1000}
                                            alt="readChatIcon"
                                            className="w-full h-auto"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (
                              message?.media_urls?.length > 0 &&
                              allowedExtensions.some(ext =>
                                message?.media_urls[0]?.includes(ext)
                              )
                            ) {
                              return (
                                <div
                                  key={message.id}
                                  className="flex items-center p-4 self-end max-w-60% rounded-lg mx-4 gap-2 bg-[#EDFCD3]"
                                >
                                  <RenderDocumentInfo
                                    message={message?.media_urls[0]}
                                  />
                                  <div className="flex justify-end items-center gap-2 w-full">
                                    <Typography className="text-xs text-[#7C7C7C] text-nowrap">
                                      {getChatDate(
                                        message?.created_at ??
                                          '0001-01-01T00:00:00Z'
                                      )}
                                    </Typography>
                                    {message?.read_at !==
                                      '0001-01-01T00:00:00Z' && (
                                      <div className="flex justify-center items-center w-auto h-[10px]">
                                        <Image
                                          src={readChatIcon}
                                          width={1000}
                                          height={1000}
                                          alt="readChatIcon"
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={message.id}
                                  className="flex flex-col p-2 self-end max-w-[60%] rounded-lg mx-4 bg-[#EDFCD3]"
                                >
                                  {message?.media_urls?.length > 0 && (
                                    <img
                                      className="max-w-[225px] max-h-[200px] object-cover rounded-3xl"
                                      src={message.media_urls[0]}
                                      alt="Image"
                                      width={225}
                                      height={170}
                                    />
                                  )}
                                  <div className="mt-2">
                                    {message?.content_text?.length > 0 && (
                                      <Typography
                                        className={`${
                                          message?.content_text.includes(
                                            searchText
                                          ) && searchText !== ''
                                            ? 'font-poppins break-all text-black bg-[#FBF719]'
                                            : 'font-poppins break-all text-black'
                                        }`}
                                      >
                                        {message?.content_text}
                                      </Typography>
                                    )}
                                    <div className="w-full flex justify-end items-center gap-2">
                                      <Typography className="text-xs text-[#7C7C7C]">
                                        {getChatDate(
                                          message?.created_at ??
                                            '0001-01-01T00:00:00Z'
                                        )}
                                      </Typography>
                                      {message?.read_at !==
                                        '0001-01-01T00:00:00Z' && (
                                        <div className="flex justify-center items-center w-auto h-[10px]">
                                          <Image
                                            src={readChatIcon}
                                            width={1000}
                                            height={1000}
                                            alt="readChatIcon"
                                            className="w-full h-auto"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          } else {
                            if (
                              message.content_text?.length > 0 &&
                              message?.media_urls?.length === 0
                            ) {
                              return (
                                <div
                                  className="flex ml-4 gap-2"
                                  key={message.id}
                                >
                                  <Image
                                    width={32}
                                    height={32}
                                    src={
                                      message?.owner?.avatar ??
                                      otherUserData?.avatar
                                    }
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div className="flex gap-3 bg-[#DCFCE4] py-1 px-4 self-start max-w-[60%] rounded-full mx-4">
                                    <Typography
                                      className={
                                        message.content_text.includes(
                                          searchText
                                        ) && searchText !== ''
                                          ? 'font-poppins break-all text-black bg-[#FBF719]'
                                          : 'font-poppins break-all text-black'
                                      }
                                    >
                                      {message.content_text}
                                    </Typography>
                                    <div className="flex justify-center items-center gap-2 mt-3">
                                      <Typography className="text-xs text-[#7C7C7C]">
                                        {getChatDate(
                                          message?.created_at ??
                                            '0001-01-01T00:00:00Z'
                                        )}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              message.media_urls[0]?.includes('mp3')
                            ) {
                              return (
                                <div
                                  className="flex ml-4 gap-2"
                                  key={message.id}
                                >
                                  <Image
                                    width={32}
                                    height={32}
                                    src={
                                      message?.owner?.avatar ??
                                      otherUserData?.avatar
                                    }
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div
                                    key={message.id}
                                    className="flex flex-col p-2 self-start max-w-[60%] rounded-lg bg-[#DCFCE4]"
                                  >
                                    <audio controls>
                                      <source
                                        src={message.media_urls[0]}
                                        type="audio/wav"
                                        className="w-full"
                                      />
                                      Your browser does not support the audio
                                      element.
                                    </audio>
                                    <div className="mt-2">
                                      <div className="w-full flex justify-end items-center gap-2">
                                        <Typography className="text-xs text-[#7C7C7C]">
                                          {getChatDate(
                                            message?.created_at ??
                                              '0001-01-01T00:00:00Z'
                                          )}
                                        </Typography>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              (message.media_urls[0]?.includes('mp4') ||
                                message.media_urls[0]?.includes('mov') ||
                                message.media_urls[0]?.includes('webm'))
                            ) {
                              return (
                                <div
                                  className="flex ml-4 gap-2"
                                  key={message.id}
                                >
                                  <Image
                                    width={32}
                                    height={32}
                                    src={
                                      message?.owner?.avatar ??
                                      otherUserData?.avatar
                                    }
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div
                                    key={message.id}
                                    className="flex flex-col p-2 self-start max-w-[60%] rounded-lg bg-[#DCFCE4]"
                                  >
                                    <video
                                      width="320"
                                      height="260"
                                      className="rounded-2xl"
                                      controls
                                    >
                                      <source
                                        src={message.media_urls[0]}
                                        type="video/mp4"
                                      />
                                    </video>
                                    <div className="mt-2">
                                      {message?.content_text?.length > 0 && (
                                        <Typography
                                          className={`${
                                            message?.content_text.includes(
                                              searchText
                                            ) && searchText !== ''
                                              ? 'font-poppins break-all text-black bg-[#FBF719]'
                                              : 'font-poppins break-all text-black'
                                          }`}
                                        >
                                          {message?.content_text}
                                        </Typography>
                                      )}
                                      <div className="w-full flex justify-end items-center gap-2">
                                        <Typography className="text-xs text-[#7C7C7C]">
                                          {getChatDate(
                                            message?.created_at ??
                                              '0001-01-01T00:00:00Z'
                                          )}
                                        </Typography>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else if (
                              message?.media_urls?.length > 0 &&
                              allowedExtensions.some(ext =>
                                message?.media_urls[0]?.includes(ext)
                              )
                            ) {
                              return (
                                <div
                                  className="flex ml-4 gap-2"
                                  key={message.id}
                                >
                                  <Image
                                    width={32}
                                    height={32}
                                    src={
                                      message?.owner?.avatar ??
                                      otherUserData?.avatar
                                    }
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div
                                    key={message.id}
                                    className="flex items-center p-4 self-start max-w-60% rounded-lg mx-4 gap-2 bg-[#DCFCE4]"
                                  >
                                    <RenderDocumentInfo
                                      message={message?.media_urls[0]}
                                    />
                                    <div className="w-full flex justify-end items-center gap-2">
                                      <Typography className="text-xs text-[#7C7C7C]">
                                        {getChatDate(
                                          message?.created_at ??
                                            '0001-01-01T00:00:00Z'
                                        )}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className="flex ml-4 gap-2"
                                  key={message.id}
                                >
                                  <Image
                                    width={32}
                                    height={32}
                                    src={
                                      message?.owner?.avatar ??
                                      otherUserData?.avatar
                                    }
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div
                                    key={message.id}
                                    className="flex flex-col p-2 self-start max-w-[60%] rounded-lg bg-[#DCFCE4]"
                                  >
                                    {message?.media_urls?.length > 0 && (
                                      <img
                                        className="max-w-[225px] max-h-[200px] object-cover rounded-3xl"
                                        src={message.media_urls[0]}
                                        alt="Image"
                                        width={225}
                                        height={170}
                                      />
                                    )}
                                    <div className="mt-2">
                                      {message?.content_text?.length > 0 && (
                                        <Typography
                                          className={`${
                                            message?.content_text.includes(
                                              searchText
                                            ) && searchText !== ''
                                              ? 'font-poppins break-all text-black bg-[#FBF719]'
                                              : 'font-poppins break-all text-black'
                                          }`}
                                        >
                                          {message?.content_text}
                                        </Typography>
                                      )}
                                      <div className="w-full flex justify-end items-center gap-2">
                                        <Typography className="text-xs text-[#7C7C7C]">
                                          {getChatDate(
                                            message?.created_at ??
                                              '0001-01-01T00:00:00Z'
                                          )}
                                        </Typography>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                        })}
                      </div>
                    )}
                    {activeTab === 'REQUEST' && (
                      <div className="absolute bottom-4 w-full gap-4 px-8 flex">
                        <Button
                          variant="outlined"
                          className="rounded-full w-1/2 capitalize py-2 border border-[#DD2525]"
                          onClick={() => {
                            void rejectRequestChat();
                          }}
                        >
                          <div className="flex justify-center">
                            <Typography className="font-semibold text-sm text-[#DD2525] font-poppins">
                              {t('chat.reject')}
                            </Typography>
                          </div>
                        </Button>
                        <Button
                          variant="filled"
                          className="rounded-full w-1/2 capitalize py-2 border border-[#3AC4A0] bg-[#3AC4A0]"
                          onClick={() => {
                            void acceptRequestChat();
                          }}
                        >
                          <div className="flex justify-center">
                            <Typography className="font-semibold text-sm text-white font-poppins">
                              {t('chat.accept')}
                            </Typography>
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-white px-4 py-2 rounded-b-xl">
                    {isVoiceRecording ? (
                      <div className="flex items-center gap-3">
                        <ChatVoiceRecorder
                          setAudio={setAudio}
                          setLoading={setIsLoading}
                          postMedia={handleSendVoiceMessage}
                          setIsVoiceRecording={setIsVoiceRecording}
                          audio={audio}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex justify-center items-center h-auto w-[60px] relative">
                          <Image
                            src={popUpOption}
                            alt="popUpOption"
                            width={100}
                            height={100}
                            className="h-auto w-full cursor-pointer hover:scale-110 duration-300"
                            onClick={() => {
                              setIsShowPopUpOption(!isShowPopUpOption);
                              setIsShowMediaOption(false);
                            }}
                          />
                          {isShowPopUpOption && (
                            <div className="flex flex-col justify-center items-center gap-2 px-2 py-3 rounded-full absolute top-[-150px] bg-gradient-to-b from-[#3AC4A0] to-[#106B6E]">
                              <div className="flex justify-center items-center w-[24px] h-auto">
                                <Image
                                  onClick={() => {
                                    setIsVoiceRecording(true);
                                    setIsShowPopUpOption(!isShowPopUpOption);
                                  }}
                                  src={optionMic}
                                  alt="optionMic"
                                  width={100}
                                  height={100}
                                  className="h-auto w-full cursor-pointer hover:scale-110 duration-300"
                                />
                              </div>
                              <div className="flex relative">
                                <div className="flex justify-center items-center w-[24px] h-auto cursor-pointer">
                                  <Image
                                    onClick={() => {
                                      setIsShowMediaOption(!isShowMediaOption);
                                      setIsShowPopUpOption(!isShowPopUpOption);
                                    }}
                                    src={optionImage}
                                    alt="optionImage"
                                    width={100}
                                    height={100}
                                    className="h-auto w-full hover:scale-110 duration-300"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-center items-center w-[24px] h-auto">
                                <Image
                                  onClick={() => {
                                    document
                                      .getElementById('docUpload')
                                      ?.click();
                                  }}
                                  src={optionFolder}
                                  alt="optionFolder"
                                  width={100}
                                  height={100}
                                  className="h-auto w-full cursor-pointer hover:scale-110 duration-300"
                                />
                                <input
                                  type="file"
                                  id="docUpload"
                                  onChange={handleSendDocument}
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                />
                              </div>
                            </div>
                          )}
                          {isShowMediaOption && (
                            <div className="absolute top-[-190px] left-[5px] bg-[#F9F9F9] p-6 rounded-2xl shadow-md">
                              <div className="flex flex-col gap-3">
                                <Image
                                  className="cursor-pointer hover:scale-125 duration-200"
                                  onClick={() => {
                                    setIsShowMediaOption(false);
                                    setIsShowPopUpOption(true);
                                  }}
                                  src={XIcon}
                                  alt="XIcon"
                                  width={20}
                                  height={20}
                                />
                                <div className="flex flex-row items-center gap-6 hover:outline-none">
                                  <div className="flex flex-col items-center gap-2">
                                    <div
                                      onClick={() => {
                                        setIsModalCameraOpen(true);
                                        setIsShowPopUpOption(false);
                                        setIsShowMediaOption(false);
                                      }}
                                      className="w-16 h-16 rounded-full hover:bg-[#DCFCE4] hover:text-[#1A857D] text-[#BDBDBD] cursor-pointer border hover:border-[#1A857D] flex justify-center items-center"
                                    >
                                      <CiCamera size={32} />
                                    </div>
                                    <Typography className="text-black font-poppins font-normal text-sm">
                                      {t('chat.camera')}
                                    </Typography>
                                  </div>
                                  <div className="flex flex-col items-center gap-2">
                                    <div
                                      onClick={() => {
                                        setIsModalRecordOpen(true);
                                        setIsShowPopUpOption(false);
                                        setIsShowMediaOption(false);
                                      }}
                                      className="w-16 h-16 rounded-full hover:bg-[#DCFCE4] hover:text-[#1A857D] text-[#BDBDBD] cursor-pointer border hover:border-[#1A857D] flex justify-center items-center"
                                    >
                                      <CiVideoOn size={32} />
                                    </div>
                                    <Typography className="text-black font-poppins font-normal text-sm">
                                      {t('chat.record')}
                                    </Typography>
                                  </div>
                                  <div className="flex flex-col items-center gap-2">
                                    <div
                                      onClick={() => {
                                        document
                                          .getElementById('MediaUpload')
                                          ?.click();
                                      }}
                                      className="w-16 h-16 rounded-full hover:bg-[#DCFCE4] hover:text-[#1A857D] text-[#BDBDBD] cursor-pointer border hover:border-[#1A857D] flex justify-center items-center"
                                    >
                                      <AiOutlinePicture size={32} />
                                      <input
                                        type="file"
                                        id="MediaUpload"
                                        onChange={handleSendImageMessage}
                                        className="hidden"
                                        accept="image/jpg,image/jpeg,image/png,image/svg+xml,video/mp4,video/mov,video/webm"
                                      />
                                    </div>
                                    <Typography className="text-black font-poppins font-normal text-sm">
                                      {t('chat.gallery')}
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {isModalCameraOpen && (
                          <ModalCamera
                            onClose={() => {
                              setIsModalCameraOpen(false);
                            }}
                            onCapture={handleMediaCapture}
                            isCropShapeRound={false}
                            isInputMessage={true}
                          />
                        )}
                        {isModalRecordOpen && (
                          <ModalRecordVideo
                            onClose={() => {
                              setIsModalRecordOpen(false);
                            }}
                            onCapture={handleMediaCapture}
                            isInputMessage={true}
                          />
                        )}
                        <div className="flex w-full relative">
                          <textarea
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="focus:outline-none placeholder:text-[#7C7C7C] border-[1px] border-[#BDBDBD] w-full text-sm font-normal py-3 px-4 rounded-full resize-none relative"
                            placeholder={t('chat.textInputPlaceholder') ?? ''}
                          />
                          <div className="absolute right-[20px] md:right-[20px] bottom-[10px] md:bottom-[9px]">
                            <div className="relative flex">
                              <div
                                className="dropdown-option flex cursor-pointer"
                                onClick={() => {
                                  handleDropdownOptionClick('Gif');
                                }}
                              >
                                <div className="bg-[#BDBDBD] hover:bg-[#a3a3a3] duration-300 rounded-md p-1 text-white text-xs md:text-sm">
                                  GIF
                                </div>
                              </div>
                              {isShowGifPopup && (
                                <div className="absolute right-0 bottom-8 flex flex-col mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                                  <GifChat
                                    sendGif={handleSendGifMessage}
                                    onClose={() => {
                                      setIsShowGifPopup(false);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button onClick={handleSendMessage}>
                          <Image
                            src={sendChat}
                            alt="send"
                            width={50}
                            height={50}
                            className="hover:scale-110 duration-300"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CCard>
          )}
        </div>
      )}
    </PageGradient>
  );
};

export default withAuth(ChatPages);
