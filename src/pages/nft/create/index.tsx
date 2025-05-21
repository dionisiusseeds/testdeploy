import { generateAssetCode } from '@/helpers/NFT';
import withAuth from '@/helpers/withAuth';
import useFilePreview from '@/hooks/useFilePreview';
import { UseUploadMedia } from '@/repository/circleDetail.repository';
import { createNft } from '@/repository/nft.repository';
import { Button, Card, Spinner } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useState, type ReactElement } from 'react';
import { FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';

export interface FormData {
  name: string;
  description: string;
  metadata_cid: string;
  image_url: string;
  // price: number;
  owner_address: string;
  creator_address: string;
  status: 'TRUE' | 'FALSE';
}

const ErrorMessage = ({ text }: { text: string }): ReactElement => (
  <p className="text-red-500 text-sm font-poppins text-right">{text}</p>
);

const CreateNFT = (): ReactElement => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<FileList | null>(null);
  const [imagePreview] = useFilePreview(image as FileList);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    metadata_cid: '',
    image_url: '',
    // price: 0,
    owner_address: '',
    creator_address: '',
    status: 'FALSE'
  });
  const [error, setError] = useState<{
    name: boolean;
    desc: boolean;
    image: boolean;
  }>({ name: false, desc: false, image: false });

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      if (
        image !== null &&
        image.length !== 0 &&
        formData.name !== '' &&
        formData.description !== ''
      ) {
        const publicKey = sessionStorage.getItem('diamPublicKey');
        if (publicKey === null) throw new Error('Please connect your account');
        const assetCode = generateAssetCode({
          publicKey
        });
        // const status = await createSellOffer(publicKey, {
        //   selling: new Asset(assetCode, publicKey),
        //   buying: Asset.native(),
        //   amount: '1',
        //   price: String(formData.price)
        // });
        // if (status === 200) {
        const imageUrl = await UseUploadMedia(image?.[0]);
        await createNft({
          ...formData,
          image_url: imageUrl.data.path,
          metadata_cid: assetCode,
          owner_address: publicKey,
          creator_address: publicKey
        });
        toast.success('NFT created successfully, redirectting to your profile');
        await router.push('/my-profile');
      } else {
        setError({
          desc: formData.description === '',
          image: image === null || image.length === 0,
          name: formData.name === ''
        });
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(
        `${String(error) ?? String(error.message) ?? 'Unknown Error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        await handleSubmit();
      }}
    >
      <Card className="p-5 flex flex-col gap-4">
        <div>
          <div className="flex flex-col gap-2">
            <label htmlFor="file">
              {imagePreview !== undefined ? (
                <img
                  src={imagePreview}
                  alt="nft-create-logo"
                  className="w-full aspect-video rounded-2xl"
                />
              ) : (
                <div className="w-full aspect-video bg-[#F3F4F8] rounded-2xl p-8">
                  <div className="border-dashed border border-[#7555DA80] w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-2">
                    <FiImage className="text-[#9533E680] w-10 h-10" />
                    <p className="font-poppins text-[#3AC4A0] font-semibold text-base">
                      Upload Photo/Video
                    </p>
                  </div>
                </div>
              )}
            </label>
            {error.image && <ErrorMessage text="Image is required" />}
          </div>
          <input
            type="file"
            id="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              setError(prev => ({ ...prev, image: false }));
              setImage(e.target.files);
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <label
            htmlFor="name"
            className="font-semibold text-neutral-medium text-base font-poppins"
          >
            Name
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="name"
              className="rounded-xl border border-[#E9E9E9] h-[52px] placeholder:font-normal placeholder:text-base placeholder:text-[#BDBDBD] placeholder:font-poppins font-poppins text-neutral-medium text-base p-4"
              placeholder="Nature"
              onChange={e => {
                setError(prev => ({ ...prev, name: false }));
                setFormData(prev => ({ ...prev, name: e.target.value }));
              }}
            />
            {error.name && <ErrorMessage text="Name is required" />}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <label
            htmlFor="bio"
            className="font-semibold text-neutral-medium text-base font-poppins"
          >
            Bio / Description{' '}
            <span className="font-normal font-poppins text-xs">{`(optional)`}</span>
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="bio"
              className="rounded-xl border border-[#E9E9E9] h-[101px] placeholder:font-normal placeholder:text-base placeholder:text-[#BDBDBD] placeholder:font-poppins font-poppins text-neutral-medium text-base p-4"
              placeholder="Let people know about your creativity..."
              onChange={e => {
                setError(prev => ({ ...prev, desc: false }));
                setFormData(prev => ({ ...prev, description: e.target.value }));
              }}
            />
            {error.desc && <ErrorMessage text="Description is required" />}
          </div>
        </div>
        {/* <div className="flex flex-col gap-4">
          <label
            htmlFor="price"
            className="font-semibold text-neutral-medium text-base font-poppins"
          >
            Price
          </label>
          <div className="flex flex-col gap-2">
            <CurrencyInput
              id="price"
              disableAbbreviations
              placeholder="Enter DIAM amount"
              suffix=" DIAM"
              className="rounded-xl border border-[#E9E9E9] h-[52px] placeholder:font-normal placeholder:text-base placeholder:text-[#BDBDBD] placeholder:font-poppins font-poppins text-neutral-medium text-base p-4"
              onChange={e => {
                setError(prev => ({ ...prev, price: false }));
                setFormData(prev => ({
                  ...prev,
                  price: parseFloat(e.target.value.replaceAll(',', ''))
                }));
              }}
            />
            {error.price && <ErrorMessage text="Price is required" />}
          </div>
        </div> */}
        <Button
          className="text-lg flex justify-center font-semibold text-white bg-[#3AC4A0] rounded-full w-full normal-case font-poppins"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="w-6 h-6" /> : 'Post For Sale'}
        </Button>
      </Card>
    </form>
  );
};

export default withAuth(CreateNFT);
