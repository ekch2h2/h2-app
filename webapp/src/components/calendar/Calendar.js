import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
// Redux
import { connect } from "react-redux";

import { Calendar as RBCalendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {csvToArray} from "../../util/csv_utils";
import {transpose} from "../../util/array_utils";

const now = new Date()

const localizer = momentLocalizer(moment)
const styles = () => ({
    container: {
    },
    eventContent: {
        'white-space': 'pre-wrap'
    },
    eventWrapper: {
    },
    eventWrapperNoLabel: {
        '& .rbc-event-label': {
            display: "none"
        }
    }
});

const CAL_DATA_SRC_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvXCDvZBgp4hm89EvIzlKfiJpbkZDaK5dFYqVYYDJUZ4zGknXkOeUaT5xlGk5pyfL3G8Qfrp2TDZxJ/pub?output=csv'
const DATE_RE = /(\d{2})\/(\d{2})\/(\d{4})/g;
class Calendar extends Component {
    state = {
        view: Views.WEEK,
        events: []
    };

    componentDidMount() {
        fetch(CAL_DATA_SRC_CSV)
            .then((rsp) => {
                return rsp.text();
            })
            .then((text) => {
                const eventsRaw = transpose(csvToArray(text)).flat()
                const events = [];
                eventsRaw.forEach((d, i) => {
                    if (d.match(DATE_RE)) {
                        const m = DATE_RE.exec(d)
                        const eventMo = parseInt(m[1]);
                        const eventDa = parseInt(m[2]);
                        const eventYr = parseInt(m[3]);
                        let eventTitle = eventsRaw[i + 1];
                        if (!!eventTitle) {
                            let start = new Date(eventYr, eventMo - 1, eventDa);
                            let end = new Date(eventYr, eventMo - 1, eventDa);
                            if (eventTitle.includes("预查带领")) {
                                eventTitle = "预查\n" + eventTitle
                                start = new Date(eventYr, eventMo - 1, eventDa, 11, 15, 0);
                                end = new Date(eventYr, eventMo - 1, eventDa, 12, 15, 0);
                            } else if (eventTitle.includes("诗歌带领")) {
                                eventTitle = "团契查经\n" + eventTitle
                                start = new Date(eventYr, eventMo - 1, eventDa, 19, 20, 0);
                                end = new Date(eventYr, eventMo - 1, eventDa, 21, 30, 0);
                            }
                            const event = {
                                id: i,
                                title: eventTitle,
                                start: start,
                                end: end,
                            }
                            events.push(event);
                        }
                    }
                })
                this.setState({events});
            })
    }

    render() {
        const { classes } = this.props;
        const { events } = this.state;

        let allViews = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]

        const titleAccessor = (event) => {
            if (this.state.view === Views.MONTH) {
                const titleLines = event.title.split("\n")
                return (
                    <div className={classes.eventContent}>
                        {titleLines[0]}
                    </div>
                );
            }
            return (
                <div className={classes.eventContent}>
                    {event.title}
                </div>
            );
        };

        const eventWrapper = eventWrapperProps => {
            const eventTimeMin = Math.floor( (eventWrapperProps.event.end - eventWrapperProps.event.start) / (1000*60))
            console.log(eventTimeMin)
            return (
                <div className={eventTimeMin < 60 ? classes.eventWrapperNoLabel : classes.eventWrapper}>
                    {eventWrapperProps.children}
                </div>
            )
        };

        return <>

            <div className={classes.container}>
                <RBCalendar
                    events={events}
                    views={allViews}
                    defaultView={Views.WEEK}
                    step={60}
                    defaultDate={now}
                    // components={{
                    //     timeSlotWrapper: ColoredDateCellWrapper
                    // }}
                    components={{
                        eventWrapper: eventWrapper
                    }}
                    localizer={localizer}
                    style={{ height: 1000 }}
                    titleAccessor={titleAccessor}
                    onView={(view) => {
                        this.setState({view: view})
                    }}
                    min={moment('6:00am', 'h:mma').toDate()}
                />
            </div>
        </>
    }
}

Calendar.propTypes = {
    user: PropTypes.object.isRequired,
    announcement: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Calendar));