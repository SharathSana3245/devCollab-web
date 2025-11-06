import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Toast({
  open,
  handleClose,
  toastMessage,
  type = "success",
  duration = 3000,
  vertical = "top",
  horizontal = "center",
}) {
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {toastMessage}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
