import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';
import EditAnnouncement from "./EditAnnouncement";
import ReactMarkdown from 'react-markdown';
import MyButton from "../../util/MyButton";
import DeleteAnnouncement from "./DeleteAnnouncement";
import AnnouncementDialog from "./AnnouncementDialog";
// Redux
import { connect } from "react-redux";
// MUI
import Avatar from "@material-ui/core/Avatar";
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from "@material-ui/core/Typography";
// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArchiveAnnouncement from "./ArchiveAnnouncement";

const styles = (theme) => ({
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
    },
    actions: {
        display: "block"
    },
    expand: {
        float: "right",
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    markdownContainer: {
        h2: {
            fontSize: "1em"
        }
    }
});

class Announcement extends Component {
    state = {
        expanded: false
    };

    toggleExpandContent = () => {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }))
    };

    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            announcement: {
                body,
                createdAt,
                userImage,
                userHandle,
                commentCount,
                announcementId
            },
            user: {
                authenticated,
                credentials: { handle }
            },
            openDialog
        } = this.props;

        const expanded = this.state.expanded;

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteAnnouncement announcementId={announcementId}/>
        ) : null;
        const editButton = authenticated && userHandle === handle ? (
            <EditAnnouncement
                announcementId={announcementId}
                userHandle={userHandle}
            />
        ) : null;
        const archiveBotton = authenticated && userHandle === handle ? (
            <ArchiveAnnouncement announcementId={announcementId} userHandle={userHandle} />
        ) : null;
        const actionsMarkup = (
            <div>
                {editButton}
                {archiveBotton}
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

                <Collapse
                    in={expanded}
                    timeout="auto"
                    collapsedHeight="18rem"
                >
                    <CardContent className={classes.content}>
                        <Typography id={"content-" + announcementId}>
                            <ReactMarkdown source={body}
                                           className={classes.markdownContainer}/>
                        </Typography>
                    </CardContent>
                </Collapse>
                <CardActions className={classes.actions}>
                    <AnnouncementDialog
                        announcementId={announcementId}
                        userHandle={userHandle}
                        openDialog={openDialog}
                    />
                    <span>{commentCount} comments</span>
                    <MyButton tip="expand announcement"
                              btnClassName={clsx(classes.expand, {
                                  [classes.expandOpen]: expanded,
                              })}>
                        <ExpandMoreIcon color="primary" onClick={this.toggleExpandContent}/>
                    </MyButton>

                </CardActions>
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