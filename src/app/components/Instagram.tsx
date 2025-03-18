"use client";

import React from "react";
import Script from "next/script";

// const InstagramOfficial = () => {
//   return (
//     <div className="max-w-[540px]">
//       <blockquote
//         className="instagram-media bg-white border-0 rounded-[3px]
//                    shadow-[0_0_1px_0_rgba(0,0,0,0.5),0_1px_10px_0_rgba(0,0,0,0.15)]
//                    m-[1px] max-w-[540px] min-w-[326px] p-0"
//         data-instgrm-permalink="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
//         data-instgrm-version="14"
//         style={{ width: "calc(100% - 2px)" }} // Tailwind doesn't directly support calc()
//       >
//         <div className="p-4">
//           {/* Top link to the profile; the "skeleton" placeholders that Instagram uses */}
//           <a
//             href="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
//             className="bg-white leading-none p-0 text-center no-underline w-full block"
//             target="_blank"
//             rel="noreferrer"
//           >
//             {/* Skeleton “header” area */}
//             <div className="flex flex-row items-center">
//               <div className="bg-[#F4F4F4] rounded-full flex-grow-0 h-10 w-10 mr-3" />
//               <div className="flex flex-col flex-grow">
//                 <div className="bg-[#F4F4F4] rounded-[4px] h-[14px] mb-[6px] w-[100px]" />
//                 <div className="bg-[#F4F4F4] rounded-[4px] h-[14px] w-[60px]" />
//               </div>
//             </div>
//             <div className="py-[19%]" />
//             <div className="m-auto w-[50px] h-[50px] mb-3"></div>
//             <div className="pt-2">
//               <div className="text-[#3897f0] font-sans text-sm font-semibold leading-[18px]">
//                 View this profile on Instagram
//               </div>
//             </div>
//             <div className="py-[12.5%]" />
//             {/* More placeholder shapes follow, if you want the entire skeleton content */}
//           </a>

//           {/* Footer text / link */}
//           <p
//             className="text-[#c9c8cd] font-sans text-sm leading-[17px]
//                        mt-2 mb-0 overflow-hidden p-[8px_0_7px] text-center
//                        text-ellipsis whitespace-nowrap"
//           >
//             <a
//               href="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
//               className="text-[#c9c8cd] no-underline"
//               target="_blank"
//               rel="noreferrer"
//             >
//               NOVA Nightsky Theater
//             </a>{" "}
//             (@
//             <a
//               href="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
//               className="text-[#c9c8cd] no-underline"
//               target="_blank"
//               rel="noreferrer"
//             >
//               novanightskytheater
//             </a>
//             ) • Instagram photos and videos
//           </p>
//         </div>
//       </blockquote>
//       {/*
//          The script that makes Instagram’s embed snippet come alive.
//          "strategy" ensures we only load it in the client, lazily.
//       */}
//       <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
//     </div>
//   );
// };

const Instagram = () => {
  return (
    <div className="max-w-[540px]">
      <blockquote
        className="instagram-media bg-white border-0 rounded-[3px]
                   shadow-[0_0_1px_0_rgba(0,0,0,0.5),0_1px_10px_0_rgba(0,0,0,0.15)]
                   m-[1px] max-w-[540px] min-w-[326px] p-0"
        data-instgrm-permalink="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
        data-instgrm-version="14"
        style={{ width: "calc(100% - 2px)" }} // Tailwind doesn't directly support calc()
      >
        <div className="p-4">
          {/* Top link to the profile; the "skeleton" placeholders that Instagram uses */}
          <a
            href="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
            className="bg-white leading-none p-0 text-center no-underline w-full block"
            target="_blank"
            rel="noreferrer"
          >
            {/* Skeleton “header” area */}
            <div className="flex flex-row items-center">
              <div className="bg-[#F4F4F4] rounded-full flex-grow-0 h-10 w-10 mr-3" />
              <div className="flex flex-col flex-grow">
                <div className="bg-[#F4F4F4] rounded-[4px] h-[14px] mb-[6px] w-[100px]" />
                <div className="bg-[#F4F4F4] rounded-[4px] h-[14px] w-[60px]" />
              </div>
            </div>
            <div className="py-[19%]" />
            <div className="m-auto w-[50px] h-[50px] mb-3"></div>
            <div className="pt-2">
              <div className="text-[#3897f0] font-sans text-sm font-semibold leading-[18px]">
                View this profile on Instagram
              </div>
            </div>
            <div className="py-[12.5%]" />
            {/* More placeholder shapes follow, if you want the entire skeleton content */}
          </a>

          {/* Footer text / link */}
          <p
            className="text-[#c9c8cd] font-sans text-sm leading-[17px]
                       mt-2 mb-0 overflow-hidden p-[8px_0_7px] text-center
                       text-ellipsis whitespace-nowrap"
          >
            <a
              href="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
              className="text-[#c9c8cd] no-underline"
              target="_blank"
              rel="noreferrer"
            >
              NOVA Nightsky Theater
            </a>{" "}
            (@
            <a
              href="https://www.instagram.com/novanightskytheater/?utm_source=ig_embed&utm_campaign=loading"
              className="text-[#c9c8cd] no-underline"
              target="_blank"
              rel="noreferrer"
            >
              novanightskytheater
            </a>
            ) • Instagram photos and videos
          </p>
        </div>
      </blockquote>
      {/* 
         The script that makes Instagram’s embed snippet come alive.
         "strategy" ensures we only load it in the client, lazily.
      */}
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </div>
  );
};

export default Instagram;
