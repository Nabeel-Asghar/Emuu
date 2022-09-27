import { useState } from "react";
import storage from "../../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function FileUpload() {
    // Store uploaded file
    const [file, setFile] = useState("");

    //Store pecent
    const [percent, setPercent] = useState(0);

    //File upload 1
    function handleChange(event) {
        setFile(event.target.files[0]);
    }
    //If a user doesn't choose a file and tries to upload, error will appear
    const handleUpload = () => {
        if (!file) {
            alert("Please upload a video first");
        }
        //Store into video folder in firebase storage
        const storageRef = ref(storage, `/videos/${file.name}`);


        //Upload to firebase function
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100 //percent display
                );

                // update percent
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                });
            }
        );
    };

    return (
        <div>
            <input type="file" onChange={handleChange} accept="video/mp4" /> //only accepts mp4 files
            <button onClick={handleUpload}>Upload to Firebase</button>
            <p>{percent} "% done"</p>
        </div>
    );
}

export default FileUpload;