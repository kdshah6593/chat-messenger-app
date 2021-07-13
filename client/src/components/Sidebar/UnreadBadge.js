import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const StyledBadge = withStyles({
  badge: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  anchorOriginTopRightRectangle: {
    top: "0",
    right: "0",
    transform: "scale(1) translate(-50%, 50%)",
    transformOrigin: "100% 0%",
  }
})(Badge);

export default function UnreadBadge(props) {
  return <StyledBadge 
  badgeContent={props.unreadCount()}
  color="primary"
  >
  {" "}
  </StyledBadge>
}