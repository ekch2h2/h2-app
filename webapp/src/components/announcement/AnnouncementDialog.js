import React, {Component, Fragment} from 'react';
import { connect } from "react-redux";
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icon
import CloseIcon from "@material-ui/icons/Close";

import MyButton from "../../util/MyButton";
import { getAnnouncement, clearErrors } from "../../redux/actions/dataActions";
import ChatIcon from "@material-ui/icons/Chat";
import Comments from "./Comments";
import ReactMarkdown from "react-markdown";
import CommentForm from "./CommentForm";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import {markdownTextPreProcess} from "../../util/markdown_utils";

const styles = (theme) => ({
    ...theme.rootStyles,
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: "absolute",
        right: "0.6rem",
        top: "0.6rem"
    },
    spinnerDiv: {
        textAlign: "center",
        marginTo: 50,
        marginBottom: 50
    },
    markdownContainer: {
        display: "block",
        width: "100%",
        overflow: "hidden"
    },
    avatar: {
        width: "4rem",
        height: "4rem"
    }
});

class AnnouncementDialog extends Component {
    state = {
        open: false
    };

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        this.setState({ open: true});
        this.props.getAnnouncement(this.props.announcementId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    };

    render() {
        const {
            classes,
            announcement : {
                body,
                createdAt,
                userImage,
                userHandle,
                announcementId,
                commentCount,
                comments
            },
            UI: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200}/>
            </div>

        ) : (
            <Grid container>
                <Grid item sm={1} className={classes.avatarContainer}>
                    <Avatar alt={userHandle} src={userImage} className={classes.avatar} />
                </Grid>
                <Grid item sm>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h6"
                        to={`/users/${userHandle}`}
                        >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                    </Typography>
                </Grid>
                <div className={classes.markdownContainer}>
                    <hr className={classes.invisibleSeparator}/>
                    <ReactMarkdown source={markdownTextPreProcess(body)}/>
                </div>

                <Container>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                </Container>
                <hr className={classes.visibleSeparator} />
                <CommentForm announcementId={announcementId}/>
                <Comments comments={comments} />
            </Grid>
        );
        return (
            <Fragment>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="md">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

AnnouncementDialog.propTypes = {
    getAnnouncement: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    announcementId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    announcement: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    announcement: state.data.announcement,
    UI: state.UI
});

export default connect(mapStateToProps, { getAnnouncement, clearErrors })(withStyles(styles)(AnnouncementDialog));