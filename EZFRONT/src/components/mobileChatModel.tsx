import { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chat from './chat';

// Define the prop types for the CustomModal
interface CustomModalProps {
    isOpen: boolean;
    handleClose: () => void;
}



const MobileChat: React.FC<CustomModalProps> = ({ isOpen, handleClose }) => {
    const [isChatOpen, setIsChatOpen] = useState(true);
    return (
        <Modal
            open={isOpen}
            onClose={handleClose} // Close when clicking outside
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#2C2C2E',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    width: '90%',
                    maxWidth: 600,
                    height: '75%'
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 4, right: 4, color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
                <Chat isOpen={isChatOpen} />
            </Box>
        </Modal>
    );
};

export default MobileChat;
