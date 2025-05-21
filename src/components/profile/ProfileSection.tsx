'use client';
import Wallet from '@/assets/my-profile/earning/wallet.svg';
import message from '@/assets/profile/message.svg';
import GoldPlan from '@/assets/seedsplan/gold-plan.svg';
import PlatinumPlan from '@/assets/seedsplan/platinum-plan.svg';
import SilverPlan from '@/assets/seedsplan/silver-plan.svg';
import ExpInfo from '@/components/ExpInfo';
import { Share, Verified } from '@/constants/assets/icons';
import {
  getSubscriptionPlan,
  getSubscriptionStatus
} from '@/repository/subscription.repository';
import { updateBlockUser } from '@/repository/user.repository';
import { type Experience } from '@/utils/interfaces/earning.interfaces';
import {
  type DataPlanI,
  type PlanI,
  type StatusSubscription
} from '@/utils/interfaces/subscription.interface';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ID from 'public/assets/images/flags/ID.png';
import SubsSeedy from 'public/assets/subscription/subs-seedy.svg';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import FollowButton from '../FollowButton';
import MoreOptionHorizontal from '../MoreOptionHorizontal';
import Loading from '../popup/Loading';
import PostFollowSection from './PostFollowSection';

interface Params {
  profileData: any;
  expData: Experience;
  id?: string;
  handleSubmitBlockUser?: (event: React.FormEvent) => Promise<void>;
}

