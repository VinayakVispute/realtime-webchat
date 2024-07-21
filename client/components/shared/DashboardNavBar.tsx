"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Spinner from "./Spinner";
import { Input } from "@/components/ui/input";
import { Users, Share, LogIn, LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { addUserToGroup, createGroup } from "@/lib/actions/group.actions";
import { DashboardNavBarParams } from "@/interfaces";

const NavBar = ({ userName }: DashboardNavBarParams) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setHasScrolled(offset > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCreate = async () => {
    const group = await createGroup({ groupName, groupId });

    if (!group.success) {
      console.error(group.message);
      setCreateSuccess(false);
      return;
    }
    console.log("Group created successfully!");
    setCreateSuccess(true);
  };

  const handleJoin = async () => {
    //TODO: IMPLEMENT Toast Group
    if (groupId === "" || userName === "") return;
    console.log("Joining group", groupId, userName);
    // TODO:TYPES IMPLEMENTATION
    const response = await addUserToGroup({
      groupId,
      userName,
    });
    if (!response.success) {
      console.log("Error:", response.message);
      return;
    }
    setDialogOpen(false);
  };

  const openDialog = (creating: boolean) => {
    setIsCreating(creating);
    setCreateSuccess(false); // Reset success state when opening dialog
    setDialogOpen(true);
  };

  return (
    <header
      className={`sticky top-0 z-50 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-[rgba(255,255,255,0.1)] dark:bg-gray-900 backdrop-blur-lg border-gray-200 dark:border-gray-600 ${
        hasScrolled && "border-b"
      } text-sm py-3 sm:py-0`}
    >
      <nav
        className="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center justify-between">
          <Link
            className="flex-none text-xl font-semibold dark:text-white"
            href="/"
            aria-label="DevCollab Hub"
          >
            DevCollab Hub
          </Link>
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hs-collapse-toggle size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
                >
                  <svg
                    className="hs-collapse-open:hidden size-4"
                    width={16}
                    height={16}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                  <svg
                    className="hs-collapse-open:block flex-shrink-0 hidden size-4"
                    width={16}
                    height={16}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="grid gap-2 py-6">
                  <Link
                    href="#"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Home
                  </Link>
                  <Link
                    href="#"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    About
                  </Link>
                  <Link
                    href="#"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Services
                  </Link>
                  <Link
                    href="#"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:ps-7">
            <Link
              className="font-medium text-blue-600 sm:py-6 dark:text-blue-500"
              href="/"
            >
              Home
            </Link>
            <SignedIn>
              <Link
                className="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-neutral-400 dark:hover:text-neutral-500"
                href="/Dashboard"
              >
                Dashboard
              </Link>
            </SignedIn>
            <Link
              className="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-neutral-400 dark:hover:text-neutral-500"
              href="/About"
            >
              About
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDialog(true)}
            >
              <Users className="w-5 h-5" />
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <Tabs defaultValue={isCreating ? "create" : "join"}>
                  <TabsList>
                    <TabsTrigger value="create">Create</TabsTrigger>
                    <TabsTrigger value="join">Join</TabsTrigger>
                  </TabsList>
                  <TabsContent value="create">
                    <div className="flex flex-col gap-2">
                      {!createSuccess ? (
                        <>
                          <Input
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="mt-2"
                          />
                          <Input
                            type="text"
                            placeholder="Group ID"
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="mt-2"
                          />
                          <Button onClick={handleCreate} className="mt-2">
                            Create
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-green-600">
                            Group created successfully!
                          </p>
                          <p>Group ID: {groupId}</p>
                          <p>Group Name: {groupName}</p>
                          <Button variant="outline" className="mt-2">
                            <Share className="mr-2 h-4 w-4" /> Share
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="join">
                    <div className="flex flex-col gap-2">
                      <Input
                        type="text"
                        placeholder="Group ID"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        className="mt-2"
                      />
                      <Button onClick={handleJoin} className="mt-2">
                        Join
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <ClerkLoaded>
              <SignedOut>
                <Link
                  className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-s sm:border-gray-300 sm:my-6 sm:ps-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500"
                  href="/sign-in"
                >
                  <LogIn className="flex-shrink-0 h-4 w-4" />
                  Log in
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-gray-300 sm:border-s sm:my-6 sm:pl-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500">
                  <UserButton />
                </div>
              </SignedIn>
              <SignedIn>
                <SignOutButton>
                  <button className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-gray-300 sm:my-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500">
                    <LogOut className="flex-shrink-0 h-4 w-4" />
                    Sign out
                  </button>
                </SignOutButton>
              </SignedIn>
            </ClerkLoaded>
            <ClerkLoading>
              <Spinner />
            </ClerkLoading>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
