import React from "react";
import Image from "next/image";
import HighitlightText from "./HighitlightText";
import GradientBg from "./GradientBg";
import { Button } from "@/components/ui/button";
import Section from "./Section";

export default function HeroSection() {
  return (
    <Section className="pt-24 dark:bg-slate-900 dark:text-white">
      <GradientBg />
      <div className="px-12 mx-auto max-w-7xl">
        <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
          <h1 className="mb-8 text-4xl lg:text-7xl font-extrabold  tracking-normal text-gray-700 dark:text-white md:text-6xl  md:tracking-tight md:leading-[4.35rem]">
            <HighitlightText text="Vinayak Vispute" />
          </h1>
          <p className="px-0 mb-8 text-lg text-gray-600 dark:text-white md:text-xl lg:px-24">
            Uniting India with AI-Powered Sign Language Recognition, Instant
            Language Translation, and Enhanced Chatting & Video Calling
            Features.
          </p>

          <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
            <Button>
              Get Started
              <svg
                className="w-4 h-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button variant={"outline"}>
              Learn More
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            </Button>
          </div>
          <div className="mt-24 w-full flex flex-col justify-center items-center rounded-lg border bg-foreground/5 p-2">
            <Image
              alt="App Image"
              width={1920}
              height={1080}
              className="shadow-[0_0_1000px_0] shadow-primary/40 dark:shadow-sky-400/40 animate-in zoom-in-75 delay-300 duration-1000 ease-out fill-mode-both text-transparent"
              src="/2tb.png"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
