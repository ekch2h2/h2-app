import React, {Component, Fragment} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Redux
import { connect } from "react-redux";
import { getScream } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.rootStyles,
    commentImage: {
        maxWidth: "100%",
        height: 100,
        objectFit: "cover",
        borderRadius: "50%"
    },
    commentData: {
        marginLeft: 20
    }
});

class Comments extends Component {
    render() {
        const { comments, classes } = this.props;

        return (
            <Grid container>
                {comments && comments.map(({ body, createdAt, userImage, userHandle }, index) => {
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <img src={userImage} alt="comment" className={classes.commentImage}/>
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={classes.commentData}>
                                            <Typography
                                                variant="h5"
                                                component={Link}
                                                to={`/users/${userHandle}`}
                                                color="primary"
                                            >
                                                {userHandle}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                >
                                                {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                                            </Typography>
                                            <hr className={classes.invisibleSeparator}/>
                                            <Typography variant="body1">
                                                {body}
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== comments.length - 1 && (<hr className={classes.visibleSeparator}/>)}
                        </Fragment>
                    )
                })}
            </Grid>
        )
    }
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    scream: state.data.scream,
    UI: state.UI
});

export default connect(mapStateToProps, { getScream })(withStyles(styles)(Comments));