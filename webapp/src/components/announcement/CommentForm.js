import React, { Component } from 'react';
import { connect } from "react-redux";
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from "prop-types";

// MUI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// Icon

import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.rootStyles
});


class CommentForm extends Component {
    state = {
        body: "",
        errors: {}
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors !== this.state.errors) {
            this.setState({ errors: nextProps.UI.errors ? nextProps.UI.errors : {}})
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: "" })
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.announcementId, {body: this.state.body})
    };

    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: "center" }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Comment on announcement"
                        error={errors.error ? true : false}
                        helperText={errors.error}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.textField}
                    />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                        >
                            Submit
                        </Button>
                </form>
                <hr className={classes.visibleSeparator}/>
            </Grid>
        ) : null;
        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    announcementId: PropTypes.string.isRequired,
    UI: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));