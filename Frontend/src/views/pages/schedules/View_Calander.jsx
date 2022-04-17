import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal, TextField, Typography } from '@mui/material';
import DateDiff from '../../../utils/DateDiff';
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import { validator_isEmpty } from '../../../utils/validator';
import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from '../../../config/Axios';

function Modal_Delete(props) {
  let { event } = props;
  const [{ token }, dispatch] = useStateValue();

  const handleDelete = async () => {
    try {

      props.setLoading(true);
      let request = {
        id: event?._def?.publicId
      }
      let req = await AxiosDelete("/schedule", token, request);
      props.ShowSnakBar("success", "Event deleted successfully");
      window.location.reload();

    } catch (err) {
      if (err.response.data.error) {
        props.ShowSnakBar("error", err.response.data.error);
      } else {
        props.ShowSnakBar("error", "Unexpected error occurred.")
      }
    } finally {
      props.setLoading(false);
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => { props.close(false) }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete this event?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting a event will result in permanent loss of data about the event and may effect members, this action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{ color: 'text.secondary' }} onClick={() => { props.close(false) }}>Cancel</Button>
        <Button sx={{ color: 'error.main' }} onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Modal_Edit(props) {
  const [{ token }, dispatch] = useStateValue();
  const [data_start, setData_start] = useState(new Date(props.event?._instance?.range?.start));
  const [data_end, setData_end] = useState(new Date(props.event?._instance?.range?.end));

  const [input_title, setInput_title] = useState(props.event?._def?.title);
  const [input_capacity, setInput_capacity] = useState(props.event?._def?.extendedProps?.capacity);

  const handleSubmit = async () => {
    try {
      if (validator_isEmpty(input_title)) {
        props.ShowSnakBar("warning", "Please enter a valid title for the event.");
      } else if (!Number.isInteger(parseInt(input_capacity))) {
        props.ShowSnakBar("warning", "Please enter a valid capacity for the event.");
      } else {

        props.setLoading(true);

        let request = {
          id: props.event?._def?.publicId,
          allDay: props.event?._def?.allDay,
          start: props.event?._instance?.range?.start,
          title: input_title,
          capacity: input_capacity
        }

        let req = await AxiosPatch("/schedule", token, request);
        props.ShowSnakBar("success", "Event details updated successfully");
        window.location.reload();

      }
    } catch (err) {
      if (err.response.data.error) {
        props.ShowSnakBar("error", err.response.data.error);
      } else {
        props.ShowSnakBar("error", "Unexpected error occurred.")
      }
    } finally {
      props.setLoading(false);
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={() => { props.close(false) }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
    >
      <Box sx={{ maxWidth: "lg", m: "0 auto", mx: { xs: 3, sm: "0 auto" }, background: "white", p: 5, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
          Edit Schedule
        </Typography>
        <Grid container spacing={{ xs: 0, md: 2 }} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" component="span">Start</Typography>
              <Typography variant="body1" component="h6">3/3/2022, 11:27:30 PM</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" component="span">End</Typography>
              <Typography variant="body1" component="h6">3/4/2022, 11:27:30 PM</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={{ xs: 0, md: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ my: 1 }}>
              <TextField value={input_title} onChange={(e) => { setInput_title(e.target.value) }} fullWidth label="Event Title" aria-label="Event Name" variant="outlined" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ my: 1 }}>
              <TextField value={input_capacity} onChange={(e) => { setInput_capacity(e.target.value) }} fullWidth label="Assessment Capacity" aria-label="Assessment Capacity" variant="outlined" />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button sx={{ color: 'text.secondary' }} onClick={() => { props.close(false) }}>Close</Button>
          <Button sx={{ color: 'primary.main' }} onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Modal>
  )
}

function Modal_Event(props) {
  const [action_delete, setAction_delete] = useState(false);
  const [action_edit, setAction_edit] = useState(false);

  const [data_title, setData_title] = useState("");
  const [data_start, setData_start] = useState(new Date());
  const [data_end, setData_end] = useState(new Date());
  const [data_allDay, setData_allDay] = useState(false);
  const [data_range, setData_range] = useState(false);

  useEffect(() => {
    if (props.event_modal?.[0]) {

      var data_event = props.event_modal[1].event;

      setData_title(data_event._def.title);

      let startDateTime = new Date(data_event._instance.range.start);
      setData_start(startDateTime);
      let endDateTime = new Date(data_event._instance.range.end);
      setData_end(endDateTime);

      if (DateDiff(startDateTime, endDateTime) > 1) {
        setData_range(true);
      } else {
        setData_range(false);
      }

      setData_allDay(data_event._def.allDay);

    }
  }, [props])

  return (
    <Modal
      open={props.event_modal?.[0]}
      onClose={() => { props.close(false) }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
    >
      <Box sx={{ width: "100%", maxWidth: "sm", mx: { xs: 3, sm: "0 auto" }, background: "white", p: 5, borderRadius: 3 }}>
        <Box sx={{ px: 2 }}>
          <Typography variant="h5" component="h5" sx={{ fontWeight: "bold" }}>{data_title}</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" component="h6" sx={{ fontWeight: "bold" }}>{data_range ? ("From: ") : ("Date: ")}{data_start.toLocaleDateString()}</Typography>
            {data_range && (
              <Typography variant="subtitle1" component="h6" sx={{ fontWeight: "bold" }}>To: {data_end.toLocaleDateString()}</Typography>
            )}

          </Box>
          {(!data_range && !data_allDay) ? (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" component="h6">From: {data_start.toLocaleTimeString()}</Typography>
              <Typography variant="subtitle2" component="h6" >To: {data_end.toLocaleTimeString()}</Typography>
            </Box>
          ) : (<React.Fragment />)}
        </Box>
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button sx={{ color: 'text.secondary' }} onClick={() => { props.close(false) }}>Close</Button>
          <Button onClick={() => { setAction_edit(true) }}>Edit</Button>
          <Button sx={{ color: 'error.main' }} onClick={() => { setAction_delete(true) }}>Delete</Button>
        </Box>
        {action_delete && (
          <Modal_Delete event={props.event_modal[1].event} open={action_delete} close={setAction_delete} setLoading={props.setLoading} ShowSnakBar={props.ShowSnakBar} />
        )}
        {action_edit && (
          <Modal_Edit event={props.event_modal[1].event} open={action_edit} close={setAction_edit} setLoading={props.setLoading} ShowSnakBar={props.ShowSnakBar} />
        )}
      </Box>
    </Modal>
  )
}

function Modal_Event_Add(props) {
  const [{ token }, dispatch] = useStateValue();
  const [data_allDay, setData_allDay] = useState(false);
  const [data_start, setData_start] = useState(new Date());
  const [data_end, setData_end] = useState(new Date());

  const [input_title, setInput_title] = useState("");
  const [input_capacity, setInput_capacity] = useState("");

  useEffect(() => {
    if (props.event?.[0]) {
      var data_event = props.event[1];

      let startDateTime = new Date(data_event.date);
      if (startDateTime.getTime() < Date.now()) {
        props.ShowSnakBar("warning", "You cannot add events to the past.");
        props.close(false);
        return;
      }
      setData_start(startDateTime);

      setData_allDay(data_event.allDay);
      let endDate = new Date(startDateTime.getTime() + 3600000);
      setData_end(endDate);
    }
  }, [props])

  const handleSubmit = async () => {
    try {
      if (validator_isEmpty(input_title)) {
        props.ShowSnakBar("warning", "Please enter a valid title for the event.");
      } else if (!Number.isInteger(parseInt(input_capacity))) {
        props.ShowSnakBar("warning", "Please enter a valid capacity for the event.");
      } else {

        props.setLoading(true);

        let request = {
          allDay: data_allDay,
          start: props.event[1].date,
          title: input_title,
          capacity: input_capacity
        }

        let req = await AxiosPost("/schedule", token, request);
        props.ShowSnakBar("success", "New event created successfully");
        window.location.reload();

      }
    } catch (err) {
      if (err.response.data.error) {
        props.ShowSnakBar("error", err.response.data.error);
      } else {
        props.ShowSnakBar("error", "Unexpected error occurred.")
      }
    } finally {
      props.setLoading(false);
    }
  }

  return (
    <Modal
      open={props.event?.[0]}
      onClose={() => { props.close(false) }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
    >
      <Box sx={{ width: "100%", maxWidth: "sm", mx: { xs: 3, sm: "0 auto" }, background: "white", p: 5, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
          Add Schedule
        </Typography>
        <Box sx={{ px: 2 }}>
          <Typography variant="subtitle1" component="h6" sx={{ fontWeight: "bold" }}>Date: {data_start.toLocaleDateString()}</Typography>
          {data_allDay ? (
            <Typography variant="subtitle2" component="h6">All Day</Typography>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" component="h6">From: {data_start.toLocaleTimeString()}</Typography>
              <Typography variant="subtitle2" component="h6" >To: {data_end.toLocaleTimeString()}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 2, mx: 2 }}>
          <Grid container spacing={{ xs: 0, md: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ my: 1 }}>
                <TextField value={input_title} onChange={(e) => { setInput_title(e.target.value) }} fullWidth label="Event Title" aria-label="Event Name" variant="outlined" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ my: 1 }}>
                <TextField type="number" value={input_capacity} onChange={(e) => { setInput_capacity(e.target.value) }} fullWidth label="Assessment Capacity" aria-label="Assessment Capacity" variant="outlined" />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button sx={{ color: 'text.secondary' }} onClick={() => { props.close(false) }}>Close</Button>
          <Button sx={{ color: 'primary.main' }} onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Modal>
  )
}

function View_Calander() {
  const [{ token }, dispatch] = useStateValue();
  const [data_loaded, setData_loaded] = useState(false)
  function setLoading(state) {
    dispatch({
      type: actionTypes.SET_LOADING,
      loading: state
    });
  }
  function ShowSnakBar(severity, msg) {
    dispatch({
      type: actionTypes.SET_SNACKBAR,
      snackbar: true,
      severity: severity,
      msg: msg
    });
  }

  const [data_events, setData_events] = useState([]);
  const [event_modal, setEvent_modal] = useState([false, ""]);
  const [event_modal_add, setEvent_modal_add] = useState([false, ""]);

  useEffect(() => {
    async function fetchData() {
      try {
        let req = await AxiosGet("/schedule", token);
        let result = req.data.result.map((item) => {
          let response = {
            id: item._id,
            title: item.title,
            start: item.start,
            capacity: item.capacity,
            allDay: item.allDay
          }
          if(!item.allDay){
            response = {
              ...response,
              end: item.end,
            }
          }
          return response;
        })
        setData_events(result);
        setData_loaded(true);
      } catch (err) {
        ShowSnakBar("error", "Unexpected error occurred")
      } finally {
        setLoading(false);
      }
    }
    if (!data_loaded) {
      fetchData()
    }
  }, [])

  const handleEventEdit = (e) => {
    console.log(e);
  }

  function renderEventContent(eventInfo) {
    return (
      <Box onClick={() => { setEvent_modal([true, eventInfo]) }}>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </Box>
    )
  }

  return (
    <Box component="div">
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
        Schedules - Calendar View
      </Typography>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        weekends={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={data_events}
        eventContent={renderEventContent}
        dateClick={(e) => setEvent_modal_add([true, e])}
        eventChange={handleEventEdit}
      />
      {event_modal[0] && (
        <Modal_Event setLoading={setLoading} ShowSnakBar={ShowSnakBar} event_modal={event_modal} close={() => { setEvent_modal([false, ""]) }} />
      )}
      {event_modal_add && (
        <Modal_Event_Add setLoading={setLoading} ShowSnakBar={ShowSnakBar} event={event_modal_add} close={() => { setEvent_modal_add([false, ""]) }} />
      )}
    </Box>
  )
}

export default View_Calander