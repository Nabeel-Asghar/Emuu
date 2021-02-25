import Button from "@material-ui/core/Button";
import { blue, green, red } from "@material-ui/core/colors";
import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import React from "react";

const RotatingCarousel = (props) => {
  return (
    <div>
      <AutoRotatingCarousel
        interval={4000}
        label="Get started"
        open={props.open}
        onClose={props.handleClose}
        onStart={props.handleClose}
        style={{ position: "absolute" }}
      >
        <Slide
          media={
            <img src="http://www.icons101.com/icon_png/size_256/id_79394/youtube.png" />
          }
          mediaBackgroundStyle={{ backgroundColor: red[400] }}
          style={{ backgroundColor: red[600] }}
          title="This is your photography page."
          subtitle="Only you can see this page in this view. You can see your profile in customer view by clicking the Customer View button."
        />
        <Slide
          media={
            <img src="http://www.icons101.com/icon_png/size_256/id_80975/GoogleInbox.png" />
          }
          mediaBackgroundStyle={{ backgroundColor: blue[400] }}
          style={{ backgroundColor: blue[600] }}
          title="Edit your page."
          subtitle="Here you can edit your page and set any details that you wish. Just click the edit icon!"
        />
        <Slide
          media={
            <img src="http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png" />
          }
          mediaBackgroundStyle={{ backgroundColor: green[400] }}
          style={{ backgroundColor: green[600] }}
          title="Don't forget to set your profile picture!"
          subtitle="Your profile picture will show up in search, you can also set a header picture that is shown when someone visits your profile."
        />
        <Slide
          media={
            <img src="http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png" />
          }
          mediaBackgroundStyle={{ backgroundColor: green[400] }}
          style={{ backgroundColor: green[600] }}
          title="Set up an account with Stripe Payments!"
          subtitle="You must sign up for a Stripe account to use PhotoSpot. Stripe is a payment service."
        />
      </AutoRotatingCarousel>
    </div>
  );
};

export default RotatingCarousel;
