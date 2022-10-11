import React, { useEffect , useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Home.scss";
import {storage} from "../../Firebase.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {db} from "../../Firebase.js";
import { getFirestore, collection, getDocs, doc, query, where } from 'firebase/firestore';


const theme = createTheme({
  palette: {
    primary: {
      light: "#484848",
      main: "#212121",
      dark: "#000000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#6bffff",
      main: "#0be9d0",
      dark: "#00b69f",
      contrastText: "#000",
    },
  },
});





 function Home() {


 const [topVideos, setTopVideos]= useState([]);
 const [recentVideos, setRecentVideos] = useState([]);

 async function getVideos(){
 //Get all video data
const querySnapshot = await getDocs(collection(db, "Videos"));

//Create array for top videos and sort by likes
const querySnapshotTop=[];
querySnapshot.forEach(doc => querySnapshotTop.push(doc))
sortVideosByLikes(querySnapshotTop);
const topVideosArr = [];
querySnapshotTop.forEach((doc) => {
topVideosArr.push(doc.data())
});

//Create array for recent videos and sort by upload date
  const querySnapshotRecent=[];
  querySnapshot.forEach(doc => querySnapshotRecent.push(doc))
  sortVideosByTime(querySnapshotRecent);
  const recentVideosArr = [];
  querySnapshotRecent.forEach((doc) => {
  recentVideosArr.push(doc.data())


});
setTopVideos(topVideosArr);
setRecentVideos(recentVideosArr);

}


//Sort function for liked videos
function sortVideosByLikes(videos){
for( let i =0 ; i< videos.length-1 ; i++){
for(let j =0;  j < (videos.length-1-i); j++){
    if(videos[i].data().Likes < videos[i+1].data().Likes){
    let temp = videos[i];
    videos[i] = videos[i+1];
    videos[i+1]= temp;
}}}}

//Sort function for date uploaded
function sortVideosByTime(videos){
for( let i =0 ; i< videos.length-1 ; i++){
for(let j =0;  j < (videos.length-1-i); j++){
    if(videos[i].data().uploadTime< videos[i+1].data().uploadTime){
    let temp = videos[i];
    videos[i] = videos[i+1];
    videos[i+1]= temp;
}}}}


useEffect(async() => {
await getVideos();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="Home">
        <h1>EMUU</h1>
        <p class="text-start">
          <h2>
            <div class="p-4"> Top Videos </div>
          </h2>
            <div> {topVideos && topVideos.map(video => <div><video controls height='300' src={video.VideoUrl}></video></div>)}
         </div>

        </p>

        <p class="text-start">
          <div className="break">
            <h2>
              <div class="p-4">Newest</div>
            </h2>
          </div>
            <div> {recentVideos && recentVideos.map(video => <div><video controls height='300' src={video.VideoUrl}></video></div>)}
        </div>
        </p>
      </div>
    </ThemeProvider>
  );
  useEffect = () => {
    // Get clips
  };
}


export default Home;
