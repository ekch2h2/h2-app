import React, { Component } from 'react'
import Announcement from '../components/announcement/Announcement';
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";
import AnnouncementSkeleton from "../util/AnnouncementSkeleton";
const queryString = require('query-string');

class home extends Component {
    state = {
        announcementId: null
    };

    componentDidMount() {
        this.props.getAnnouncements();
        const queryParams = queryString.parse(this.props.location.search);
        const announcementId = queryParams.announcementId;
        if (announcementId) {
            this.setState({ announcementId: announcementId})
        }
    }

    render() {
        const { announcementId } = this.state;
        const { announcements, loading } = this.props.data;
        return !loading ? (
            announcements
                .filter(ann => !ann.isArchived)
                .map(ann => announcementId && ann.announcementId === announcementId ?
                    (<Announcement key={ann.announcementId} announcement={ann} openDialog={true}/>) :
                    (<Announcement key={ann.announcementId} announcement={ann}/>)
                )
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