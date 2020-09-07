import React, { Component } from 'react'
import Announcement from '../components/announcement/Announcement';
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";
import AnnouncementSkeleton from "../util/AnnouncementSkeleton";

class home extends Component {
    componentDidMount() {
        this.props.getAnnouncements()
    }

    render() {
        const { announcements, loading } = this.props.data;

        return !loading ? (
            announcements
                .filter(ann => !ann.isArchived)
                .map(ann => <Announcement key={ann.announcementId} announcement={ann}/>)
        ) : <AnnouncementSkeleton />;
    }
}

home.propTypes = {
    getAnnouncements: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getAnnouncements })(home)