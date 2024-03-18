import { Sidebar } from "@/components/sidebar";

type Props = {
    children : React.ReactNode;
}

const MainLayout = ({children} : Props) =>{
    return (
        <>
        {/* Show side bar only on mobile devices not on desktop */}
            <Sidebar className="hidden lg:flex"/>
            <main className="lg:pl-[256px] h-full pt-[50px] lg:0">
                <div className="bg-red-400 h-full">
                    {children }
                </div>
            </main>
        </>
    );
}
export default MainLayout;