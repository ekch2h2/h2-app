import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { deleteAnnouncement } from "../../redux/actions/dataActions";
import MyButton from "../../util/MyButton";

// MUI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const styles = {

};

class DeleteAnnouncement extends Component {
    state = {
        open: false
    };

    handleOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false })
    };

    deleteAnnouncement = () => {
        this.props.deleteAnnouncement(this.props.announcementId);
        this.handleClose();
    };

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton tip="Delete Announcement"
                          onClick={this.handleOpen}
                          btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color="primary"/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                    >
                    <DialogTitle>
                        Are you sure you want to delete this announcement?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteAnnouncement} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteAnnouncement.propTypes = {
    deleteAnnouncement: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    announcementId: PropTypes.string.isRequired
};

export default connect(null, { deleteAnnouncement })(withStyles(styles)(DeleteAnnouncement));