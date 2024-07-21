import ChatTable from "@/components/shared/Dashboard/ChatTable";
import { getAllGroupsList } from "@/lib/actions/group.actions";
import DashboardNavBar from "@/components/shared/DashboardNavBar";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Devcollab Hub",
};

export default async function Home() {
  const user = await currentUser();
  const mongoDbId: string = user?.privateMetadata?.mongoDbId;

  const response = await getAllGroupsList({ userId: mongoDbId });
  if (!response.success) {
    console.error(response.message);
    console.log("An error occurred. Please try again later.");
    return;
  }
  const { totalGroups, totalMembersPerGroup } = response.data;

  return (
    <>
      <DashboardNavBar userName={user?.username} />
      <main className="flex min-h-screen flex-col items-center justify-between p-12">
        <ChatTable
          userName={user.username}
          totalGroups={totalGroups}
          mongoDbId={mongoDbId}
          totalMembersPerGroup={totalMembersPerGroup}
        />
      </main>
    </>
  );
}
