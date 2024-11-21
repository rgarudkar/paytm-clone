import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../state/authSlice';
import { Menu, MenuItem, Avatar, Typography } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";

export const Appbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const username = useSelector((state)=> state.auth.username);
  const userInitial = username ? username.charAt(0).toUpperCase() : '';
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">
        PayTM App
      </div>

      <div className="flex items-center gap-4 mr-4">
        <Typography className="mr-4 flex flex-col justify-center h-full">
          Hello
        </Typography>

        {/* Avatar and Menu */}
        <Avatar
          onClick={handleMenuOpen}
          className="cursor-pointer"
          sx={{ bgcolor: "slategray", width: 35, height: 35 }}
        >
          {userInitial}
        </Avatar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountCircle fontSize="small" className="mr-2" />
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" className="mr-2" />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
