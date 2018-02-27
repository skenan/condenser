import React from 'react';
import PropTypes from 'prop-types';

const SteemLogo = () => {
    return (
        <span className="logo">
            <title>CNsteem logo</title>
            <img src={require('app/assets/images/cnsteem.png')} />
        </span>
    );
};

export default SteemLogo;
