import React from 'react'
import './Profile.scss';
import Feeds from './Feeds'
import UserInfo from './UserInfo'






function Profile() {

    return (
        <div className="MainProfileDiv">
                    <div className="profile-container">
                <div className="top-portion">
                    <div className="user-profile-bg-image">
                        <img id="prf-bg-img" src="https://wallpaperaccess.com/full/170249.jpg" alt="" srcset=""/>
                        </div>
                    <div className="user-profile-img">
                        <img id="prf-img" src="https://wallpaperaccess.com/full/170249.jpg" alt="" srcset=""/>
                        </div>
                        <div className={"userName"}>
                            Moe
                        </div>
                         <p class="text-end">

                                                                    <h4><div class = "p-5"> Subscribers: xxx </div></h4></p>
                    </div>
                        <div className="bottom-portion">

                                                                    <p class="text-start">

                                            <h2><div class = "p-4"> Uploaded Videos </div></h2>


                                            <div className = "spacer">
                                       <iframe width="382" height="215"
                                         src="https://www.youtube.com/embed/UqjRknIf3oI"
                                         title="YouTube video player" frameborder="0"
                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowfullscreen></iframe>
                                        </div>

                                       <div className = "spacer">
                                  <iframe width="382" height="215"
                                    src="https://www.youtube.com/embed/rDxv8jkYmb4"
                                     title="YouTube video player" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                     allowfullscreen></iframe>
                                 </div>
                                <div className = "spacer">
                                 <iframe width="382" height="215"
                                   src="https://www.youtube.com/embed/0GBiA5JOht4"
                                    title="YouTube video player" frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                   allowfullscreen></iframe>
                                 </div>
                                 </p>





                        </div>
                        </div>
            </div>




    )








}

export default Profile;