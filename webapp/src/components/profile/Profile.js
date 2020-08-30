import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// MUI
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import MuiLink from '@material-ui/core/Link';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from '@material-ui/core/Typography';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from "@material-ui/icons/Edit";

// Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../../redux/actions/userActions";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import EditDetails from "./EditDetails";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";

const styles = (theme) => ({
    ...theme.rootStyles
});

class Profile extends Component {
    constructor(props) {
        super(props);
        this.imageButtonRef = React.createRef();
    }

    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append("image", image, image.name);
        this.props.uploadImage(formData);
    };

    handleEditPicture = () => {
        this.imageButtonRef.current.click();
    };

    handleLogout = () => {
        this.props.logoutUser()
    };
    render() {
        const {
            classes,
            user: {
                credentials: { handle, createdAt, imageUrl, bio, website, location },
                loading,
                authenticated
            }
        } = this.props;


        return !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"/>
                        <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                            ref={this.imageButtonRef}
                        />
                        <MyButton
                            tip="Edit profile picture"
                            onClick={this.handleEditPicture}
                            btnClassName="button"
                        >
                            <EditIcon color="primary"/>
                        </MyButton>

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
                <Tooltip title="Logout" placement="top">
                    <MyButton
                        tip="Logout"
                        onClick={this.handleLogout}
                    >
                        <KeyboardReturn color="primary"/>
                    </MyButton>

                </Tooltip>

                <EditDetails />
            </Paper>
        ) : (

            <Paper className={classes.paper}>
                <Typography variant="body2" aligh="center">
                    No profile found, please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to={"/login"}>
                        Login
                    </Button>
                    <Button variant="contained" color="secondary" component={Link} to={"/signup"}>
                        Signup
                    </Button>
                </div>
            </Paper>
        )) : (<ProfileSkeleton />);
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};
export default connect(mapStateToProps, { logoutUser, uploadImage })(withStyles(styles)(Profile));