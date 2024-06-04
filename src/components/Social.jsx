import React from 'react';
import "./style.css";

const SocialMediaIcons = () => {
  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
       

      <ul>
        <li><a href="https://www.facebook.com" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
        <li><a href="https://www.instagram.com" target="_blank"><i className="fab fa-instagram"></i></a></li>
        <li><a href="https://www.twitter.com" target="_blank"><i className="fab fa-twitter"></i></a></li>
        <li><a href="https://www.apple.com" target="_blank"><i className="fab fa-apple"></i></a></li>
      </ul>
    </div>
  );
};

export default SocialMediaIcons;
