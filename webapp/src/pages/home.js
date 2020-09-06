import React, { Component } from 'react'
import Scream from '../components/announcement/Announcement';
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";
import AnnouncementSkeleton from "../util/AnnouncementSkeleton";

class home extends Component {
    componentDidMount() {
        this.props.getScreams()
    }

    render() {
        const { screams, loading } = this.props.data;

        return !loading ? (
            screams
                .filter(scream => !scream.isArchived)
                .map(scream => <Scream key={scream.screamId} scream={scream}/>)
        ) : <AnnouncementSkeleton />;
    }
}

home.propTypes = {
    getScreams: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getScreams })(home)