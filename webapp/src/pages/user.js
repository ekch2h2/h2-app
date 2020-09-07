import React, { Component } from 'react'
import PropTyes from 'prop-types';
import Grid from '@material-ui/core/Grid';
// Redux
import { connect } from 'react-redux';
import { getUserData } from "../redux/actions/dataActions";
import axios from "axios";
import Announcement from "../components/announcement/Announcement";
import AnnouncementSkeleton from "../util/AnnouncementSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
import Profile from "../components/profile/Profile";

class user extends Component {
    state = {
        profile: {},
        announcementIdParam: null
    };

    componentDidMount() {
        const handle = this.props.match.params.handle;
        const announcementId = this.props.match.params.announcementId;

        if (announcementId) {
            this.setState({ announcementIdParam: announcementId})
        }
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        const { announcements, loading } = this.props.data;
        const { announcementIdParam } = this.state;

        const announcementsMarkup = loading ? (
            <AnnouncementSkeleton />
            ) : announcements === null ? (
                <p>No announcements from this user</p>
            ) : !announcementIdParam ? (
                announcements.map(ann => <Announcement key={ann.announcementId} announcement={ann} />)
            ) : (
                announcements.map(ann => {
                    if (ann.announcementId !== announcementIdParam) {
                        return <Announcement key={ann.announcementId} announcement={ann} />;
                    } else {
                        return <Announcement key={ann.announcementId} announcement={ann} openDialog={true} />;
                    }

                })
            );
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {announcementsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {!this.state.profile ? (
                        <ProfileSkeleton />
                    ) : (
                        <Profile />
                    )}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    data: PropTyes.object.isRequired,
    getUserData: PropTyes.func.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data,
    UI: state.UI
});

export default connect(mapStateToProps, { getUserData })(user);