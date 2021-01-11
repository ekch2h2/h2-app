import React, {Component, Fragment} from 'react';
import { connect } from "react-redux";
import withStyles from '@material-ui/core/styles/withStyles';
import {clearErrors, postAnnouncement} from "../../redux/actions/dataActions";
import PropTypes from "prop-types";

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icon
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import MyButton from "../../util/MyButton";

const styles = (theme) => ({
    ...theme.rootStyles,
    submitButton: {
        margin: "10px auto 10px auto",
        position: "relative",
        float: "right"
    },
    progressSpinner: {
        position: "absolute"
    }
});

class PostAnnouncement extends Component {
    state = {
        open: false,
        body: "",
        errors: {}
    };
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: "",
                open: false
            });
        }
    }

    handleOpen = () => {
        this.setState({open: true})
    };

    handleClose = () => {
        this.props.clearErrors();
        this.setState({
            open: false,
            errors: {}
        })
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postAnnouncement({body: this.state.body});
    };

    render() {
        const { errors } = this.state;
        const { classes, UI: { loading }} = this.props;

        return (
            <Fragment>
                <MyButton
                    onClick={this.handleOpen}
                    tip="Post an Announcement!">
                    <AddIcon/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="md">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>
                        Post a new announcement
                    </DialogTitle>
                    <DialogContent>
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
                                rows="6"
                                rowsMax="12"
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
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostAnnouncement.propTypes = {
    postAnnouncement: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(mapStateToProps, { postAnnouncement, clearErrors })(withStyles(styles)(PostAnnouncement));
