import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// MUI
import Paper from "@material-ui/core/Paper";
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = (theme) => ({
    ...theme.rootStyles
});


const StaticProfile = (props) => {
    const {
        classes,
        profile: { handle, createdAt, imageUrl, bio, website, location },
    } = props;

    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} alt="profile" className="profile-image"/>
                </div>
                <hr/>
                <div className="profile-details">
                    <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                        @{handle}
                    </MuiLink>
                    {bio && <Typography variant="body2">{bio}</Typography> }
                    <hr />
                    {location && (
                        <Fragment>
                            <LocationOn color="primary"/>
                            <span>{location}</span>
                        </Fragment>

                    )}
                    <hr />
                    {website && (
                        <Fragment>
                            <LinkIcon color="primary" />
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {"  "}{website}
                            </a>
                        </Fragment>
                    )}
                    <hr />
                    <CalendarToday color="primary" />{"  "}
                    <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
                </div>
            </div>
        </Paper>
    );
};

StaticProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};
export default withStyles(styles)(StaticProfile);