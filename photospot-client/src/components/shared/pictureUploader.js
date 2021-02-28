import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DialogActions, Grid, Typography } from "@material-ui/core";
import SliderComponent from "./SliderComponent";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

async function getCroppedImg(imageSrc, pixelCrop, rotation, name) {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );
    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
        file.name = name;
        resolve(file);
      }, "image/jpeg");
    });
  } catch (e) {
    return false;
  }
}

const PictureUploader = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const finalize = useCallback(async () => {
    setDisabled(true);
    try {
      const croppedImage = await getCroppedImg(
        props.image,
        croppedAreaPixels,
        rotation,
        props.name
      );
      if (!croppedImage) {
        setError("Error, please upload an image");
      } else {
        setCroppedImage(croppedImage);
        await props.savePicture(croppedImage);
        setDisabled(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [props.image, croppedAreaPixels, rotation]);

  const closeEditor = () => {
    setDisabled(false);
    setError(null);
    props.closeEditor();
  };

  return (
    <Dialog
      open={props.open}
      maxWidth="md"
      fullWidth
      fullScreen={props.fullScreen}
    >
      <DialogContent style={{ padding: " 20px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 400,
            background: "#333",
            margin: "0 auto",
          }}
        >
          <Cropper
            image={props.image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={props.aspect}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>
        {error && (
          <div style={{ textAlign: "center" }}>
            <Typography className={props.classes.customError}>
              Error, please upload an image
            </Typography>
          </div>
        )}
        <Grid container>
          <Grid item xs={12} sm={6}>
            {" "}
            <SliderComponent
              label={"Zoom"}
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              setValue={setZoom}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {" "}
            <SliderComponent
              label={"Rotation"}
              value={rotation}
              min={0}
              max={360}
              step={1}
              setValue={setRotation}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => closeEditor()}
          style={{ marginRight: 10 }}
          size="large"
        >
          Exit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => finalize()}
          disabled={disabled}
          size="large"
        >
          {disabled && (
            <CircularProgress
              color="secondary"
              className={props.classes.progress}
            />
          )}
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PictureUploader;
