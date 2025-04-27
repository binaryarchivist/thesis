// src/pages/documents/DocumentCreatePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import DocumentsApi from 'api/DocumentsApi';
import UsersApi from 'api/UseresApi';

interface UserLookup {
  user_id: string;
  email: string;
}

export default function DocumentCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userList, setUserList] = useState<UserLookup[]>([]);
  const [selectedUserID, setSelectedUserID] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file || !selectedUserID) {
      setError('Title, file and assignee are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await DocumentsApi.create(
        title.trim(),
        file,
        selectedUserID,
        description.trim()
      );
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create document.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const response = await UsersApi.getUsers();
      setUserList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          New Document
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Button variant="outlined" component="label">
            {file ? file.name : 'Select File'}
            <input
              type="file"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </Button>

          <Select
            label="Assignee"
            value={selectedUserID || ''}
            fullWidth
            onChange={(event: SelectChangeEvent) => {
              setSelectedUserID(event.target.value);
            }}
            required
          >
            {userList.map((user) => (
              <MenuItem key={user.user_id} value={user.user_id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>

          <Box sx={{ position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              Create
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
