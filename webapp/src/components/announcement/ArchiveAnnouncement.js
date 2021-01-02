import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { archiveAnnouncement } from "../../redux/actions/dataActions";
import MyButton from "../../util/MyButton";

// MUI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import ArchiveOutline from '@material-ui/icons/ArchiveOutlined';

const styles = {

};

class ArchiveAnnouncement extends Component {
    state = {
        open: false
    };

    handleOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false })
    };

    archiveAnnouncement = () => {
        this.props.archiveAnnouncement(this.props.announcementId);
        this.handleClose();
    };

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton tip="Archive Announcement"
                          onClick={this.handleOpen}
                          btnClassName={classes.archiveButton}
                >
                    <ArchiveOutline color="primary"/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                    >
                    <DialogTitle>
                        Are you sure you want to archive this announcement?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.archiveAnnouncement} color="secondary">
                            Archive
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

ArchiveAnnouncement.propTypes = {
    archiveAnnouncement: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    announcementId: PropTypes.string.isRequired
};

export default connect(null, { archiveAnnouncement })(withStyles(styles)(ArchiveAnnouncement));