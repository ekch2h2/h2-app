import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// MUI
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import NotificationsIcon from "@material-ui/icons/Notifications";

// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from '../../redux/actions/userActions';


class Notifications extends Component {
    state = {
        anchorEl: null
    };

    handleOpen = (event) => {
        this.setState({anchorEl: event.target});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    onMenuOpened = () => {
        let unreadNotificationIds = this.props.notifications
            .filter(n => !n.read)
            .map(n => n.notificationId);

        this.props.markNotificationsRead(unreadNotificationIds)
    };
    render() {
        const notifications = this.props.notifications;
        const anchorEl = this.state.anchorEl;
        dayjs.extend(relativeTime);

        let notificationIcon;

        if (notifications && notifications.length > 0) {
            let unreadCount = notifications.filter(n => n.read === false).length;
            unreadCount > 0 ? (
                notificationIcon = (
                    <Badge
                        badgeContent={unreadCount}
                        color="secondary"
                    >
                        <NotificationsIcon />
                    </Badge>
                )
            ) : (
                notificationIcon = <NotificationsIcon />
            )
        } else {
            notificationIcon = <NotificationsIcon />
        }

        let notificationsMarkup = notifications && notifications.length > 0 ? (
            notifications.map(n => {
                const verb = n.type === "like" ? "liked" : "commented on";
                const time = dayjs(n.createdAt).fromNow();
                const iconColor = n.read ? "primary" : "secondary";
                const icon = n.type === "like" ? (
                    <FavoriteIcon color={iconColor} style={{marginRight: 10}}/>
                ) : (
                    <ChatIcon color={iconColor} style={{marginRight: 10}}/>
                );

                return (
                    <MenuItem key={n.createdAt} onClick={this.handleClose}>
                        {icon}
                        <Typography
                            component={Link}
                            color="default"
                            variant="body1"
                            to={`/users/${n.recipient}/announcement/${n.announcementId}`}>
                            {n.sender} {verb} your announcement {time}
                        </Typography>
                    </MenuItem>
                )
            })
        ) : (
            <MenuItem onClick={this.handleClose}>
                You have no notifications yet
            </MenuItem>
        );

        return (
            <Fragment>
                <Tooltip placement="top" title="Notifications">
                    <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleOpen}
                                >
                        {notificationIcon}
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    onEntered={this.onMenuOpened}
                >
                    {notificationsMarkup}
                </Menu>
            </Fragment>
        )
    }
}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,

};

const mapStateToProps = state => ({
    notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);