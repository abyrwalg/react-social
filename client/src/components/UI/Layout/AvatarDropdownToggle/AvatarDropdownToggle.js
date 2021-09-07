import React, { useContext } from 'react';

import { AuthContext } from '../../../../context/AuthContext';
import defaultUserpic from '../../../../assets/images/default-userpic.png';

const AvatarDropdownToggle = () => {
  const { avatar, username } = useContext(AuthContext);
  const avatarUrl = avatar
    ? `/${avatar.split('\\').join('/')}`
    : defaultUserpic;

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
      <span style={{ marginRight: '10px' }}>{username}</span>
      <div
        style={{
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          width: '35px',
          height: '35px',
        }}
      />
    </div>
  );
};

export default AvatarDropdownToggle;
