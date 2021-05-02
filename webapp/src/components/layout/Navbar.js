import React, {Component, Fragment} from 'react';
import { connect } from "react-redux";

// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import PropTyes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import HomeIcon from "@material-ui/icons/Home";
import PostAnnouncement from "../announcement/PostAnnouncement";
import Notifications from "./Notifications";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

const styles = {};

class Navbar extends Component {
    render() {
        const {
            authenticated,
            isAnnouncementProvider
        } = this.props;

        const calButton = (<Link to="/cal">
            <MyButton tip="Calendar">
                <CalendarTodayIcon/>
            </MyButton>
        </Link>)
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            { !!isAnnouncementProvider ? <PostAnnouncement /> : <div/>}
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon/>
                                </MyButton>
                            </Link>
                            <Notifications/>
                            {calButton}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Link to="/login">
                                <MyButton tip="Account login">
                                    <AccountCircleIcon />
                                </MyButton>
                            </Link>
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon/>
                                </MyButton>
                            </Link>
                            {calButton}
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTyes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    isAnnouncementProvider: state.user.credentials.isAnnouncementProvider
});

export default connect(mapStateToProps)(withStyles(styles)(Navbar))