import React from 'react';
import { Helmet } from 'react-helmet';

const LoginPage = ({ onSignIn }) => (
    <>
      <Helmet>
        <title>Happening</title>
        <meta name="description" content="Sign in to Happening at Stanford - Your go-to guide for events and activities at Stanford University." />
        <meta name="keywords" content="Stanford Happening, Stanford Happening login, Happening login, Stanford events" />
        {/*<link rel = "canonical" href = "/login" />*/}
      </Helmet>
      <div className="login-page">
        <div className="gradient-outline-box">
          <h1>Welcome to <span className="gradient__text">Happening</span></h1>
          <p>Your go-to guide to everything happening at Stanford.</p>
          <button onClick={onSignIn} className="sign-in-btn">Sign in</button>
        </div>
      </div>
    </>
  );

  export default LoginPage;