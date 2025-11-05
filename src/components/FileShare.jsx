import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';

const VisuallyHiddenInput = styled('input')({
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FileShare() {
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
  };

  const handleSend = () => {
    console.log('Files sent:', selectedFiles);
    // 🔹 Here you can trigger upload to Firebase or your CDN
    handleClose();
  };

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: '0px',
          minHeight: '0',
          minWidth: '0',
        }}
        tabIndex={-1}
        startIcon={<AttachFileIcon style={{ color: 'black' }} />}
      >
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
          multiple
        />
      </Button>

      {/* 📁 Preview Popup */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Preview & Send</DialogTitle>
        <DialogContent dividers>
          {selectedFiles.map((file, index) => (
            <Box key={index} mb={2} textAlign="center" className="flex flex-col items-center">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    marginBottom: '8px',
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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} style={{textTransform:'lowercase'}}>Cancel</Button>
          <SendIcon style={{ marginLeft: '8px' }} onClick={handleSend} className='cursor-pointer'/>
        </DialogActions>
      </Dialog>
    </>
  );
}
