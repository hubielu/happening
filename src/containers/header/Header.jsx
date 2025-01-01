import React from 'react';
import people from '../../assets/people.png';
import ai from '../../assets/ai.png';
import './header.css';

const Header = () => (
  <div className="NI__header section__padding" id="home">
    {/*<div className="NI__header-image">
      <img src={ai} />
    </div>*/}
    <div className="NI__header-content">
      <h1 className="gradient__text">Weekly Newsletter</h1>
        <p>We send a weekly newsletter every Monday at 11am featuring that week's events.</p>
      <div className="NI__header-content__input">
        <input type="email" placeholder="Your Email Address" />
        <button type="button">Get Started</button>
      </div>

      <div className="NI__header-content__people">
        <img src={people} />
        <p>1,600 people requested access a visit in last 24 hours</p>
      </div>
    </div>

    
  </div>
);

export default Header;
