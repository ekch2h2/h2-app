import React, {Component, Fragment} from 'react';
import { connect } from "react-redux";
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from "prop-types";

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icon
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";

import MyButton from "../../util/MyButton";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";

// Redux
import { getAnnouncement, updateAnnouncement, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.rootStyles,
    avatar: {
        height: "80%",
        width: "80%"
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: "absolute",
        left: "90%"
    },
    expandButton: {
        float: "right"
    },
    spinnerDiv: {
        textAlign: "center",
        marginTo: 50,
        marginBottom: 50
    }
});

class EditAnnouncement extends Component {
    state = {
        open: false,
        oldPath: "",
        newPath: "",
        errors: {},
        body: ""
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if (this.props.announcement.body) {
            this.setState({ body: this.props.announcement.body })
        }
    }

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;
        const { userHandle, announcementId } = this.props;
        const newPath = `/users/${userHandle}/announcement/${announcementId}`;

        if (oldPath === newPath) {
            oldPath = `/users/${userHandle}`;
        }
        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getAnnouncement(this.props.announcementId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.updateAnnouncement(this.props.announcementId, this.state.body);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        const {
            classes,
            UI: { loading }
        } = this.props;

        const { body, errors } = this.state;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200}/>
            </div>

        ) : (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    name={"body"}
                    type="text"
                    label="Content"
                    multiline
                    placeholder="Announcement content with markdown"
                    error={!!errors.body}
                    helperText={errors.body}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fullWidth
                    value={body}
                />
                <Button type="submit" variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        disabled={loading}>
                    Submit
                    {loading && (
                        <CircularProgress
                            size={30}
                            className={classes.progressSpinner}
                        />
                    )}

                </Button>
            </form>
        );
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Edit announcement" tipClassName={classes.expandButton}>
                    <EditIcon color="primary" />
                </MyButton>
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

EditAnnouncement.propTypes = {
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

export default connect(mapStateToProps, { getAnnouncement, updateAnnouncement, clearErrors })(withStyles(styles)(EditAnnouncement));