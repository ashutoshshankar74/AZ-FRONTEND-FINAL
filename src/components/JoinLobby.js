import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import { styled } from '@stitches/react';
import { blackA, mauve, violet } from '@radix-ui/colors';

const JoinLobby = () => {
  const { email } = useContext(UserContext);
  const [error, setError] = useState('');
  const [lid, setLid] = useState('');
  const navigate = useNavigate();
  const { lobbyId } = useParams();

  useEffect(() => {
    if (lobbyId) {
      setLid(lobbyId);
    }
  }, [lobbyId]);

  const handleLidChange = (event) => setLid(event.target.value);

  const handleJoinLobby = async (event) => {
    event.preventDefault();
    if (!lid || !email) {
      setError('Please provide all required fields.');
      return;
    }
    try {
      const response = await axios.post(
          'https://azhackathon-backend-1.onrender.com/lobbies/requestJoinLobby',
          { lid, participant: email },
          { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        alert(`You have joined lobby ${lid} with ${email}`);
        navigate(`/startGame/${lid}`);
      } else {
        setError(response.data.message || 'Failed to send join request');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send join request');
    }
  };

  return (
      <Container>
        <Content>
          <Title>Join Lobby</Title>
          {error && <ErrorText>{error}</ErrorText>}
          <form onSubmit={handleJoinLobby}>
            <Fieldset>
              <Label htmlFor="lobbyId">Lobby ID</Label>
              <Input
                  id="lobbyId"
                  placeholder="Enter lobby ID"
                  value={lid}
                  onChange={handleLidChange}
                  required
              />
            </Fieldset>
            <Fieldset>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} readOnly />
            </Fieldset>
            <Button type="submit" variant="primary">
              Join Lobby
            </Button>
          </form>
        </Content>
      </Container>
  );
};

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: blackA.blackA9,
});

const Content = styled('div', {
  width: '100%',
  maxWidth: '500px',
  backgroundColor: 'black',
  borderRadius: '12px',
  padding: '40px',
  boxShadow: '0 10px 38px -10px hsla(206, 22%, 7%, 0.35), 0 10px 20px -15px hsla(206, 22%, 7%, 0.2)',
  textAlign: 'center',
});

const Title = styled('h1', {
  margin: '0 0 20px 0',
  fontSize: '40px',
  fontWeight: '500',
  color: violet.violet11,
});

const ErrorText = styled('p', {
  color: 'red',
  marginBottom: '20px',
});

const Fieldset = styled('fieldset', {
  all: 'unset',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
});

const Label = styled('label', {
  marginBottom: '8px',
  fontSize: '16px',
  fontWeight: '400',
  color: mauve.mauve11,
});

const Input = styled('input', {
  all: 'unset',
  padding: '10px',
  borderRadius: '6px',
  backgroundColor: mauve.mauve1,
  color: violet.violet11,
  fontSize: '16px',
  border: `1px solid ${violet.violet7}`,
  '&:focus': { boxShadow: `0 0 0 2px ${violet.violet8}` },
});

const Button = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: '500',
  borderRadius: '6px',
  backgroundColor: violet.violet9,
  color: 'white',
  transition: 'background-color 0.3s ease',
  '&:hover': { backgroundColor: violet.violet11 },
});

export default JoinLobby;
