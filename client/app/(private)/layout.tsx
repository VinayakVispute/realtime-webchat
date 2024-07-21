import DashboardNavBar from "@/components/shared/DashboardNavBar";
import { ChatProvider } from "@/context/ChatProvider";

import { currentUser } from "@clerk/nextjs/server";
import { SocketProvider } from "@/context/SocketProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="bg-[rgba(255,255,255,0.1)] dark:bg-gray-900 min-h-screen">
        <SocketProvider>
          <ChatProvider>{children}</ChatProvider>
        </SocketProvider>
      </main>
    </>
  );
}
