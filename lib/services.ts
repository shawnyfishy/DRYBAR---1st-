import rawServicesData from '../brand/services.json';

export interface MetaData {
  source: string;
  transcription: string;
  authority: string;
  currency: string;
  currency_display: string;
  amount_display: string;
  entry_price: number;
  entry_price_phrase_en: string;
}

export interface LengthTier {
  id: string;
  index: string; // "01", "02", "03", "04"
  label_en: string;
  label_ar: string;
}

export interface HairStylingService {
  id: string;
  order: number;
  name_en: string;
  name_ar: string;
  keep_latin_script: boolean;
  prices: {
    short: number;
    medium: number;
    long: number;
    extra_long: number;
  };
}

export interface AddOnService {
  id: string;
  order: number;
  name_en: string;
  name_ar: string;
  includes_en: string[];
  includes_display_en: string | null;
  price: number;
  duration_note_en: string | null;
  render_rule?: string;
}

export interface MembershipTier {
  id: string;
  order: number;
  sessions: number;
  sessions_label_en: string;
  benefit_en: string;
  benefit_percent: number;
  extras_en: string[];
}

export interface ServicesData {
  meta: MetaData;
  lengthTiers: LengthTier[];
  hairStylingHeading: string;
  hairStyling: HairStylingService[];
  addOnsHeading: string;
  addOns: AddOnService[];
  membershipHeading: string;
  memberships: MembershipTier[];
}

export function getServicesData(): ServicesData {
  return {
    meta: rawServicesData._meta,
    lengthTiers: rawServicesData.length_tiers,
    hairStylingHeading: rawServicesData.hair_styling.heading_en,
    hairStyling: rawServicesData.hair_styling.services,
    addOnsHeading: rawServicesData.add_ons.heading_en,
    addOns: rawServicesData.add_ons.services,
    membershipHeading: rawServicesData.membership.heading_en,
    memberships: rawServicesData.membership.tiers,
  };
}
