import React, { Component } from 'react';
import MyButton from "../../util/MyButton";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {likeAnnouncement, unlikeAnnouncement} from "../../redux/actions/dataActions";
import withStyles from "@material-ui/core/styles/withStyles";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const styles = {

};

class LikeButton extends Component {
    likedAnnouncement = () => {
        return !!(
            this.props.user.likes &&
            this.props.user.likes.find(like => like.announcementId === this.props.announcementId)
        );
    };
    likeAnnouncement = () => {
        this.props.likeAnnouncement(this.props.announcementId);
    };
    unlikeAnnouncement = () => {
        this.props.unlikeAnnouncement(this.props.announcementId);
    };

    render() {
        const { authenticated } = this.props.user;

        return !authenticated ? (
            <Link to="/login">
                <MyButton tip="like">
                    <FavoriteBorder color="primary"/>
                </MyButton>
            </Link>
        ) : (
            this.likedAnnouncement() ? (
                <MyButton tip="Undo like" onClick={this.unlikeAnnouncement}>
                    <FavoriteIcon color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="like" onClick={this.likeAnnouncement}>
                    <FavoriteBorder color="primary"/>
                </MyButton>
            )
        );
    }
}


LikeButton.propTypes = {
    likeAnnouncement: PropTypes.func.isRequired,
    unlikeAnnouncement: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    announcementId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = { likeAnnouncement, unlikeAnnouncement };

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(LikeButton));