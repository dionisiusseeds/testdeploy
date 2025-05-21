const TagEvent = ({text}:{text:string}): React.ReactElement => {
  return (
    <div className="bg-[#DCFCE4] rounded-full w-fit px-4 py-2 flex gap-2 justify-center items-center">
      <div className="relative w-fit h-fit">
        <div className=" w-3 lg:w-4 aspect-square rounded-full bg-[#4FE6AF] blur-sm" />

        <div className="absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 w-2 lg:w-3 aspect-square bg-gradient-to-b from-[#1A857D] to-[#3AC4A0] rounded-full backdrop-blur-lg" />
      </div>
      <p className="text-xs lg:text-base text-[#3AC4A0]">{text}</p>
    </div>
  );
};

export default TagEvent;
