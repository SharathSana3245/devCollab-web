import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { IKContext } from "imagekitio-react";
import { BASE_URL } from "../../constants";

const VisuallyHiddenInput = styled("input")({
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function FileShare({ handleSendMessage }) {
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const publicKey = "public_JqteZzpf+1SXakiyb/7pqtvDxS8=";
  const urlEndpoint = "https://ik.imagekit.io/devCollabFiles";

  const authenticator = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/fileUpload/auth`, {
        withCredentials: true,
      });
      const { signature, expire, token } = response.data;
      return { signature, expire, token };
    } catch (error) {
      console.error("Auth failed:", error);
      throw new Error("ImageKit authentication failed");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setSelectedFiles(files);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
    setProgress(0);
  };

  const handleSend = async () => {
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const { signature, expire, token } = await authenticator();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", `${Date.now()}-${file.name}`);
        formData.append("folder", "/chat-images");
        formData.append("publicKey", publicKey);
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", token);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress((e.loaded / e.total) * 100);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.response);

            handleSendMessage("image", res.url);
            console.log("Uploaded:", res.url);
          } else {
            console.error("Upload failed:", xhr.responseText);
          }
        };

        xhr.onerror = (err) => console.error("XHR error:", err);
        xhr.send(formData);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      handleClose();
    }
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <>
        <Button
          component="label"
          variant="contained"
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
            padding: "0px",
            minHeight: "0",
            minWidth: "0",
          }}
          startIcon={<AttachFileIcon style={{ color: "black" }} />}
        >
          <VisuallyHiddenInput
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            multiple={false}
            onChange={handleFileChange}
          />
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>Preview & Send</DialogTitle>
          <DialogContent dividers>
            {selectedFiles.map((file, index) => (
              <Box
                key={index}
                mb={2}
                textAlign="center"
                className="flex flex-col items-center"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    📄 {file.name}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            ))}

            {uploading && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Uploading... {progress.toFixed(0)}%
                </Typography>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              variant="contained"
              disabled={uploading || !selectedFiles.length}
              startIcon={<SendIcon />}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </IKContext>
  );
}
