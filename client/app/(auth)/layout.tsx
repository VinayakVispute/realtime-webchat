import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";
import Spinner from "@/components/shared/Spinner";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <NavBar />
        <div className=" flex justify-center items-center p-4 bg-[rgba(255,255,255,0.1)] dark:bg-gray-900 min-h-screen">
          <ClerkLoaded>
            <div>{children}</div>
          </ClerkLoaded>
          <ClerkLoading>
            <div className="w-full flex justify-center items-center min-h-screen">
              <Spinner />
            </div>
          </ClerkLoading>
        </div>
        <Footer />
      </main>
    </>
  );
}
