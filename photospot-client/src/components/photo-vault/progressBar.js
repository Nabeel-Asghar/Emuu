import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import { Tooltip, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const containerStyles = {
  height: 20,
  width: 200,
  backgroundColor: "#e0e0de",
  borderRadius: 50,
  margin: "5px auto 10px auto",
};

class progressBar extends Component {
  constructor() {
    super();
    this.state = {
      theTotalSize: 0,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      theTotalSize: newProps.totalSize,
    });
  }

  render() {
    return (
      <Box
        border={2}
        borderRadius={16}
        borderColor="secondary.main"
        style={{ maxWidth: 250, margin: "0px auto", padding: 10 }}
      >
        {this.state.theTotalSize}/500 MB
        <IconButton onClick={() => this.props.setSize()} style={{ padding: 5 }}>
          <RefreshIcon />
        </IconButton>
        <div style={containerStyles}>
          <div
            style={{
              height: "100%",
              backgroundColor: "#23ba8b",
              borderRadius: "inherit",
              textAlign: "right",
              width: `${100 * (this.state.theTotalSize / 500)}%`,
            }}
          />
        </div>
        {this.props.disputeReason ? (
          <Typography variant="subtitle2">
            Status: <b>Dispute By Customer</b>
            <Tooltip
              title={
                <Typography style={{ padding: 7 }}>
                  The customer has disputed the order because: "
                  {this.props.disputeReason}"
                </Typography>
              }
            >
              <InfoIcon
                fontSize="small"
                color="secondary"
                style={{ padding: "0px 5px" }}
              />
            </Tooltip>
          </Typography>
        ) : this.props.confirmedByCustomer ? (
          <Typography variant="subtitle2">
            Status: <b>Confirmed By Customer</b>
            <Tooltip
              title={
                <Typography style={{ padding: 7 }}>
                  The customer has confirmed the photos. You will be paid within
                  2 days or 7 days if this is your first booking.
                </Typography>
              }
            >
              <InfoIcon
                fontSize="small"
                color="secondary"
                style={{ padding: "0px 5px" }}
              />
            </Tooltip>
          </Typography>
        ) : this.props.notifiedCustomer ? (
          <Typography variant="subtitle2">
            Status: <b>Notified Customer</b>
            <Tooltip
              title={
                <Typography style={{ padding: 7 }}>
                  You have notified the customer. They will have two days to
                  inspect the images. You will be paid after two days unless
                  they open up a dispute.
                </Typography>
              }
            >
              <InfoIcon
                fontSize="small"
                color="secondary"
                style={{ padding: "0px 5px" }}
              />
            </Tooltip>
          </Typography>
        ) : (
          ""
        )}
      </Box>
    );
  }
}

export default progressBar;
