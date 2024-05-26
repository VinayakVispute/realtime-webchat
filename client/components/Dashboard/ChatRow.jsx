"use client";
import Link from "next/link";
import { useState } from "react";

const ChatRow = ({ chat }) => {
  return (
    <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
      <th
        scope="row"
        className="flex items-center justify-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
          alt={`${chat.name} avatar`}
          className="w-10 h-10 rounded-full  mr-3"
        />
        {chat.name}
      </th>
      <td className="px-4 py-2 text-center">
        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
          {chat.members}
        </span>
      </td>
      <td className="flex px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white justify-center">
        <div className="flex -space-x-2">
          {chat.avatars.slice(0, 4).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ))}

          <Link
            href="#"
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-gray-200 rounded-full border-2 border-white"
          >
            +5
          </Link>
        </div>

        {/* {chat.avatars.map((avatar, index) => (
          <div className="flex -space-x-2">
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
              alt
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
              alt
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-3.png"
              alt
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-gray-200 rounded-full border-2 border-white"
            >
              +5
            </a>
          </div>
        ))} */}
      </td>
      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
        <button
          type="button"
          className="px-4 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="rtl:rotate-180 w-3 h-3 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </td>
      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="mt-2 flex justify-center items-center">
          <button className="text-xs bg-red-500 text-white px-4 py-2 rounded mr-2">
            Leave
          </button>

          <button className="text-xs bg-gray-500 text-white px-4 py-2 rounded flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={2}
                d="M4 12h16M4 6h16M4 18h16"
              />
            </svg>
            Share
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ChatRow;
