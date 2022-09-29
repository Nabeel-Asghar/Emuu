import React, {useState} from 'react'
import './Feeds.scss';
import {Avatar} from '@mui/material';


function Feeds(){
const[UserPostDescrip,setUserPostDescrip]=useState("");
    return (
        <div className="Main-Feeds-Container">
            <div className="top-container">
                <div className="Feed-input container">

                    <div className="avatar-container">
                    <Avatar>src="https://wallpaperaccess.com/full/170249.jpg"
                    </Avatar></div>
                    <div className="input-container"></div>
                        <input id="Post-Desc" placeholder="What's on your mind"
                        value={UserPostDescrip}
                        onChange={(e)=>{setUserPostDescrip(e.target.value)}}/>

                </div>
                <div className="feed-post-button-container">

                </div>

            </div>
            <div className="bottom-container">


            </div>




        </div>
    )


}

export default Feeds;