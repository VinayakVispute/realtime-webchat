import React from "react";
import Image from "next/image";
import NextJs from "@/public/svg/nextjs-icon-svgrepo-com.svg";
import Redis from "@/public/svg/redis-logo-svgrepo-com.svg";
import MongoDb from "@/public/svg/mongodb-logo-svgrepo-com.svg";
import Cloudinary from "@/public/svg/cloudinary-svgrepo-com.svg";
import Kafka from "@/public/svg/kafka-svgrepo-com.svg";
import SocketIo from "@/public/svg/socket-dot-io-svgrepo-com.svg";
import NodeJs from "@/public/svg/nodejs-1-logo-svgrepo-com.svg";

const techStackIcons = [
  { src: NextJs, alt: "NextJs Icon" },
  { src: NodeJs, alt: "NodeJs Icon" },
  { src: Cloudinary, alt: "Cloudinary Icon" },
  { src: MongoDb, alt: "MongoDb Icon" },
  { src: SocketIo, alt: "SocketIo Icon" },
  { src: Kafka, alt: "Kafka Icon" },
  { src: Redis, alt: "Redis Icon" },
];

const features = [
  {
    icon: (
      <svg
        className="flex-shrink-0 mt-2 size-8 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width={18} height={10} x={3} y={11} rx={2} />
        <circle cx={12} cy={5} r={2} />
        <path d="M12 7v4" />
        <line x1={8} x2={8} y1={16} y2={16} />
        <line x1={16} x2={16} y1={16} y2={16} />
      </svg>
    ),
    title: "Creative minds",
    description:
      "We choose our teams carefully. Our people are the secret to great work.",
  },
  {
    icon: (
      <svg
        className="flex-shrink-0 mt-2 size-8 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
    title: "Effortless updates",
    description:
      "Benefit from automatic updates to all boards any time you need to make a change to your website.",
  },
  {
    icon: (
      <svg
        className="flex-shrink-0 mt-2 size-8 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Strong empathy",
    description:
      "We've user tested our own process by shipping over 1k products for clients.",
  },
  {
    icon: (
      <svg
        className="flex-shrink-0 mt-2 size-8 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    title: "Conquer the best",
    description: "We stay lean and help your product do one thing well.",
  },
  {
    icon: (
      <svg
        className="flex-shrink-0 mt-2 size-8 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx={9} cy={7} r={4} />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Designing for people",
    description:
      "We actively pursue the right balance between functionality and aesthetics, creating delightful experiences.",
  },
  {
    icon: (
      <svg
        className="flex-shrink-0 mt-2 size-8 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    ),
    title: "Simple and affordable",
    description:
      "From boarding passes to movie tickets, there's pretty much nothing you can't store with Preline.",
  },
];

const IconSection = () => {
  return (
    <div className="overflow-hidden bg-black max-w-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto dark:bg-black-900 dark:text-white relative">
      <div
        aria-hidden="true"
        className="flex absolute -top-72 start-1/2 transform -translate-x-1/2"
      >
        <div className="bg-gradient-to-r from-violet-300/50 to-purple-100 blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem] dark:from-violet-900/50 dark:to-purple-900" />
        <div className="bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl w-[90rem] h-[50rem] rounded-fulls origin-top-left -rotate-12 -translate-x-[15rem] dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70" />
      </div>

      <div className="relative z-10">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-2xl text-center mx-auto">
            <p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
              TechStack we used to build DevCollab Hub
            </p>
            <div className="mt-5 max-w-2xl">
              <h1 className="block font-semibold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200">
                <span className="block">DevCollab Hub</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8 md:my-16 grid grid-cols-3 sm:flex sm:justify-center gap-6 sm:gap-x-12 lg:gap-x-20">
        {techStackIcons.map((icon, index) => (
          <div
            key={index}
            className="flex-shrink-0 transition hover:-translate-y-1"
          >
            <Image src={icon.src} width={80} height={80} alt={icon.alt} />
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto py-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="space-y-6 lg:space-y-10">
              <div className="flex">
                {feature.icon}
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconSection;
