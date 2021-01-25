import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { pinAnnouncement } from "../../redux/actions/dataActions";
import MyButton from "../../util/MyButton";
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

const styles = {

};

class PinAnnouncement extends Component {
    state = {
        open: false
    };

    togglePinToTop = () => {
        const { announcementId, pinToTop } = this.props;
        this.props.pinAnnouncement(announcementId, !pinToTop);
    };

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton tip="Pin Announcement to Top"
                          onClick={this.togglePinToTop}
                          btnClassName={classes.pinToTop}
                >

                        <VerticalAlignTopIcon color={this.props.pinToTop ? "secondary" : "primary"}/>
                </MyButton>
            </Fragment>
        )
    }
}

PinAnnouncement.propTypes = {
    pinAnnouncement: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    announcementId: PropTypes.string.isRequired
};

export default connect(null, { pinAnnouncement })(withStyles(styles)(PinAnnouncement));