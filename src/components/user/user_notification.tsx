"use client";

import { useState, useRef } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Image from "next/image"; // For displaying logos if you're using Next.js image optimization
import { useTranslation } from "react-i18next";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { t } = useTranslation();
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      logo: "https://i.postimg.cc/253YSNy0/headphone-jbl1.png",
      name: "Notification 1",
      description: "This is the first notification",
      date: "10-03-2024",
      status:"pending",
    },
    {
      id: 2,
      logo: "https://i.postimg.cc/253YSNy0/headphone-jbl1.png",
      name: "Notification 2",
      description: "This is the second notification",
      date: "10-03-2024",
      status:"pending",
    },
    {
      id: 3,
      logo: "https://i.postimg.cc/253YSNy0/headphone-jbl1.png",
      name: "Notification 3",
      description: "This is the third notification",
      date: "10-03-2024",
      status:"pending",
    },
  ];

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <div className="msg_box">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="notificationContainer">
          <IconButton ref={anchorRef} onClick={handleClick}>
            <NotificationsNoneIcon className="icon" />
            <div className="counter">{notifications.length}</div>
          </IconButton>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom"
            style={{ zIndex: 1300 }}>
            <Box className="popperBox">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="notificationItem">
                    <Image
                      src={notification.logo}
                      alt={notification.name}
                      width={40}
                      height={40}
                      className="notificationLogo"
                    />
                    <div className="notificationContent">
                      <Typography variant="h6">{notification.date}</Typography>
                      <Typography variant="h5">{notification.name}</Typography>
                      <Typography variant="body2">
                        {notification.description}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        className="readButton">
                        {t("Action")}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <Typography variant="body2">No new notifications.</Typography>
              )}
            </Box>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default Notification;
