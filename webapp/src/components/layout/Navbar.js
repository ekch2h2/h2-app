import React, {Component, Fragment} from 'react';
import { connect } from "react-redux";

// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import PropTyes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import HomeIcon from "@material-ui/icons/Home";
import PostAnnouncement from "../announcement/PostAnnouncement";
import Notifications from "./Notifications";

const styles = {};

class Navbar extends Component {
    render() {
        const {
            authenticated,
            isAnnouncementProvider
        } = this.props;

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
                        </Fragment>
                    ) : <Fragment>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/">
                            Home
                        </Button>
                        <Button color="inherit" component={Link} to="/signup">
                            Signup
                        </Button>
                    </Fragment>
                    }
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