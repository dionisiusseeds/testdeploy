import AddIcon from '@/assets/play/tournament/add-watchlist.svg';
import { createGroup } from '@/repository/chat.repository';
import { postCloud } from '@/repository/cloud.repository';
import { type CreateGroupForm } from '@/utils/interfaces/chat.interface';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Avatar, Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';
import CreateGroupPopUp from './PopUpCreateGroup';

interface DetailCreateGroupProps {
  showNextStep: boolean;
  setShowNextStep: React.Dispatch<React.SetStateAction<boolean>>;
  createGroupForm: CreateGroupForm;
  setCreateGroupForm: React.Dispatch<React.SetStateAction<CreateGroupForm>>;
}

const DetailCreateGroup: React.FC<DetailCreateGroupProps> = ({
  showNextStep,
  setShowNextStep,
  createGroupForm,
  setCreateGroupForm
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [updateAvatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0] ?? null;
    setAvatar(file);
    if (file != null) {
      setCreateGroupForm({
        ...createGroupForm,
        avatar: URL.createObjectURL(file)
      });
    }
  };

  const handleInputChange = (
    key: keyof CreateGroupForm,
    value: string
  ): void => {
    setCreateGroupForm(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedForm = { ...createGroupForm };
      if (updateAvatar != null) {
        const { path: cloudResponse } = await postCloud({
          file: updateAvatar,
          type: 'OTHER_URL'
        });
        updatedForm.avatar = cloudResponse;
      }
      const response = await createGroup(updatedForm);
      setIsOpenConfirmModal(false);
      if (response !== undefined) {
        await router.push(`/chat?roomId=${response.id}&isGroupChat=true`);
        toast.success('Group Chat created successfully!');
      }
    } catch (error: any) {
      toast.error(
        `Error create group: ${error?.response?.data?.message as string}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full bg-white ${showNextStep ? 'block' : 'hidden'}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col p-4 gap-3">
          <Image
            onClick={() => {
              setShowNextStep(prev => !prev);
            }}
            className="cursor-pointer hover:scale-110 transition ease-out"
            src={ArrowBackwardIcon}
            alt="back-arrow"
            width={28}
            height={28}
          />
          <div
            style={{
              backgroundImage: "url('/assets/chat/bg-input-image.svg')"
            }}
            className="w-full bg-cover h-[210px] bg-[#DCFCE4] flex justify-center items-center"
          >
            <div className="flex flex-col items-center gap-4">
              {updateAvatar != null ? (
                <Avatar
                  src={URL.createObjectURL(updateAvatar)}
                  className="w-20 h-20"
                  alt="Group Avatar"
                />
              ) : (
                <div className="rounded-full bg-white w-[56px] h-[56px] flex items-center justify-center">
                  <Image src={AddIcon} alt="AddIcon" width={30} height={30} />
                </div>
              )}
              <button
                onClick={() => {
                  document.getElementById('fileInput')?.click();
                }}
                className="text-[#1A857D] font-poppins text-sm font-normal flex flex-row items-center gap-1"
              >
                <CameraIcon width={16} height={16} /> {t('chat.setPhoto')}
              </button>
              <input
                className="hidden"
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 px-6 py-4 h-[200px]">
            <div className="border-b-2 border-[#E9E9E9] flex flex-col md:w-[345px] w-full">
              <label
                htmlFor="name"
                className="text-sm font-semibold font-poppins text-[#1A857D]"
              >
                {t('chat.groupName')}
              </label>
              <input
                id="name"
                type="text"
                onChange={data => {
                  handleInputChange('name', data.target.value);
                }}
                value={createGroupForm?.name}
                maxLength={100}
                className="text-sm font-normal font-poppins text-[#262626] outline-none py-2"
              />
            </div>
            <div className="border-b-2 border-[#E9E9E9] flex flex-col md:w-[445px] w-full">
              <label
                htmlFor="description"
                className="text-sm font-semibold font-poppins text-[#1A857D]"
              >
                {t('chat.groupDescription')}
              </label>
              <input
                id="description"
                type="text"
                onChange={data => {
                  handleInputChange('description', data.target.value);
                }}
                value={createGroupForm?.description}
                className="text-sm font-normal font-poppins text-[#262626] outline-none py-2"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button
              onClick={() => {
                setIsOpenConfirmModal(true);
              }}
              disabled={
                createGroupForm?.name?.length < 2 ||
                createGroupForm?.memberships.length < 2
              }
              className="bg-seeds-button-green font-semibold font-poppins text-sm w-[345px] rounded-full"
            >
              {t('chat.btnCreateGroup')}
            </Button>
          </div>
        </div>
      )}
      {isOpenConfirmModal && (
        <CreateGroupPopUp
          onClose={() => {
            setIsOpenConfirmModal(prev => !prev);
          }}
          onClick={handleSubmit}
        />
      )}
    </div>
  );
};

export default DetailCreateGroup;
