import React from "react";
import GroupIcon from "@material-ui/icons/Group";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import ChildFriendlyIcon from "@material-ui/icons/ChildFriendly";

const categories = {
  LinkedIn: <LinkedInIcon color="secondary" />,
  Instagram: <InstagramIcon color="secondary" />,
  Wedding: <GroupIcon color="secondary" />,
  "Baby Shower": <ChildFriendlyIcon color="secondary" />,
};

const GetIcon = (props) => {
  return <GroupIcon color="secondary" />;
};

export default GetIcon;
