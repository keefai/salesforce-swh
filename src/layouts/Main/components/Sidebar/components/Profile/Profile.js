import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 120,
    height: 120
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, user = null, ...rest } = props;

  const classes = useStyles();

  const data = {
    name: user ? user.display_name : 'User',
    avatar: user ? user.photos.picture : '/images/user.png',
    bio: user ? user.nick_name : 'Bio'
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={data.avatar}
        to="/me"
      />
      <Typography
        className={classes.name}
        variant="h4"
      >
        {data.name}
      </Typography>
      <Typography variant="body2">{data.bio}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  user: PropTypes.any
};

export default Profile;
