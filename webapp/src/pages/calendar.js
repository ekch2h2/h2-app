import React, { Component } from 'react'
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";

import Calendar from '../components/calendar/Calendar';

class calendar extends Component {
    render() {
        return <>
            <Calendar/>
        </>
    }
}

calendar.propTypes = {
    getAnnouncements: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getAnnouncements })(calendar)