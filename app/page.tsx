import Image from "next/image";

export default function Home() {
  return (
    <div className="dark:text-white text-black min-h-screen h-full bg-white dark:bg-black flex justify-center py-16">
      <div className="max-w-laptop w-full">
        <div>
          <div className="text-2xl flex flex-col gap-4">
            <span className="font-bold ">luannzin</span>
            <div className="flex">
              <span>web developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
