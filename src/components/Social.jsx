import React from 'react';
import "./style.css";

const SocialMediaIcons = () => {
  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
       

      <ul>
        <li><a href="https://de.linkedin.com/" target="_blank"><i className="fab fa-linkedin"></i></a></li>
        <li><a href="https://www.instagram.com" target="_blank"><i className="fab fa-instagram"></i></a></li>
        <li><a href="https://github.com/callmewhatuwant/" target="_blank"><i className="fab fa-github-square"></i></a></li>
        <li><a href="https://hub.docker.com/" target="_blank"><i className="fab fa-docker"></i></a></li>
      </ul>
    </div>
  );
};

export default SocialMediaIcons;
