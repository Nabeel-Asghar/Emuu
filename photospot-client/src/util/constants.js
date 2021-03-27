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

export const photographerPageSetupTextFields = [
  {
    description: "Enter in the type of camera that you have",
    name: "camera",
    label: "Camera",
  },
  {
    description: "Enter in a headline to show up on the search page.",
    name: "headline",
    label: "Headline",
  },
  {
    description:
      " Enter in your instagram handle which will be clickable by users. Recommended to put a photography base page.",
    name: "instagram",
    label: "Instagram",
  },
  {
    description:
      "Enter in your company name. Whether photography related or not.",
    name: "company",
    label: "Company",
  },
  {
    description: "Enter in your biography.",
    name: "bio",
    label: "Biography",
  },
];
