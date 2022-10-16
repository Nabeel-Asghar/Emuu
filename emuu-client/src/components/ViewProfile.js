import { useEffect } from "react";

function ViewProfile({ viewUser }) {
  useEffect(() => {
    if (!viewUser) window.location.pathname = "/";
  });

  return (
    <div>
      <img src={viewUser.BannerUrl} />
      <img src={viewUser.ProfilePictureUrl} />
      <h1>{viewUser.Username}</h1>
    </div>
  );
}

export default ViewProfile;