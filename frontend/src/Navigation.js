import React, { useEffect } from 'react';
import './styles/HomepageStyle.css';
import './resources/iconfonts/iconfont.css';
import companyLogo from './company_logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from './actions/userActions';
import { setSelectedChild } from './actions/childActions';

function HeaderNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const selectedChildState = useSelector((state) => state.selectedChild);
  const { child: selectedChild } = selectedChildState;

  useEffect(() => {
    // Initialize selected child if not set
    if (!selectedChild && userInfo && userInfo.children && userInfo.children.length > 0) {
      dispatch(setSelectedChild(userInfo.children[0]));
    }
  }, [selectedChild, userInfo, dispatch]);

  const handleChildChange = (event) => {
    const selectedChildId = event.target.value;
    const selectedChild = userInfo.children.find((child) => child._id === selectedChildId);
    dispatch(setSelectedChild(selectedChild));
    navigate('/'); // Redirect to homepage or any route to refresh data
  };

  const signoutHandler = () => {
    dispatch(signout());
    navigate('/signin'); // Redirect to signin page after signout
  };

  return (
    <div>
      {/* Header Section */}
      <header>
        <img src={companyLogo} alt="OIC Education Logo" className="company-logo-png" />
        <h1>OIC Education</h1>

        {/* Move the child-selector before the user-account div */}
        {userInfo && userInfo.children && userInfo.children.length > 0 && (
          <div className="child-selector">
            {userInfo.children.length > 1 ? (
              <select onChange={handleChildChange} value={selectedChild ? selectedChild._id : ''}>
                {userInfo.children.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="single-child-name">{userInfo.children[0].name}</span>
            )}
          </div>
        )}

        {/* User Account Section */}
        <div className="user-account">
          <span className="iconfont icon-Account user"></span>
          <span className="username-display">{userInfo ? userInfo.name : 'User Name'}</span>
        </div>
      </header>

      {/* Nav part */}
      <nav className="leftNav">
        <ul className="topNav">
          <li>
            <Link to="/" id="Homepage">
              <span className="iconfont icon-homepage navLogo"></span>
              Homepage
            </Link>
          </li>
          <li>
            <Link to="/Surveys" id="Surveys">
              <span className="iconfont icon-survey navLogo"></span>
              Surveys
            </Link>
          </li>
          <li>
            <Link to="/career_orientation" id="Career Orientation">
              <span className="iconfont icon-InterestsOutlined navLogo"></span>
              Career Orientation
            </Link>
          </li>
          <li>
            <Link to="/institutions" id="Institution Fees">
              <span className="iconfont icon-coin1 navLogo"></span>
              Institution Fees
            </Link>
          </li>
          <li>
            <Link to="/calendar" id="Calendar">
              <span className="iconfont icon-calendar1 navLogo"></span>
              Calendar
            </Link>
          </li>
        </ul>

        <div className="navTitleBackground">
          <span id="navTitle">ACCOUNT DETAILS</span>
        </div>

        <ul className="bottomNav">
          <li>
          <Link to="/Account" id="Account">
              <span className="iconfont icon-account navLogo"></span>
              Account
              </Link>
          </li>
          <li>
  {/* Conditionally render Sign In or Sign Out button */}
  {userInfo ? (
    <Link to="/signin" onClick={signoutHandler} >
      <span className="iconfont icon-signout navLogo"></span> {/* Icon */}
      {/* Non-breaking space */}
      Sign Out
    </Link>
  ) : (
    <Link to="/signin">
       {/* Space before the icon */}
      <span className="iconfont icon-signout navLogo"></span> {/* Icon */}
     {/* Non-breaking space */}
      Sign In
    </Link>
  )}
</li>

        </ul>
      </nav>
    </div>
  );
}

export default HeaderNav;
