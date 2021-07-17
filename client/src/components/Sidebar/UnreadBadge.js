import React from 'react';
import { withStyles, createTheme } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const theme = createTheme({
  palette: {
    info: {
      main: '#2196f3',
    },
    badgeText: {
      main: '#fff'
    }
  },
  spacing: 5,
  typography: {
    fontFamily: 'Open Sans, Sans Serif',
    fontSize: 10,
    fontWeight: 700,
  }
});


const StyledBadge = withStyles({
  badge: {
    height: 20,
    width: 20,
    backgroundColor: theme.palette.info.main,
    marginRight: theme.spacing(2),
    color: theme.palette.badgeText.main,
    fontSize: theme.typography.fontSize,
    letterSpacing: -0.5,
    fontWeight: theme.typography.fontWeight,
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
  badgeContent={props.unreadCount}
  >
  {" "}
  </StyledBadge>
}