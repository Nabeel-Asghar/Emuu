import React from "react"


function UploadButton() {
  return (
    <div className="m-3">
      <label className="mx-3">Choose file: </label>
      <input className="d-none" type="file" />
      <button className="btn btn-outline-primary">Upload</button>
    </div>
  );
}

export default UploadButton;





let uploadBtn = document.querySelector("#file-upload");
uploadBtn.addEventListener("change", changeBG);
function changeBG() {
  let reader;
  if (this.files && this.files[0]) {
    reader = new FileReader();
    reader.onload = (e) => {
      bgObject.img.src = e.target.result;
      drawCanvas();
    };
    reader.readAsDataURL(this.files[0]);
  }
}