import React, { Component } from 'react'
import Scream from '../components/scream/Scream';
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";
import ScreamSkeleton from "../util/ScreamSkeleton";

class home extends Component {
    componentDidMount() {
        this.props.getScreams()
    }

    render() {
        const { screams, loading } = this.props.data;

        return !loading ? (
            screams.map(scream => <Scream key={scream.screamId} scream={scream}/>)
        ) : <ScreamSkeleton />;
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