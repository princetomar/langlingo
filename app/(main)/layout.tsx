import { MobileHeader } from "@/components/shared/mobile-header";
import { Sidebar } from "@/components/shared/sidebar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      {/* Show side bar only on mobile devices not on desktop */}

      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:0">
        <div className=" h-full max-w-[1056px] mx-auto pt-6">{children}</div>
      </main>
    </>
  );
};
export default MainLayout;
