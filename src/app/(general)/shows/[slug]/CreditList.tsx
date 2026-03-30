import React from "react";
import classnames from "classnames";
import Link from "next/link";
import type { Credit } from "@/app/types";
import { fullName, manualSort, nameSlug } from "@/app/utils";

interface CreditListProps {
  category: "Cast" | "Crew";
  data: Credit[] | Credit[][];
}

const CreditList = ({ category, data }: CreditListProps) => {
  if (!data.length) {
    return null;
  }

  // if (!isCrewList(data)) {
  //   return (
  //     <section>
  //       <h2>Cast</h2>

  //       <ul>
  //         {manualSort(data).map((credit: Credit) => (
  //           <li key={credit._id} className="mb-2">
  //             <Link
  //               href={`/credits/${nameSlug(credit.person)}/${credit.person._id}`}
  //               className="link text-primary/70 hover:text-primary transition-all"
  //             >
  //               {fullName(credit.person)}
  //             </Link>{" "}
  //             as <b className="text-primary/70">{credit.role}</b>
  //           </li>
  //         ))}
  //       </ul>
  //     </section>
  //   );
  // }

  return (
    <section>
      <h2>{category}</h2>
      <ul>
        {manualSort(data).map((credit: Credit) => {
          console.log("credit", credit);
          const credItem = Array.isArray(credit) ? credit[0] : credit;
          return (
            <li key={credItem._id} className="grid grid-cols-2 gap-x-2">
              <div
                className={classnames([
                  "align-top",
                  "text-right",
                  "leading-tight",
                  "pr-2",
                  "pb-2",
                  "text-sm",
                ])}
              >
                <Link
                  href={`/credits/${nameSlug(credItem.person)}/${
                    credItem.person._id
                  }`}
                  className={classnames([
                    "link",
                    // "text-sm",
                    "text-primary/70",
                    "hover:text-primary",
                    "transition-all",
                  ])}
                >
                  {fullName(credItem.person)}
                </Link>
              </div>
              <div
                className={classnames([
                  "align-top",
                  "leading-tight",
                  "pb-2",
                  "text-sm",
                ])}
              >
                <ul>
                  {Array.isArray(credit) ? (
                    credit.map((c) => {
                      return (
                        <li
                          key={c._id}
                          className={classnames([
                            // "leading-tight",
                            "[&+li]:mt-1",
                            // "text-sm",
                          ])}
                        >
                          {c.role}
                        </li>
                      );
                    })
                  ) : (
                    <li>{credit.role}</li>
                  )}{" "}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CreditList;
