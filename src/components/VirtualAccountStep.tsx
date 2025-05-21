import { type ReceiptDetail } from '@/pages/play/payment/receipt/[orderId]';
import { getHowToPay } from '@/repository/payment.repository';
import { type PaymentInstruction } from '@/utils/interfaces/play.interface';
import { Card, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import CountdownTimerVA from './payment/CountDownTimerVA';

interface VirtualAccountStepProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	orderDetail: ReceiptDetail | undefined;
	id: string;
}

const VirtualAccountStep: React.FC<VirtualAccountStepProps> = ({
	setIsLoading,
	orderDetail,
	id
}) => {
  const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState<boolean>(false);
  const [paymentInstruction, setPaymetnInstruction] = useState<PaymentInstruction>();
  const [selectedChannelIndex, setSelectedChannelIndex] = useState<number>(0);

	const toggleDropdown = (): void => {
		setIsOpen(!isOpen);
	};
	
	const fetchHowToPay = async (url: string): Promise<void> => {
		try {
			setIsLoading(true);
			const data = await getHowToPay(url);
			setPaymetnInstruction(data);
		} catch (error) {
			toast.error(`Error fetching payment list: ${error as string}`);
		} finally {
			setIsLoading(false);
		}
	};

	function parseStrongText(text: string): any {
		const regex = /"(.*?)"/g;
		const splitText = text.split(regex);

		return splitText.map((part: string, index: number) => {
			if (index % 2 === 1) {
				return (
					<strong className="font-semibold font-poppins" key={index}>
						{part}
					</strong>
				);
			} else {
				return part;
			}
		});
	}
	
	useEffect(() => {
		if (
			orderDetail?.howToPayApi !== undefined &&
			orderDetail?.howToPayApi !== ''
		) {
			void fetchHowToPay(orderDetail.howToPayApi);
		}
	}, [id, orderDetail?.howToPayApi]);

  return (
    <div>
		{
			paymentInstruction?.virtual_account_info?.expired_date !== undefined &&
			paymentInstruction?.payment_instruction !== undefined &&
			paymentInstruction?.virtual_account_info?.status !== 'EXPIRED' && (
				<Card className="px-2 py-3 mt-4 bg-white">
					<div className='flex flex-col justify-center items-center w-full text-center'>
						<Typography className="text-sm md:text-base font-semibold text-[#262626] font-poppins">
							{t('PlayPayment.VirtualAccountGuide.warningCompletion')}
						</Typography>
						<CountdownTimerVA
							expiredDate={
								paymentInstruction?.virtual_account_info?.expired_date
							}
						/>
					</div>
				</Card>
			)
		}
		{
			paymentInstruction?.virtual_account_info?.status === 'EXPIRED' && (
				<Card className="px-2 py-3 mt-4 bg-white">
					<div className='flex flex-col justify-center items-center w-full text-center'>
						<Typography className="text-sm md:text-base font-semibold text-[#DA2D1F] font-poppins">
							{t('PlayPayment.VirtualAccountGuide.expired')}
						</Typography>
					</div>
				</Card>
			)
		}
		{
			orderDetail?.vaNumber !== undefined && 
			paymentInstruction?.payment_instruction !== undefined && (
				<Card className="p-5 mt-4 bg-white font-poppins">
					<div onClick={toggleDropdown} className="flex justify-between items-center cursor-pointer">
						<h1 className="text-xl font-bold">{t('PlayPayment.VirtualAccountGuide.howToPay')}</h1>
						<button className="ml-2">
							{isOpen ? '▲' : '▼'}
						</button>
					</div>
					<div
						className={`overflow-hidden transition-max-height duration-700 ${
							isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0 mt-0'
						}`}
					>
						<div className="mb-4">
							<label className="block text-gray-700 font-bold mb-2">{t('PlayPayment.VirtualAccountGuide.choosePayment')}</label>
							<select
								className="w-full p-2 border rounded-md cursor-pointer"
								value={selectedChannelIndex}
								onChange={(e) => { setSelectedChannelIndex(Number(e.target.value)); }}
							>
								{paymentInstruction?.payment_instruction?.map((c, index) => (
									<option key={index} value={index}>
										{c.channel}
									</option>
								))}
							</select>
						</div>
						{paymentInstruction?.payment_instruction[selectedChannelIndex]?.step?.map((step, index) => (
							<div className="flex items-start mb-3 relative" key={index}>
								<div className="flex-shrink-0 w-6 h-6 z-10 rounded-full bg-seeds-purple-2 text-white flex items-center justify-center mr-3">
									{index + 1}
								</div>
								<Typography className="font-poppins text-black">
									{parseStrongText(step)}
								</Typography>
								{index < (paymentInstruction?.payment_instruction?.[selectedChannelIndex]?.step?.length ?? 0) - 1 && (
									<div
										className="w-0.5 bg-seeds-purple-2 absolute left-3"
										style={{ height: "calc(100% + 1.5rem)" }}
									></div>
								)}
							</div>
						))}
					</div>
				</Card>
		)}
    </div>
  );
};

export default VirtualAccountStep;
