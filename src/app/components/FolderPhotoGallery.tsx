import React from "react";
import wixClient from "@/lib/wixClient";
import PhotoStrip from "@/app/components/PhotoStrip";
import classNames from "classnames";

interface FolderPhotoGalleryProps {
  className?: string;
  folderId: string;
}

enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

const FolderPhotoGallery = async ({
  folderId,
  className = "",
}: FolderPhotoGalleryProps) => {
  const { files } = await wixClient.files.listFiles({
    parentFolderId: folderId,
    sort: { fieldName: "displayName", order: SortOrder.ASC },
  });

  return (
    <div className={classNames(className, ["md:w-[300px]"])}>
      <PhotoStrip
        photos={files.map((file) => ({
          _id: file._id || "",
          resourceUrl: file.media?.image?.image || "",
          name: file.displayName || "",
        }))}
      />
    </div>
  );
};

export default FolderPhotoGallery;
