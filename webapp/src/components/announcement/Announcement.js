import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { connect } from "react-redux";
import MyButton from "../../util/MyButton";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteAnnouncement from "./DeleteAnnouncement";
import AnnouncementDialog from "./AnnouncementDialog";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import ReactMarkdown from 'react-markdown';
import LikeButton from "./LikeButton";
import EditAnnouncement from "./EditAnnouncement";

const styles = {
    card: {
        marginBottom: 20,
        position: "relative"
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: "cover"
    }
};

class Announcement extends Component {
    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            scream: {
                body,
                createdAt,
                userImage,
                userHandle,
                likeCount,
                commentCount,
                screamId
            },
            user: {
                authenticated,
                credentials: { handle }
            },
            openDialog
        } = this.props;
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteAnnouncement screamId={screamId}/>
        ) : null;
        const editButton = authenticated && userHandle === handle ? (
            <EditAnnouncement
                screamId={screamId}
                userHandle={userHandle}
            />
        ) : null;
        const actionsMarkup = (
            <div>
                {editButton}
                {deleteButton}
            </div>
        );
        const userLink = (<Typography
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
        >
            {userHandle}
        </Typography>);
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={userHandle}
                            className={classes.avatar}
                            src={userImage}
                        >
                        </Avatar>
                    }
                    action={actionsMarkup}
                    title={userLink}
                    subheader={dayjs(createdAt).fromNow()}
                />

                <CardContent className={classes.content}>
                    <ReactMarkdown source={body} />
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <AnnouncementDialog
                        screamId={screamId}
                        userHandle={userHandle}
                        openDialog={openDialog}
                    />
                </CardContent>
            </Card>
        )
    }
}

Announcement.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user
});
export default connect(mapStateToProps)(withStyles(styles)(Announcement));