import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";

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

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, name) {
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
}

const PictureUploader = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const finalize = useCallback(async () => {
    setDisabled(true);
    try {
      const croppedImage = await getCroppedImg(
        props.image,
        croppedAreaPixels,
        0,
        props.name
      );
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      await props.savePicture(croppedImage);
      setDisabled(false);
    } catch (e) {
      console.error(e);
    }
  }, [props.image, croppedAreaPixels, 0]);

  return (
    <Dialog open={props.open} maxWidth="lg" fullWidth>
      <DialogContent style={{ padding: "75px 20px" }}>
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
            rotation={0}
            zoom={1}
            aspect={props.aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
          />
        </div>
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => props.closeEditor()}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PictureUploader;
