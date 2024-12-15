import React from 'react'
import './CSS/Footer.css'

export const Footer = () => {
  return (
    <div className="footer">
      <div className='footer-content'>
        <div className="footer-content-left">
          <a className='footer-logo' href="#">Qairline</a>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis et incidunt vero, repellendus deserunt iste tempore esse delectus accusantium deleniti ea praesentium illum rem veniam nulla cupiditate facilis quidem. Excepturi!</p>
          <div className="footer-social-icons">
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Our Destination</li>
            <li>Our Activity</li>
            <li>Travel Blogs</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+84-946837636</li>
            <li>globalUET@vnu.vn</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2024 @ UETVNU.com - All Right Reserved</p>
    </div>
  )
}

export default Footer; 