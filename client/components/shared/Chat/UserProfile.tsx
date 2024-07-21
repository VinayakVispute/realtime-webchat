// UserProfile.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IUser } from "@/interfaces";
import LeaveComponent from "./LeaveComponent";
import UserProfileTopBar from "./UserProfileTopBar";

const UserProfile = ({
  author,
  groupName,
  active,
}: {
  author: Partial<IUser>;
  groupName: string;
  active: boolean;
}) => {
  return (
    <>
      <UserProfileTopBar groupName={groupName} />
      <div className="relative flex flex-col items-center bg-indigo-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 w-full py-4 px-2 rounded-lg">
        <Avatar>
          <AvatarImage
            src={author?.profilePic}
            alt={`${author?.name ?? "User"}'s Profile Image`}
          />
          <AvatarFallback>{author?.name?.charAt(0) ?? "A"}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-semibold mt-2">
          {author?.userName ?? "User"}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
