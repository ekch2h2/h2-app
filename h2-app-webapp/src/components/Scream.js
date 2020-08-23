import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";
import MyButton from "../util/MyButton";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";

const styles = {
    card: {
        display: "flex",
        marginBottom: 20,
        position: "relative"
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: "cover"
    }
};

class Scream extends Component {
    likedScream = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.scream.screamId)) {
            return true;
        } else {
            return false;
        }
    };
    likeScream = () => {
        this.props.likeScream(this.props.scream.screamId);
    };
    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream.screamId);
    };
    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            scream: {
                body,
                createdAt,
                userImage,
                userHandle,
                likeCount,
                commentCount,
                screamId
            },
            user: {
                authenticated,
                credentials: { handle }
            }
        } = this.props;
        const likeButton = !authenticated ? (
            <MyButton tip="like">
                <Link to="/login">
                    <FavoriteBorder color="primary"/>
                </Link>
            </MyButton>
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
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId}/>
        ) : null;
        return (
            <Card className={classes.card}>
                {
                    userImage ? <CardMedia
                        image={userImage}
                        title="Profile image"
                        className={classes.image}
                    /> : <div/>
                }
                <CardContent className={classes.content}>
                    <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color="primary"
                    >
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {body}
                    </Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <ScreamDialog screamId={screamId} userHandle={userHandle} />
                </CardContent>
            </Card>
        )
    }
}

Scream.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});
export default connect(mapStateToProps, { likeScream, unlikeScream })(withStyles(styles)(Scream));