import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckIcon from '@mui/icons-material/Check';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  borderRadius: '10px',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: 'linear-gradient(62deg, #32BB71, #2A9D8F)',
  color: 'white',
  boxShadow: 24,
  p: 4,
};

export default function ModalThanks({ showModalThanks, contextb1, contextb2, contextb21, contextb3="" }) {
  const [open, setOpen] = React.useState(showModalThanks);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className="flex items-center">
            <b> {contextb1}</b>

            <CheckIcon className="ms-2" />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>{contextb2}</b>{contextb21}
            <br /><br />{contextb3}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
