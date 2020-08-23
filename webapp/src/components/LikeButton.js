import React, { Component } from 'react';
import MyButton from "../util/MyButton";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {likeScream, unlikeScream} from "../redux/actions/dataActions";
import withStyles from "@material-ui/core/styles/withStyles";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const styles = {

};

class LikeButton extends Component {
    likedScream = () => {
        return !!(
            this.props.user.likes &&
            this.props.user.likes.find(like => like.screamId === this.props.screamId)
        );
    };
    likeScream = () => {
        this.props.likeScream(this.props.screamId);
    };
    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId);
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
            this.likedScream() ? (
                <MyButton tip="Undo like" onClick={this.unlikeScream}>
                    <FavoriteIcon color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="like" onClick={this.likeScream}>
                    <FavoriteBorder color="primary"/>
                </MyButton>
            )
        );
    }
}


LikeButton.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { likeScream, unlikeScream })(withStyles(styles)(LikeButton));