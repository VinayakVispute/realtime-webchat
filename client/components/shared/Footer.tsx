import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto min-w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto dark:bg-black">
      {/* ========== FOOTER ========== */}
      {/* Grid */}
      <div className="text-center">
        <div>
          <a
            className="flex-none text-xl font-semibold text-black dark:text-white"
            href="#"
            aria-label="Brand"
          >
            DevCollab Hub
          </a>
        </div>
        {/* End Col */}
        <div className="mt-3">
          <p className="text-gray-500 dark:text-neutral-500">
            This is developed by{" "}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
              href="https://github.com/VinayakVispute"
            >
              Vinayak Vispute |
            </Link>{" "}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
              href="https://github.com/VinayakVispute"
            >
              {" "}
              Github
            </Link>
          </p>
          <p className="text-gray-500 dark:text-neutral-500">
            © DevCollab. 2024 VinayakVispute. All rights reserved.
          </p>
        </div>
        {/* Social Brands */}

        <div className="mt-3 space-x-2  gap-4 flex justify-center items-center ">
          {/* Github */}
          <Link href="https://github.com/VinayakVispute">
            <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#333]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                {/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
              </svg>
            </span>
          </Link>
          {/* Gmail */}
          <Link href="mailto:vinayakvispute4@gmail.com">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              x="0"
              y="0"
              viewBox="0 0 48 48"
              className="h-7 w-7"
            >
              <path
                fill="#4caf50"
                d="M45 16.2l-5 2.75-5 4.75V40h7a3 3 0 003-3V16.2z"
              ></path>
              <path
                fill="#1e88e5"
                d="M3 16.2l3.614 1.71L13 23.7V40H6a3 3 0 01-3-3V16.2z"
              ></path>
              <path
                fill="#e53935"
                d="M35 11.2L24 19.45 13 11.2 12 17 13 23.7 24 31.95 35 23.7 36 17z"
              ></path>
              <path
                fill="#c62828"
                d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A4.298 4.298 0 003 12.298z"
              ></path>
              <path
                fill="#fbc02d"
                d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A4.298 4.298 0 0145 12.298z"
              ></path>
            </svg>
          </Link>
          {/* Linkedin */}
          <Link href="https://www.linkedin.com/in/vispute-vinayak">
            <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#0077b5]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                {/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
                <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
              </svg>
            </span>
          </Link>

          {/* X */}
          <Link href="https://x.com/vinayakVispute7/">
            <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-black dark:[&>svg]:fill-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                {/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </span>
          </Link>
        </div>

        {/* End Social Brands */}
      </div>
      {/* End Grid */}
      {/* ========== END FOOTER ========== */}
    </footer>
  );
};

export default Footer;
