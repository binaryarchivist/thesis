import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Snackbar,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import DocumentsApi from 'api/DocumentsApi';
import UsersApi from 'api/UseresApi';

interface UserLookup {
  user_id: string;
  email: string;
}

export default function DocumentCreatePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userList, setUserList] = useState<UserLookup[]>([]);
  const [selectedUserID, setSelectedUserID] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (!file) {
      return setPreviewUrl(null);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    UsersApi.getUsers()
      .then((r) => setUserList(r.data))
      .catch(() =>
        setSnackbar({
          open: true,
          message: 'Failed to load users',
          severity: 'error',
        })
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file || !selectedUserID) {
      return setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error',
      });
    }

    setSubmitting(true);
    try {
      await DocumentsApi.create(
        title.trim(),
        file,
        selectedUserID,
        description.trim()
      );
      setSnackbar({
        open: true,
        message: 'Document created!',
        severity: 'success',
      });
      setTimeout(() => navigate('/', { replace: true }), 1000);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Submission failed',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="div"
      maxWidth="lg"
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        p: 4,
        boxSizing: 'border-box',
        overflow: 'auto',
        justifySelf: 'center',
      }}
    >
      <Backdrop
        open={submitting}
        sx={{ zIndex: theme.zIndex.drawer + 1, color: '#fff' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        New Document
      </Typography>

      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          height: '80%',
        }}
      >
        <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
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
              fullWidth
              multiline
              rows={3}
            />
            <Button variant="outlined" component="label">
              {file ? file.name : 'Select File'}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) setFile(e.target.files[0]);
                }}
              />
            </Button>
            <FormControl fullWidth required>
              <InputLabel id="assignee-label">Assignee</InputLabel>
              <Select
                labelId="assignee-label"
                value={selectedUserID}
                label="Assignee"
                onChange={(e: SelectChangeEvent) =>
                  setSelectedUserID(e.target.value)
                }
              >
                {userList.map((u) => (
                  <MenuItem key={u.user_id} value={u.user_id}>
                    {u.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Create
              </Button>
            </Box>
          </Box>
        </Paper>

        {previewUrl && (
          <Paper
            component={motion.div}
            elevation={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            sx={{
              flex: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {file!.type.startsWith('image/') ? (
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <Box
                component="iframe"
                src={previewUrl}
                title="Preview"
                sx={{ width: '100%', height: '100%', border: 'none' }}
              />
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
