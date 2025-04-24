import React from "react";
import classnames from "classnames";
import slugify from "@sindresorhus/slugify";
import FolderPhotoGallery from "@/app/components/FolderPhotoGallery";
import Link from "next/link";

type Props = {
  name: string;
  slug?: string;
  title: string;
  photosFolderId?: string;
  children?: React.ReactNode;
};

const Person = ({ name, slug, title, photosFolderId, children }: Props) => {
  const personSlug =
    slug || slugify(name, { separator: "-", lowercase: false });

  return (
    <section
      id={slugify(name)}
      className={classnames([
        "pt-8",
        "mb-6",
        "md:mb-10",
        "md:grid",
        "md:grid-cols-[1fr_auto_3fr]",
        "md:gap-4",
        "lg:gap-6",
        "xl:gap-8",
        "[&_p]:text-sm",
        "[&_p]:md:text-lg",
        "[&_p]:leading-tight",
        "[&_p]:mb-4",
        "[&_p:last-of-type]:mb-0",
      ])}
    >
      <div className="md:text-right">
        <Link href={`/credits/${personSlug}`}>
          <h2 className="text-xl leading-tight mb-1 hover:text-info! transition-colors">
            {name}
          </h2>
        </Link>
        <h3 className="text-accent! mb-4 font-normal! normal-case! font-sans! leading-tight">
          {title}
        </h3>
      </div>
      <div className="mb-4 md:mb-0 md:-mt-4">
        {photosFolderId && <FolderPhotoGallery folderId={photosFolderId} />}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default Person;
