import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';
import EditAnnouncement from "./EditAnnouncement";
import MyButton from "../../util/MyButton";
import DeleteAnnouncement from "./DeleteAnnouncement";
// Redux
import { connect } from "react-redux";
// MUI
import Avatar from "@material-ui/core/Avatar";
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from '@material-ui/core/CardActions';
import Typography from "@material-ui/core/Typography";
// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArchiveAnnouncement from "./ArchiveAnnouncement";
import ReactMarkdown from "react-markdown";
import {markdownTextPreProcess} from "../../util/markdown_utils";
import Collapse from "@material-ui/core/Collapse/Collapse";
import CardContent from "@material-ui/core/CardContent";

const styles = (theme) => ({
    card: {
        marginBottom: 20,
        position: "relative"
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: "cover"
    },
    actions: {
        display: "block"
    },
    expand: {
        float: "right",
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    markdownContainer: {
        h2: {
            fontSize: "1em"
        },
        '& img': {
            width: "100%"
        }
    }
});

const collapsedHeightForWideScreen = 150;
const collapsedHeightForNarrow = 350;
const wideNarrowThresh = 500;

class Announcement extends Component {
    state = {
        expanded: false,
        dimensions: null
    };

    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

    toggleExpandContent = () => {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }))
    };

    updateContentDimensions() {
        this.setState({
            dimensions: {
                width: this.container.current.offsetWidth,
                height: this.container.current.offsetHeight,
            },
        })


    }

    componentDidMount() {
        this.updateContentDimensions();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.dimensions == null || prevState.dimensions.height !== this.container.current.offsetHeight) {
            this.updateContentDimensions();
        }
    }

    shouldShowMore() {
        const { dimensions } = this.state;
        return dimensions && dimensions.height >= this.collapsedHeight();
    }

    collapsedHeight() {
        const { dimensions } = this.state;
        if (dimensions) {
            return dimensions.width > wideNarrowThresh ?
                collapsedHeightForWideScreen : collapsedHeightForNarrow;
        }
        return collapsedHeightForWideScreen;
    }

    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            announcement: {
                body,
                createdAt,
                userImage,
                userHandle,
                announcementId
            },
            user: {
                authenticated,
                credentials: { handle }
            }
        } = this.props;

        const { expanded } = this.state;

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteAnnouncement announcementId={announcementId}/>
        ) : null;
        const editButton = authenticated && userHandle === handle ? (
            <EditAnnouncement
                announcementId={announcementId}
                userHandle={userHandle}
            />
        ) : null;
        const archiveBotton = authenticated && userHandle === handle ? (
            <ArchiveAnnouncement announcementId={announcementId} userHandle={userHandle} />
        ) : null;
        const actionsMarkup = (
            <div>
                {editButton}
                {archiveBotton}
                {deleteButton}
            </div>
        );
        const userLink = (<Typography
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
        >
            {userHandle}
        </Typography>);

        const showMoreButton = (
            <MyButton tip="expand announcement"
                                         btnClassName={clsx(classes.expand, {
                                             [classes.expandOpen]: expanded,
                                         })}>
                <ExpandMoreIcon color="primary" onClick={this.toggleExpandContent}/>
            </MyButton>
        );
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={userHandle}
                            className={classes.avatar}
                            src={userImage}
                        >
                        </Avatar>
                    }
                    action={actionsMarkup}
                    title={userLink}
                    subheader={dayjs(createdAt).fromNow()}
                />


                    <CardContent className={classes.content}>
                        <Collapse
                            in={expanded}
                            timeout="auto"
                            collapsedHeight={`${this.collapsedHeight()}px`}
                        >
                            <Typography
                                id={"content-" + announcementId}
                                ref={this.container}
                                onLoad={this.updateContentDimensions.bind(this)}
                            >
                                <ReactMarkdown
                                    source={markdownTextPreProcess(body)}
                                    className={classes.markdownContainer}
                                />
                            </Typography>
                        </Collapse>

                    </CardContent>

                <CardActions className={classes.actions}>
                    {this.shouldShowMore() ? showMoreButton : <div/>}
                </CardActions>
            </Card>
        )
    }
}

Announcement.propTypes = {
    user: PropTypes.object.isRequired,
    announcement: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user
});
export default connect(mapStateToProps)(withStyles(styles)(Announcement));