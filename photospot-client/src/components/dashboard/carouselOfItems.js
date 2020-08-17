import React, { Component } from "react";
import ItemsCarousel from "react-items-carousel";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Fab from "@material-ui/core/Fab";

export class carouselOfItems extends Component {
  constructor() {
    super();
    this.state = {
      activeItemIndex: 0,
    };
  }
  render() {
    const { orders } = this.props;
    return (
      <ItemsCarousel
        infiniteLoop={false}
        gutter={-20}
        activePosition={"center"}
        chevronWidth={60}
        disableSwipe={false}
        alwaysShowChevrons={false}
        numberOfCards={2}
        slidesToScroll={2}
        outsideChevron={false}
        showSlither={false}
        firstAndLastGutter={false}
        activeItemIndex={this.state.activeItemIndex}
        requestToChangeActive={(value) =>
          this.setState({ activeItemIndex: value })
        }
        rightChevron={
          <Fab color="secondary" size="small">
            <ChevronRightIcon />
          </Fab>
        }
        leftChevron={
          <Fab color="secondary" size="small">
            <ChevronLeftIcon />
          </Fab>
        }
      >
        {orders}
      </ItemsCarousel>
    );
  }
}

export default carouselOfItems;