const Profile = ({
  profileData,
  expData,
  id,
  handleSubmitBlockUser
}: Params): JSX.Element => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBlock, setIsBlock] = useState<boolean>(profileData?.status_blocked);
  const [dataSubscription, setDataSubscription] =
    useState<StatusSubscription | null>(null);
  const [dataPlan, setDataPlan] = useState<DataPlanI>();
  const [mappedPlan, setMappedPlan] = useState<PlanI[]>([]);
  const router = useRouter();
  const _handleReferalCode = async (): Promise<boolean> => {
    return await router.push({
      pathname: `/my-profile/referralCode`,
      query: { referralHistory: 'true' }
    });
  };

  const getSubscriptionPlanData = async (): Promise<void> => {
    try {
      const [planList, planStatus] = await Promise.all([
        getSubscriptionPlan(),
        getSubscriptionStatus()
      ]);
      if (planStatus !== undefined && planList !== undefined) {
        setDataPlan(planList);
        setDataSubscription(planStatus);
      }
    } catch (error) {
      console.error(`${error as string}`);
    }
  };

  const onBlock = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await updateBlockUser(profileData?.id);
      setIsBlock(result.status);
    } catch (error) {
      toast.error(`Error follow user: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const _handleEditProfile = async (): Promise<boolean> => {
    return await router.push('/my-profile/edit-profile');
  };

  useEffect(() => {
    void getSubscriptionPlanData();
  }, []);

  useEffect(() => {
    if (dataPlan !== undefined) {
      const listPlan: PlanI[] = [
        ...dataPlan.data.GOLD.map(item => item),
        ...dataPlan.data.PLATINUM.map(item => item),
        ...dataPlan.data.SILVER.map(item => item)
      ];
      setMappedPlan(listPlan);
    }
  }, [dataPlan]);

  const getActivePlan = (): string => {
    const activeSubscriptionId =
      dataSubscription?.active_subscription?.subscription_type_id;
    return (
      mappedPlan?.find(item => item.id === activeSubscriptionId)?.name ?? ''
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex md:gap-5">
        <div className="shrink-0">
          <Image
            src={profileData?.avatar}
            alt="AVATAR"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col w-full gap-4 justify-center">
          <div className="xl:flex hidden justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Typography className="text-lg font-semibold font-poppins text-[#201B1C]">
                  @{profileData?.seeds_tag ?? profileData?.seedsTag ?? ''}
                </Typography>
                {Boolean(profileData?.verified) && (
                  <Image
                    src={Verified?.src}
                    alt={Verified?.alt}
                    height={12}
                    width={12}
                  />
                )}
                {profileData?.label !== '' ? (
                  <div className="flex justify-center items-center py-1 px-2 bg-[#DCFCE4] my-0.5 rounded-full">
                    <p className="leading-4 text-[10px] text-[#1A857D] font-poppins font-normal">
                      {profileData?.label}
                    </p>
                  </div>
                ) : null}
                {profileData?.region !== '' ? (
                  <Image
                    src={ID}
                    alt="ID-flag"
                    className="w-[30px] h-[20px] self-center"
                  />
                ) : null}
              </div>
              <Typography className="text-sm text-[#7C7C7C] font-normal font-poppins">
                {profileData?.name}
              </Typography>
            </div>
            <div className="flex gap-4 items-center">
              {id == null ? (
                <>
                  <div
                    className="bg-[#F6F6F6] p-2 rounded-full cursor-pointer"
                    onClick={async () =>
                      await router.push('/my-profile/my-earnings')
                    }
                  >
                    <Image src={Wallet} alt="Wallet" />
                  </div>
                  <div
                    className="bg-[#DCFCE480] flex gap-2 items-center justify-center rounded-full px-4 py-2 border-[0.5px] border-dashed border-[#27A590] self-center cursor-pointer"
                    onClick={async () => await _handleReferalCode()}
                  >
                    <Typography className="text-[#27A590] text-sm font-normal font-poppins">
                      Ref.Code:{' '}
                      {profileData?.ref_code ?? profileData?.claims?.refCode}
                    </Typography>
                    <Image
                      src={Share.src}
                      alt={Share.alt}
                      width={14}
                      height={14}
                      className="bg-[#27A590] rounded-full p-[3px]"
                    />
                  </div>
                  <div
                    className="border border-[#262626] w-[94px] h-[42px] flex items-center justify-center rounded-full self-center cursor-pointer"
                    onClick={_handleEditProfile}
                  >
                    <Typography className="text-xs text-[#262626] font-poppins font-normal">
                      Edit Profile
                    </Typography>
                  </div>
                </>
              ) : (
                <>
                  {(
                    isBlock !== undefined
                      ? isBlock
                      : profileData?.status_blocked === true
                  ) ? (
                    <Button
                      disabled={isLoading}
                      onClick={onBlock}
                      className="bg-[#FF3838] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
                    >
                      Unblock
                    </Button>
                  ) : (
                    <FollowButton
                      userId={profileData?.id}
                      isFollowed={profileData?.status_followed}
                      customClass="bg-[#3AC4A0] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
                    />
                  )}
                  <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center">
                    <Image src={message} alt="Message" width={20} height={20} />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center items-center">
                    <MoreOptionHorizontal
                      profileData={profileData}
                      handleSubmitBlockUser={handleSubmitBlockUser}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <PostFollowSection profileData={profileData} id={id} />
          <div className="xl:flex hidden">
            <Typography className="text-[#201B1C] text-base font-normal font-poppins">
              {profileData?.bio}
            </Typography>
          </div>
          <div className="xl:flex hidden">
            <ExpInfo data={expData} profileData={profileData} id={id} />
          </div>
          <div
            onClick={async () => await router.push('/seedsplan')}
            className="hidden w-full mt-2 bg-gradient-radial-subs shadow-subs-complete hover:shadow-subs-complete-hover xl:flex justify-between items-center px-8 py-1 rounded-xl cursor-pointer font-poppins duration-300 border border-white"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="ml-6">
                <div className="relative">
                  <div className="absolute bg-gradient-to-b from-[#FF620A66] to-[#FABE2C66] w-[50px] h-[50px] rounded-full"></div>
                  <div
                    className={`${
                      dataSubscription !== null ? 'relative' : 'relative left-1'
                    }`}
                  >
                    <Image
                      src={
                        getActivePlan() === 'SILVER'
                          ? SilverPlan
                          : getActivePlan() === 'GOLD'
                          ? GoldPlan
                          : getActivePlan() === 'PLATINUM'
                          ? PlatinumPlan
                          : SubsSeedy
                      }
                      alt={'subscription-image'}
                      width={100}
                      height={100}
                      className="w-[50px] h-50px]"
                    />
                    {dataSubscription !== null && (
                      <Typography className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-[8px] text-[#3AC4A0] bg-[#BAFBD0] font-poppins px-[6px] py-[3px] rounded-full w-fit font-medium">
                        {t('seedsPlan.text8')}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              <Typography className="text-white font-semibold font-poppins text-sm capitalize">
                {t(
                  `${
                    dataSubscription === null
                      ? 'ProfilePage.subscriptionButton'
                      : 'ProfilePage.yourPackage'
                  }`
                )}
                {`${
                  dataSubscription !== null && dataPlan !== undefined
                    ? ' : ' + getActivePlan()
                    : ''
                }`}
              </Typography>
            </div>
            <div className="flex justify-center items-center h-[16px]">
              <FaChevronRight className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>
      {/* TODO: WEB IN MOBILE DEVICE */}
      <div className="flex xl:hidden flex-col gap-[7px] px-4 py-[15.5px]">
        <div className="flex gap-2">
          <Typography className="self-center text-sm font-semibold font-poppins text-[#222222]">
            @{profileData?.seeds_tag ?? profileData?.seedsTag ?? ''}
          </Typography>
          {Boolean(profileData?.verified) && (
            <Image
              src={Verified?.src}
              alt={Verified?.alt}
              height={12}
              width={12}
            />
          )}
          {profileData?.label !== '' ? (
            <div className="flex justify-center items-center py-1 px-2 bg-[#DCFCE4] my-0.5 rounded-full">
              <p className="leading-4 text-[10px] text-[#1A857D] font-poppins font-normal">
                {profileData?.label}
              </p>
            </div>
          ) : null}
          {profileData?.region !== '' ? (
            <Image
              src={ID}
              alt="ID-flag"
              className="w-[30px] h-[20px] self-center"
            />
          ) : null}
        </div>
        <Typography className="text-xs text-[#222222] font-normal font-poppins">
          {profileData?.name}
        </Typography>
        <Typography className="leading-4 text-[#222222] text-[10px] font-normal font-poppins">
          {profileData?.bio}
        </Typography>
      </div>
      <div className="flex xl:hidden gap-2 py-2 px-2 items-center justify-around">
        {id == null ? (
          <>
            <div
              className="bg-[#F6F6F6] p-2 rounded-full cursor-pointer"
              onClick={async () => await router.push('/my-profile/my-earnings')}
            >
              <Image src={Wallet} alt="Wallet" width={28} height={28} />
            </div>
            <div
              className="bg-[#DCFCE480] flex gap-[37.5px] items-center justify-center rounded-full border-[0.5px] border-dashed border-[#27A590] self-center cursor-pointer px-3 py-1"
              onClick={async () => await _handleReferalCode()}
            >
              <Typography className="text-[#27A590] text-[10px] font-normal font-poppins">
                Ref.Code:{' '}
                {profileData?.ref_code ?? profileData?.claims?.refCode}
              </Typography>
              <Image
                src={Share.src}
                alt={Share.alt}
                width={14}
                height={14}
                className="bg-[#27A590] rounded-full p-[3px]"
              />
            </div>
            <div
              className="border border-[#262626] w-[141.5px] h-8 flex items-center justify-center rounded-full self-center cursor-pointer"
              onClick={_handleEditProfile}
            >
              <Typography className="text-xs text-[#262626] font-poppins font-normal">
                Edit Profile
              </Typography>
            </div>
          </>
        ) : (
          <>
            {(
              isBlock !== undefined
                ? isBlock
                : profileData?.status_blocked === true
            ) ? (
              <Button
                disabled={isLoading}
                onClick={onBlock}
                className="bg-[#FF3838] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
              >
                Unblock
              </Button>
            ) : (
              <FollowButton
                userId={profileData?.id}
                isFollowed={profileData?.status_followed}
                customClass="flex gap-2 items-center justify-center rounded-full w-[147px] h-8 self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
              />
            )}
            <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center">
              <Image src={message} alt="Message" width={20} height={20} />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center items-center">
              <MoreOptionHorizontal
                profileData={profileData}
                handleSubmitBlockUser={handleSubmitBlockUser}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex xl:hidden">
        <ExpInfo data={expData} profileData={profileData} id={id} />
      </div>

      {/* My Earnings Breakpoint: SM */}
      <div
        onClick={async () => await router.push('/seedsplan')}
        className="xl:hidden w-full mt-2 bg-gradient-radial-subs shadow-subs-complete hover:shadow-subs-complete-hover flex justify-between items-center px-4 py-1 rounded-xl cursor-pointer font-poppins duration-300 border border-white"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="relative">
            <div className="absolute bg-gradient-to-b from-[#FF620A66] to-[#FABE2C66] w-[48px] h-[48px] rounded-full"></div>
            <div
              className={`${
                dataSubscription !== null ? 'relative' : 'relative left-1'
              }`}
            >
              <Image
                src={
                  getActivePlan() === 'SILVER'
                    ? SilverPlan
                    : getActivePlan() === 'GOLD'
                    ? GoldPlan
                    : getActivePlan() === 'PLATINUM'
                    ? PlatinumPlan
                    : SubsSeedy
                }
                alt="subscription-image"
                width={120}
                height={120}
                className="w-[47px] h-[47px]"
              />
              {dataSubscription !== null && (
                <Typography className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-[8px] text-[#3AC4A0] bg-[#BAFBD0] font-poppins px-[6px] py-[3px] rounded-full w-fit font-medium">
                  {t('seedsPlan.text8')}
                </Typography>
              )}
            </div>
          </div>
          <div
            className={`flex ${
              dataSubscription?.incoming_subscription === null
                ? 'flex-row gap-2 items-center'
                : 'flex-col'
            }`}
          >
            <Typography className="text-white font-semibold font-poppins text-sm capitalize">
              {t(
                `${
                  dataSubscription === null
                    ? 'ProfilePage.subscriptionButton'
                    : 'ProfilePage.yourPackage'
                }`
              )}
              {`${
                dataSubscription !== null && dataPlan !== undefined
                  ? ' : ' + getActivePlan()
                  : ''
              }`}
            </Typography>
          </div>
        </div>
        <div className="flex justify-center items-center h-[18px]">
          <FaChevronRight className="text-white" size={16} />
        </div>
      </div>
    </>
  );
};

export default Profile;
