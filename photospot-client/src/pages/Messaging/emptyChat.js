import { Divider, Grid, Hidden, Typography } from "@material-ui/core";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { Slide } from "material-auto-rotating-carousel";
import React from "react";

const { withStyles } = require("@material-ui/core/styles");

const styles = {
  root: {
    height: "100%",
    width: "100%",
  },
  newChatBtn: {
    height: "50px",
    fontWeight: "bold",
    borderRadius: "0px",
    lineHeight: "50px",
  },

  userList: {
    backgroundColor: "white",
  },

  messagesIcon: {
    width: "300px",
    height: "300px",
    color: "#f5f5f5",
  },
};

const StyledSlide = withStyles(styles)(Slide);

const emptyChat = (props) => {
  return (
    <Grid container spacing={0} style={{ height: "75vh" }}>
      <Grid item xs={0} sm={4} className={props.classes.userList}>
        <Hidden only="xs">
          <Typography
            component="h1"
            variant="subtitle1"
            align="center"
            className={props.classes.newChatBtn}
          >
            Messages
          </Typography>
          <Divider />
          <Typography variant="subtitle1" style={{ marginLeft: "16px" }}>
            You have no messages...
          </Typography>
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={8}>
        <StyledSlide
          media={<QuestionAnswerIcon className={props.classes.messagesIcon} />}
          mediaBackgroundStyle={{ backgroundColor: "#23ba8b" }}
          style={{ backgroundColor: "#00895e" }}
          title="You have no messages."
          subtitle="To message a photographer, go to their page and click the contact button and send them a message."
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(emptyChat);
