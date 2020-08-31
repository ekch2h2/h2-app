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

const styles = {};

class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <PostAnnouncement />
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon/>
                                </MyButton>
                            </Link>
                            <Notifications/>
                        </Fragment>
                    ) : (
                        <div/>
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
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(withStyles(styles)(Navbar))