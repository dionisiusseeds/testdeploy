import BackNav from '@/assets/circle-page/back_nav.svg';
import MoreButton from '@/assets/more-option/more_vertical.svg';
import AddGroupMembers from '@/components/chat/AddGroupMembers';
import EditInfoGroup from '@/components/chat/EditInfoGroup';
import LeaveCommunityPopUp from '@/components/chat/PopUpLeave';
import SearchGroupMembers from '@/components/chat/SearchGroupMembers';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import {
  getGroupDetail,
  getGroupMember,
  leaveGroupChat,
  muteGroupChat
} from '@/repository/chat.repository';
import { useAppSelector } from '@/store/redux/store';
import {
  type GroupMemberData,
  type GroupMemberResponse,
  type IGroupChatDetail
} from '@/utils/interfaces/chat.interface';
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import DefaultAvatar from '../../../../public/assets/chat/default-avatar.svg';
import EditButton from '../../../../public/assets/chat/edit-icon.svg';
import LeaveButton from '../../../../public/assets/chat/logout-icon.svg';
import NotifOffButton from '../../../../public/assets/chat/notification-off-icon.svg';

const DetailGroup: React.FC = () => {
  const { t } = useTranslation();
  const { dataUser } = useAppSelector(state => state.user);
  const router = useRouter();
  const { id } = router.query;

  const [detailGroup, setDetailGroup] = useState<IGroupChatDetail>();
  const [groupMembers, setGroupMembers] = useState<GroupMemberResponse>();
  const [filteredMembers, setFilteredMembers] = useState<GroupMemberData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefetchInfoGroup, setIsRefetchInfoGroup] = useState<boolean>(false);
  const [isOpenEditGroup, setIsOpenEditGroup] = useState<boolean>(false);
  const [isOpenModalLeave, setIsOpenModalLeave] = useState<boolean>(false);
  const [isOpenSearchMembers, setIsOpenSearchMembers] =
    useState<boolean>(false);
  const [isOpenAddMembers, setIsOpenAddMembers] = useState<boolean>(false);
  // const [isShareModal, setIsShareModal] = useState<boolean>(false);

  const fetchGroupDetail = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const [groupDetail, groupMember] = await Promise.all([
        getGroupDetail(id as string),
        getGroupMember(id as string)
      ]);
      setDetailGroup(groupDetail);
      setGroupMembers(groupMember);
    } catch (error: any) {
      toast.error('Failed to fetch Group Detail');
    } finally {
      setIsRefetchInfoGroup(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void fetchGroupDetail();
    }
  }, [id]);

  useEffect(() => {
    if (isRefetchInfoGroup) {
      void fetchGroupDetail();
    }
  }, [isRefetchInfoGroup]);

  useEffect(() => {
    if (groupMembers?.data != null) {
      setFilteredMembers(groupMembers.data);
    }
  }, [groupMembers]);

  const handleMuteGroup = async (): Promise<void> => {
    try {
      await muteGroupChat({ group_id: id as string, type: '' });
      toast.success(t('chat.successMute'));
    } catch (error) {
      toast.error(`Failed to mute group: ${error as string}`);
    }
  };

  const handleLeaveGroup = async (): Promise<void> => {
    try {
      await leaveGroupChat(id as string, {
        user_id: dataUser.id
      });
      await router.push('/chat');
    } catch (error) {
      toast.error(`Failed to leave group: ${error as string}`);
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`w-full bg-white ${
            isOpenAddMembers || isOpenSearchMembers || isOpenEditGroup
              ? 'hidden'
              : 'block'
          }`}
        >
          <div className="w-full flex flex-col gap-3 shadow-lg md:px-8 px-5 py-4">
            <div className="flex justify-between items-center">
              <div
                onClick={async () => {
                  await router.push(
                    `/chat?roomId=${id as string}&isGroupChat=true`
                  );
                }}
              >
                <Image
                  alt="Back"
                  src={BackNav}
                  className="h-6 w-6 object-cover cursor-pointer"
                />
              </div>
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Image
                    src={MoreButton}
                    alt="threeDots"
                    className="cursor-pointer"
                  />
                </MenuHandler>
                <MenuList>
                  {groupMembers?.data
                    ?.filter(member => member?.user_id === dataUser?.id)
                    .find(member => member?.role === 'admin') != null && (
                    <MenuItem
                      onClick={() => {
                        setIsOpenEditGroup(prev => !prev);
                      }}
                      className="font-poppins text-sm font-normal text-[#201B1C] flex items-center gap-2"
                    >
                      <Image src={EditButton} alt="edit" width={20} />
                      {t('chat.menuBar.changeGroupInfo')}
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={handleMuteGroup}
                    className="font-poppins text-sm font-normal text-[#201B1C] flex items-center gap-2"
                  >
                    <Image src={NotifOffButton} alt="notif" width={20} />
                    {t('chat.menuBar.mutedNotif')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsOpenModalLeave(prev => !prev);
                    }}
                    className="font-poppins text-sm font-normal text-[#B81516] flex items-center gap-2"
                  >
                    <Image src={LeaveButton} alt="logout" width={20} />
                    {t('chat.menuBar.leaveGroup')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="flex justify-between items-center md:pl-4 py-5">
              <div className="grid grid-cols-[auto_1fr] gap-[18px] place-items-center">
                <Avatar
                  src={
                    detailGroup?.avatar === ''
                      ? DefaultAvatar.src
                      : detailGroup?.avatar
                  }
                  alt="avatar"
                  width={80}
                  height={80}
                  className="md:max-w-20 md:max-h-20 w-14 h-14"
                />
                <div className="flex flex-col">
                  <Typography className="text-base font-semibold text-[#262626] font-poppins">
                    {detailGroup?.name}
                  </Typography>
                  <Typography className="text-sm text-[#262626] font-normal font-poppins">
                    {`${detailGroup?.total_memberships as number} ${t(
                      'chat.members'
                    )}`}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-[10px]">
                {groupMembers?.data
                  ?.filter(member => member?.user_id === dataUser?.id)
                  .find(member => member?.role === 'admin') != null && (
                  <div
                    onClick={() => {
                      setIsOpenAddMembers(prev => !prev);
                    }}
                    className="border border-[#1A857D] rounded-full md:w-12 md:h-12 w-10 h-10 flex justify-center items-center bg-[#dcfce4] hover:bg-[#b1e1c1] cursor-pointer duration-150"
                  >
                    <MdOutlineGroupAdd
                      color="#1A857D"
                      size={24}
                      className="md:w-6 md:h-6 w-5 h-5"
                    />
                  </div>
                )}
                {/*                 <div
                  onClick={() => {
                    setIsShareModal(prev => !prev);
                  }}
                  className="border border-[#1A857D] rounded-full md:w-12 md:h-12 w-10 h-10 flex justify-center items-center bg-[#dcfce4] hover:bg-[#b1e1c1] cursor-pointer duration-150"
                >
                  <RiLink
                    color="#1A857D"
                    size={24}
                    className="md:w-6 md:h-6 w-5 h-5"
                  />
                </div> */}
                <div
                  onClick={() => {
                    setIsOpenSearchMembers(prev => !prev);
                  }}
                  className="border border-[#1A857D] rounded-full md:w-12 md:h-12 w-10 h-10 flex justify-center items-center bg-[#dcfce4] hover:bg-[#b1e1c1] cursor-pointer duration-150"
                >
                  <LuSearch
                    color="#1A857D"
                    size={24}
                    className="md:w-6 md:h-6 w-5 h-5"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col p-8 gap-8">
            <div className="w-full flex justify-between">
              {detailGroup?.description === '' ? (
                <Typography
                  onClick={() => {
                    setIsOpenEditGroup(prev => !prev);
                  }}
                  className="text-sm font-semibold text-[#1A857D] font-poppins cursor-pointer hover:underline"
                >
                  {t('chat.addGroupDescription')}
                </Typography>
              ) : (
                <div className="flex flex-col gap-2">
                  <Typography className="text-sm font-semibold text-[#1A857D] font-poppins">
                    {t('chat.groupDescription')}
                  </Typography>
                  <Typography className="text-sm font-normal text-[#262626] font-poppins">
                    {detailGroup?.description}
                  </Typography>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto h-[380px] pr-2 team-battle-scroll">
              {groupMembers?.data
                ?.sort((a, b) => {
                  if (a?.role === 'admin' && b?.role !== 'admin') return -1;
                  if (a?.role !== 'admin' && b?.role === 'admin') return 1;
                  return 0;
                })
                ?.map((item: GroupMemberData, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-5">
                        <Avatar
                          src={item?.user_avatar}
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="w-12 h-12"
                        />
                        <Typography className="text-md font-semibold text-[#262626] font-poppins">
                          {item?.user_name}
                        </Typography>
                      </div>
                      {item?.role === 'admin' && (
                        <Typography className="text-sm text-[#3AC4A0] font-normal font-poppins bg-[#EDFCD3] rounded-md p-2 w-fit">
                          Admin
                        </Typography>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      <AddGroupMembers
        isOpenAddMembers={isOpenAddMembers}
        setIsOpenAddMembers={setIsOpenAddMembers}
        memberData={filteredMembers}
        groupId={id as string}
        setIsRefetchInfoGroup={setIsRefetchInfoGroup}
      />
      <EditInfoGroup
        setIsOpenEditInfoGroup={setIsOpenEditGroup}
        isOpenEditInfoGroup={isOpenEditGroup}
        groupDetail={detailGroup as IGroupChatDetail}
        setIsRefetchInfoGroup={setIsRefetchInfoGroup}
      />
      {isOpenModalLeave && (
        <LeaveCommunityPopUp
          onClose={() => {
            setIsOpenModalLeave(prev => !prev);
          }}
          onClick={handleLeaveGroup}
        />
      )}
      {isOpenModalLeave && (
        <LeaveCommunityPopUp
          onClose={() => {
            setIsOpenModalLeave(prev => !prev);
          }}
          onClick={handleLeaveGroup}
        />
      )}
      {/*       {isShareModal && (
        <ModalShareGroup
          onClose={() => {
            setIsShareModal(false);
          }}
          groupId={id as string}
        />
      )} */}
      <SearchGroupMembers
        isOpenSearchMembers={isOpenSearchMembers}
        setIsOpenSearchMembers={setIsOpenSearchMembers}
        filteredMember={filteredMembers}
      />
    </PageGradient>
  );
};

export default withAuth(DetailGroup);
