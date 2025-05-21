import type { AuthNameI } from '@/utils/interfaces/auth.interface';
import { Input } from '@material-tailwind/react';

const AuthName: React.FC<AuthNameI> = ({
  handleChange,
  value,
  name,
  label,
  placeholder,
  handleSubmit
}: AuthNameI) => {
  return (
    <div className="rounded-xl p-[2px] h-full w-full bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]">
      <div className="relative flex justify-center items-center bg-white border-none w-full rounded-[10px] h-full">
        <Input
          label={label}
          variant="static"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleChange}
          required
          onKeyDown={handleSubmit}
          labelProps={{
            className:
              '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
          }}
          className="!border-none focus:!border-none !p-1.5 !ps-4 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default AuthName;
