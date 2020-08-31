import React, { Component } from 'react'
import PropTyes from 'prop-types';
import Grid from '@material-ui/core/Grid';
// Redux
import { connect } from 'react-redux';
import { getUserData } from "../redux/actions/dataActions";
import axios from "axios";
import Scream from "../components/announcement/Announcement";
import AnnouncementSkeleton from "../util/AnnouncementSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
import Profile from "../components/profile/Profile";

class user extends Component {
    state = {
        profile: {},
        screamIdParam: null
    };

    componentDidMount() {
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;

        if (screamId) {
            this.setState({ screamIdParam: screamId})
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
        const { screams, loading } = this.props.data;
        const { screamIdParam } = this.state;

        const screamsMarkup = loading ? (
            <AnnouncementSkeleton />
            ) : screams === null ? (
                <p>No screams from this user</p>
            ) : !screamIdParam ? (
                screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
            ) : (
                screams.map(scream => {
                    if (scream.screamId !== screamIdParam) {
                        return <Scream key={scream.screamId} scream={scream} />;
                    } else {
                        return <Scream key={scream.screamId} scream={scream} openDialog={true} />;
                    }

                })
            );
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
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