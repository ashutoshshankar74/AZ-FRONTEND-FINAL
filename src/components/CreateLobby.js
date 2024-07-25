import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import * as Dialog from '@radix-ui/react-dialog';
import { styled, keyframes } from '@stitches/react';
import { blackA, mauve, violet } from '@radix-ui/colors';

const CreateLobby = () => {
  const { email } = useContext(UserContext);
  const [lobbyId, setLobbyId] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      alert('User email not found. Please log in.');
    }
  }, [email, navigate]);

  const handleCreateLobby = async () => {
    try {
      const authToken = localStorage.getItem(email);

      if (!authToken) {
        alert('Authentication token not found. Please log in.');
        return;
      }

      const response = await axios.post('http://localhost:8085/lobbies/createLobby', {
        lid: lobbyId,
        lname: lobbyName,
        lowneremail: email
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 201) {
        alert('Lobby created successfully');
        navigate(`/create-mcq/${lobbyId}`, { state: { email, questionId: 1 } });
      }
    } catch (error) {
      console.error('Failed to create lobby:', error);
      alert(`Failed to create lobby: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Create Your Lobby</DialogTitle>
            <Fieldset>
              <Label htmlFor="lobbyId">Lobby ID</Label>
              <Input id="lobbyId" value={lobbyId} onChange={(e) => setLobbyId(e.target.value)} />
            </Fieldset>
            <Fieldset>
              <Label htmlFor="lobbyName">Lobby Name</Label>
              <Input id="lobbyName" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} />
            </Fieldset>
            <Fieldset>
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input id="ownerEmail" value={email} readOnly />
            </Fieldset>
            <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <Button variant="green" onClick={handleCreateLobby}>
                  Create Lobby
                </Button>
              </Dialog.Close>
            </Flex>
            <Dialog.Close asChild>
              <IconButton aria-label="Close">
                ×
              </IconButton>
            </Dialog.Close>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
  );
};

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: 'fixed',
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(Dialog.Content, {
  backgroundColor: 'black',
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95vw',
  maxWidth: '600px',
  maxHeight: '90vh',
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&:focus': { outline: 'none' },
});

const DialogTitle = styled(Dialog.Title, {
  margin: 0,
  fontWeight: 1000,
  color: violet.violet11,
  fontSize: 30,
});

const DialogDescription = styled(Dialog.Description, {
  margin: '10px 0 20px',
  color: violet.violet11,
  fontSize: 15,
  lineHeight: 1.5,
});

const Flex = styled('div', { display: 'flex' });

const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,
  cursor: 'pointer',

  variants: {
    variant: {
      violet: {
        backgroundColor: 'white',
        color: violet.violet11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        '&:hover': { backgroundColor: mauve.mauve3 },
        '&:focus': { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: '#4CAF50',
        color: 'white',
        '&:hover': { backgroundColor: '#45a049' },
        '&:focus': { boxShadow: `0 0 0 2px #2E7D32` },
      },
    },
  },

  defaultVariants: {
    variant: 'violet',
  },
});

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 25,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: violet.violet11,
  position: 'absolute',
  top: 10,
  right: 10,
  cursor: 'pointer',

  '&:hover': { backgroundColor: violet.violet4 },
  '&:focus': { boxShadow: `0 0 0 2px ${violet.violet7}` },
});

const Fieldset = styled('fieldset', {
  all: 'unset',
  display: 'flex',
  gap: 20,
  alignItems: 'center',
  marginBottom: 15,
});

const Label = styled('label', {
  fontSize: 15,
  color: violet.violet11,
  width: 90,
  textAlign: 'right',
});

const Input = styled('input', {
  all: 'unset',
  width: '100%',
  flex: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 10px',
  fontSize: 15,
  lineHeight: 1,
  color: violet.violet11,
  boxShadow: `0 0 0 1px ${violet.violet7}`,
  height: 35,

  '&:focus': { boxShadow: `0 0 0 2px ${violet.violet8}` },
});

export default CreateLobby;
