// import React, { Component } from "react";

// import withStyles from "@material-ui/core/styles/withStyles";

// import Carousel from "@brainhubeu/react-carousel";
// import "@brainhubeu/react-carousel/lib/style.css";

// const styles = {
//   img: {
//     width: "300px",
//     height: "300px",
//   },
// };

// class photoSamples extends Component {
//   render() {
//     const { classes, images } = this.props;

//     var imageContainer = [];

//     for (var i = 0; i < images.length; i++) {
//       imageContainer.push(
//         <img
//           key={i}
//           className={classes.img}
//           src={images[i]}
//           alt="Photographer Image"
//         />
//       );
//     }

//     return (
//       <Carousel slidesPerPage={4} arrows infinite centered>
//         {imageContainer}
//       </Carousel>
//     );
//   }
// }

// export default withStyles(styles)(photoSamples);
