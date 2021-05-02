import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';
import EditAnnouncement from "./EditAnnouncement";
import DeleteAnnouncement from "./DeleteAnnouncement";
// Redux
import { connect } from "react-redux";
// MUI
import Avatar from "@material-ui/core/Avatar";
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from '@material-ui/core/CardActions';
import Typography from "@material-ui/core/Typography";
import ButtonGroup from '@material-ui/core/ButtonGroup';

// Icons
import ArchiveAnnouncement from "./ArchiveAnnouncement";
import ReactMarkdown from "react-markdown";
import {markdownTextPreProcess} from "../../util/markdown_utils";
import CardContent from "@material-ui/core/CardContent";
import ShareButton from "./ShareButton";
import AnnouncementDialog from "./AnnouncementDialog";
import PinAnnouncement from "./PinAnnouncement";

const styles = (theme) => ({
    card: {
        marginBottom: 20,
        position: "relative",
    },
    cardPinToTop: {
        "background-color": "cornsilk"
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: "cover"
    },
    actions: {
        display: "block"
    },
    markdownContainer: {
        h2: {
            fontSize: "1em"
        },
        '& img': {
            width: "100%"
        },
        '& a': {
            'white-space': "pre-wrap",
            'word-wrap': 'break-word'
        }
    }
});

class Announcement extends Component {
    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            announcement: {
                body,
                createdAt,
                userImage,
                userHandle,
                announcementId,
                pinToTop
            },
            user: {
                authenticated,
                credentials: { handle }
            },
            openDialog
        } = this.props;

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteAnnouncement announcementId={announcementId}/>
        ) : null;
        const editButton = authenticated && userHandle === handle ? (
            <EditAnnouncement
                announcementId={announcementId}
                userHandle={userHandle}
            />
        ) : null;
        const archiveButton = authenticated && userHandle === handle ? (
            <ArchiveAnnouncement announcementId={announcementId} userHandle={userHandle} />
        ) : null;
        const pinButton = authenticated && userHandle === handle ? (
            <PinAnnouncement announcementId={announcementId} pinToTop={pinToTop} />
        ) : null;
        const shareButton = <ShareButton announcementId={announcementId} content={body}/>;
        const actionsMarkup = (
            <ButtonGroup classes={classes.buttonGroup}>
                {shareButton}
                {editButton}
                {pinButton}
                {archiveButton}
                {deleteButton}
            </ButtonGroup>
        );
        const userLink = (<Typography
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
        >
            {userHandle}
        </Typography>);

        return (
            <Card className={clsx(classes.card, {[classes.cardPinToTop]: pinToTop})}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={userHandle}
                            className={classes.avatar}
                            src={userImage}
                        >
                        </Avatar>
                    }
                    title={userLink}
                    subheader={dayjs(createdAt).fromNow()}
                />


                    <CardContent className={classes.content}>
                        <Typography
                            id={"content-" + announcementId}
                        >
                            <ReactMarkdown
                                source={markdownTextPreProcess(body)}
                                className={classes.markdownContainer}
                            />
                        </Typography>
                    </CardContent>

                <CardActions className={classes.actions}>
                    {actionsMarkup}
                </CardActions>
                <AnnouncementDialog announcementId={announcementId} openDialog={openDialog}/>
            </Card>
        )
    }
}

Announcement.propTypes = {
    user: PropTypes.object.isRequired,
    announcement: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user
});
export default connect(mapStateToProps)(withStyles(styles)(Announcement));