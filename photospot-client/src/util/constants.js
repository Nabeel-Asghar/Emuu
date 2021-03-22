export const PROFESSIONAL = "Professional";
export const PERSONAL = "Personal";
export const HEADSHOT = "Headshot";
export const BABY_SHOWER = "Baby Shower";
export const WEDDING = "Wedding";

export const shootStatus = {
  photographer: "Cancelled by Photographer",
  customer: "Cancelled by Customer",
  inProgress: "In Progress",
  completed: "Completed",
};

export const shootType = {
  [PROFESSIONAL]: "This is a Professional shoot",
  [PERSONAL]: "This is a Personal shoot",
  [HEADSHOT]: "This is a Headshot shoot",
  [BABY_SHOWER]: "This is a Baby Shower shoot",
  [WEDDING]: "This is a Wedding shoot",
};

export const textFields = [
  { name: "email", label: "Email" },
  { name: "password", label: "Password" },
  { name: "confirmPassword", label: "Confirm Password" },
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
];

export const showVault = ["In Progress", "Completed"];
export const showCancel = ["In Progress"];

export const CATEGORIES_LIST = [
  PROFESSIONAL,
  PERSONAL,
  HEADSHOT,
  BABY_SHOWER,
  WEDDING,
];
