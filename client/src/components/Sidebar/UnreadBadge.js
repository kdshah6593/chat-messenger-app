import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const StyledBadge = withStyles({
  badge: {
    height: "20px",
    display: "flex",
    padding: "0 6px",
    zIndex: "1",
    position: "absolute",
    flexWrap: "wrap",
    fontSize: "0.75rem",
    minWidth: "20px",
    boxSizing: "border-box",
    transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    alignItems: "center",
    fontFamily: "Open Sans, sans-serif",
    fontWeight: "500",
    lineHeight: "1",
    alignContent: "center",
    borderRadius: "10px",
    flexDirection: "row",
    justifyContent: "center",
  },
  anchorOriginTopRightRectangle: {
    top: "0",
    right: "0",
    transform: "scale(1) translate(-50%, -50%)",
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


