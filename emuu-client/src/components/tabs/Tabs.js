import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

const IconTabs = ({ value, handleChange }) => {
  // const [value, setValue] = useState(0);

  // const handleChange = (newValue) => {
  //   setValue(newValue);
  // };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="icon position tabs example"
    >
      <Tab icon={<DynamicFeedIcon />} iconPosition="start" label="Videos" />
      <Tab icon={<ThumbUpIcon />} iconPosition="start" label="Liked Videos" />
      <Tab
        icon={<SubscriptionsIcon />}
        iconPosition="start"
        label="Subscriptions"
      />
    </Tabs>
  );
};

export default IconTabs;
