import BackNav from '@/assets/circle-page/back_nav.svg';
import { updateGroup } from '@/repository/chat.repository';
import { postCloud } from '@/repository/cloud.repository';
import {
  type IGroupChatDetail,
  type UpdateGroupForm
} from '@/utils/interfaces/chat.interface';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePicture } from 'react-icons/ai';
import { CiCamera } from 'react-icons/ci';
import { MdCheck } from 'react-icons/md';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';
import ModalCamera from './ModalCamera';

interface EditInfoGroupProps {
  setIsOpenEditInfoGroup: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenEditInfoGroup: boolean;
  groupDetail: IGroupChatDetail;
  setIsRefetchInfoGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditInfoGroup: React.FC<EditInfoGroupProps> = ({
  setIsOpenEditInfoGroup,
  isOpenEditInfoGroup,
  groupDetail,
  setIsRefetchInfoGroup
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateAvatar, setAvatar] = useState<File>();
  const [updateGroupForm, setUpdateGroupForm] = useState<UpdateGroupForm>({
    avatar: '',
    name: '',
    description: '',
    privacy: '',
    hashtags: null
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalCameraOpen, setIsModalCameraOpen] = useState<boolean>(false);

  useEffect(() => {
    setUpdateGroupForm({
      avatar: groupDetail?.avatar,
      name: groupDetail?.name,
      description: groupDetail?.description,
      privacy: groupDetail?.privacy,
      hashtags: groupDetail?.hashtags
    });
  }, [groupDetail]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    setAvatar(file);
    if (file !== null && file !== undefined) {
      setUpdateGroupForm({
        ...updateGroupForm,
        avatar: URL.createObjectURL(file)
      });
    }
  };

  const handleCameraCapture = (capturedImage: File): void => {
    setAvatar(capturedImage);
    setUpdateGroupForm(prevState => ({
      ...prevState,
      avatar: URL.createObjectURL(capturedImage)
    }));
  };

  const handleInputChange = (
    key: keyof UpdateGroupForm,
    value: string
  ): void => {
    setUpdateGroupForm(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSubmitUpdate = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedForm = { ...updateGroupForm };
      if (updateAvatar !== null && updateAvatar !== undefined) {
        const { path: cloudResponse } = await postCloud({
          file: updateAvatar,
          type: 'OTHER_URL'
        });
        updatedForm.avatar = cloudResponse;
      }
      await updateGroup(groupDetail?.id, updatedForm);
      setIsOpenEditInfoGroup(false);
      setIsRefetchInfoGroup(true);
    } catch (error) {
      toast.error(`Error adding new member: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormModified = useMemo(() => {
    return (
      updateGroupForm.avatar !== groupDetail?.avatar ||
      updateGroupForm.name !== groupDetail?.name ||
      updateGroupForm.description !== groupDetail?.description ||
      updateGroupForm.privacy !== groupDetail?.privacy ||
      JSON.stringify(updateGroupForm.hashtags) !==
        JSON.stringify(groupDetail?.hashtags)
    );
  }, [updateGroupForm, groupDetail]);

  return (
    <div
      className={`w-full h-[70vh] bg-white ${
        isOpenEditInfoGroup ? 'block' : 'hidden'
      } px-6 py-2`}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center py-2">
            <div
              onClick={() => {
                setIsOpenEditInfoGroup(!isOpenEditInfoGroup);
                setUpdateGroupForm(groupDetail as UpdateGroupForm);
              }}
            >
              <Image
                alt="Back"
                src={BackNav}
                className="h-6 w-6 object-cover cursor-pointer hover:scale-110 duration-150"
              />
            </div>
            <Typography className="flex-1 text-center font-poppins font-semibold text-lg">
              {t('chat.editGroup')}
            </Typography>
            {isFormModified && updateGroupForm.name !== '' && (
              <div
                onClick={handleSubmitUpdate}
                className="cursor-pointer hover:scale-110 duration-150"
              >
                <MdCheck size={24} color="#1A857D" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-[auto_1fr] place-items-center md:p-5 py-2 mt-3 gap-[18px]">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                src={
                  updateAvatar != null
                    ? URL.createObjectURL(updateAvatar)
                    : groupDetail?.avatar
                }
                className="w-20 h-20"
                alt="Group Avatar"
              />
              <Menu placement="right-start">
                <MenuHandler>
                  <Typography className="text-[#1A857D] underline cursor-pointer font-poppins text-sm font-normal flex flex-row items-center gap-1">
                    <CameraIcon width={16} height={16} /> {t('chat.setPhoto')}
                  </Typography>
                </MenuHandler>
                <MenuList>
                  <div className="flex flex-row items-center gap-6 hover:outline-none">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        onClick={() => {
                          setIsModalCameraOpen(true);
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
                          fileInputRef.current?.click();
                        }}
                        className="w-16 h-16 rounded-full hover:bg-[#DCFCE4] hover:text-[#1A857D] text-[#BDBDBD] cursor-pointer border hover:border-[#1A857D] flex justify-center items-center"
                      >
                        <AiOutlinePicture size={32} />
                      </div>
                      <Typography className="text-black font-poppins font-normal text-sm">
                        {t('chat.gallery')}
                      </Typography>
                    </div>
                  </div>
                </MenuList>
              </Menu>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="relative w-full">
              <input
                id="name"
                type="text"
                value={updateGroupForm?.name}
                onChange={e => {
                  handleInputChange('name', e.target.value);
                }}
                maxLength={100}
                className="block md:w-[245px] md:py-0 py-1 w-full text-[#262626] text-base font-poppins font-semibold placeholder:text-[#BDBDBD] border-b border-[#3AC4A0] focus:outline-none"
              />
              {updateGroupForm?.name !== '' && (
                <XMarkIcon
                  onClick={() => {
                    setUpdateGroupForm(prev => ({
                      ...prev,
                      name: ''
                    }));
                  }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-7 h-7 cursor-pointer"
                />
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="border-b-2 border-[#E9E9E9] flex flex-col md:w-[445px] w-full">
              <label
                htmlFor="description"
                className="text-sm font-semibold font-poppins text-[#1A857D]"
              >
                {t('chat.addGroupDescription')}
              </label>
              <input
                id="description"
                type="text"
                onChange={data => {
                  handleInputChange('description', data.target.value);
                }}
                value={updateGroupForm?.description}
                placeholder={`${
                  updateGroupForm?.description === ''
                    ? t('chat.placeholderDesc')
                    : ''
                }`}
                className="text-sm font-normal font-poppins text-[#262626] outline-none py-2"
              />
            </div>
          </div>
        </>
      )}
      {isModalCameraOpen && (
        <ModalCamera
          onClose={() => {
            setIsModalCameraOpen(false);
          }}
          onCapture={handleCameraCapture}
          isCropShapeRound={true}
        />
      )}
    </div>
  );
};

export default EditInfoGroup;
