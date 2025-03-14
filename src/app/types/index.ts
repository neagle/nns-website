import { WixDataItem } from "@wix/wix-data-items-sdk";

export interface Show extends WixDataItem {
  _id: string;
  title: string;
  author: string;
  director: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  logo: string;
  backgroundTexture?: string;
  openingDate: string;
}

export interface Credit {
  _id: string;
  role: string;
  person: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
}
