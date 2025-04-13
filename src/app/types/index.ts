import type { WixDataItem } from "@wix/wix-data-items-sdk";

export interface Show extends WixDataItem {
  _id: string;
  title: string;
  slug: string;
  author: string;
  director: {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  logo: string;
  logoHorizontal?: string;
  backgroundTexture?: string;
  backgroundColor?: string;
  openingDate: string;
  program?: string;
}

export interface Person extends WixDataItem {
  firstName: string;
  middleName?: string;
  lastName: string;
  headshot?: string;
}

export interface Credit {
  _id: string;
  role: string;
  person: Person;
  order?: number;
  show: Show;
  category: "cast" | "crew";
}

export interface ShowWithData extends Show {
  cast: Credit[];
  crew: Credit[][];
  shows: Show[];
}

/* Probably deprecated by V3Event type */
export interface Event extends WixDataItem {
  title: string;
  dateAndTimeSettings: {
    startDate: string;
    endDate: string;
  };
  eventPageUrl: string;
  location: {
    name: string;
    address: {
      city: string;
      country: string;
      formatted: string; // "225 E Broad St, Falls Church, VA 22046, USA"
      postalCode: string;
      streetAddress: {
        apt: string;
        name: string;
        number: string;
      };
      subdivision: string; // "VA"
    };
    locationTbd: boolean;
    type: string; // "VENUE"
  };
  mainImage: string;
  registration: {
    allowedGuestTypes: string; // "VISITOR_OR_MEMBER"
    initialType: string;
    registrationDisabled: boolean;
    registrationPaused: boolean;
    status: string; // "OPEN_TICKETS"
    tickets: {
      currency: string; // "USD"
      highestPrice: Price;
      lowestPrice: Price;
      type: string; // "REGULAR"
      soldOut: boolean;
      ticketLimitPerOrder: number;
    };
  };
  shortDescription: string;
  slug: string;
  status: "UPCOMING" | "PAST" | "CANCELED";
}

interface Price {
  currency: string; // "USD"
  formattedValue: string; // "$25.00"
  value: string; // "25.00"
}

export interface PhotoSettings {
  width: number;
  height: number;
  focalPoint?: [number, number];
}

export interface Photo {
  description: string;
  slug: string;
  alt: string;
  src: string;
  title: string;
  type: "image";
  settings?: PhotoSettings;
}

export interface Ticket {
  _id: string;
  eventId: string;
  limitPerCheckout: number;
  description: string;
  free: boolean;
  name: string;
  orderIndex: number;
  policy: string;
  price: Price;
  pricing: {
    fixedPrice: Price;
    pricingType: string; // "STANDARD"
  };
  saleStatus: string; // "SALE_STARTED"
}
