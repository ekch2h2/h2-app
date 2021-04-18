import React, { Component } from 'react'
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";

class calendar extends Component {
    render() {
        return <>
            <h1>This is the header</h1>
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