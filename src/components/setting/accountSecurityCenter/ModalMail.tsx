import SeedyAuthRef from '@/assets/auth/SeedyAuthRef.png';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface IModalMail {
  open: boolean;
  handleOpenVerify: () => void;
  handleOpen: () => void;
}

const ModalMail: React.FC<IModalMail> = ({
  open,
  handleOpenVerify,
  handleOpen
}: IModalMail) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      handler={handleOpenVerify}
      size="sm"
      className="flex flex-col items-center md:relative absolute bottom-0 m-0 rounded-t-3xl rounded-b-none md:rounded-3xl min-w-full"
    >
      <DialogBody className="flex flex-col gap-4 p-10 items-center">
        <Image src={SeedyAuthRef} alt="SeedyAuthRef" className="w-[242px]" />
        <div className="flex flex-col gap-2">
          <Typography className="text-center font-poppins font-semibold text-xl text-[#262626]">
            {t('authForgotPass.modal.title1')}
          </Typography>
          <Typography className="text-center font-poppins font-normal text-sm text-[#7C7C7C]">
            {t('authForgotPass.modal.title2')}
          </Typography>
        </div>
        <Link href={'/my-profile'} className="w-full">
          <Button
            className="w-full capitalize font-poppins font-semibold text-sm text-white bg-[#3AC4A0] rounded-full"
            onClick={() => {
              handleOpenVerify();
              handleOpen();
            }}
          >
            {t('authRegister.authRef.confirm')}
          </Button>
        </Link>
      </DialogBody>
    </Dialog>
  );
};

export default ModalMail;
