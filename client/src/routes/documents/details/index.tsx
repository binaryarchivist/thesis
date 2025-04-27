import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Backdrop,
  Snackbar,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import DocumentsApi from 'api/DocumentsApi';
import UsersApi from 'api/UseresApi';

interface Version {
  id: number;
  version_number: number;
  download_url: string;
  file_name: string;
  created_at: string;
  created_by: string;
}

interface DocumentDetail {
  document_id: string;
  title: string;
  description: string;
  created_at: string;
  created_by: string;
  assigned_to: string | null;
  status: string;
  allowed_actions: string[];
  versions: Version[];
}

export default function DocumentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVer, setSelectedVer] = useState<Version | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  const [users, setUsers] = useState<{ user_id: string; email: string }[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>('');

  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    sev: 'success' | 'error';
  }>({
    open: false,
    msg: '',
    sev: 'success',
  });

  const loadDocument = useCallback(async (docId: string) => {
    setLoading(true);
    try {
      const { data } = await DocumentsApi.get(docId);
      setDoc(data as any);
      setSelectedVer(data.versions[0] || null);
      setAssignedTo(data.assigned_to || '');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    loadDocument(id);
  }, [id, loadDocument]);

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await UsersApi.getUsers();
      setUsers(data);
    } catch {
      console.error('Failed to load users');
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /** Generic action (approve/reject/esign/archive) */
  const handleAction = useCallback(
    async (action: 'approve' | 'reject' | 'esign' | 'archive') => {
      if (!id) return;
      setBusy(true);
      try {
        await DocumentsApi[action](id);
        await loadDocument(id);
        setSnack({ open: true, msg: `${action} succeeded`, sev: 'success' });
      } catch {
        setSnack({ open: true, msg: `${action} failed`, sev: 'error' });
      } finally {
        setBusy(false);
      }
    },
    [id, loadDocument]
  );

  /** Handle version selection */
  function handleSelectVersion(version: Version) {
    setSelectedVer(version);
    setNewFile(null);
  }

  /** Handle file‐input change */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setNewFile(file);
  }

  /** Upload a new version */
  async function handleUpload() {
    if (!id || !newFile) {
      return;
    }
    setBusy(true);
    try {
      await DocumentsApi.save(id, {
        ...doc,
        file: newFile,
      });
      await loadDocument(id);
      setNewFile(null);
      setSnack({ open: true, msg: 'Version uploaded', sev: 'success' });
    } catch (e: any) {
      setSnack({
        open: true,
        msg: e.response?.data?.error || 'Upload failed',
        sev: 'error',
      });
    } finally {
      setBusy(false);
    }
  }

  function handleAssign(e: SelectChangeEvent) {
    setAssignedTo(e.target.value);
    setSnack({ open: true, msg: 'Assignee updated (mock)', sev: 'success' });
  }

  function handleBack() {
    navigate(-1);
  }

  function handleCloseSnack() {
    setSnack((s) => ({ ...s, open: false }));
  }

  const previewUrl = newFile
    ? URL.createObjectURL(newFile)
    : selectedVer?.download_url;

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !doc) {
    return <Alert severity="error">{error || 'Document not found'}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ position: 'relative', py: 4 }}>
      <Backdrop
        open={busy}
        sx={{ zIndex: theme.zIndex.drawer + 1, color: '#fff' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snack.sev} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>

      <Button onClick={handleBack} sx={{ mb: 2 }}>
        &larr; Back
      </Button>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {doc.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {doc.description || '—'}
          </Typography>

          <Typography variant="caption" display="block">
            Created at: {new Date(doc.created_at).toLocaleString()}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Created by: {doc.created_by}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assignee</InputLabel>
            <Select value={assignedTo} label="Assignee" onChange={handleAssign}>
              {users.map((u) => (
                <MenuItem key={u.user_id} value={u.user_id}>
                  {u.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Status: {doc.status}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {doc.allowed_actions.includes('approve') && (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAction('approve')}
              >
                Approve
              </Button>
            )}
            {doc.allowed_actions.includes('reject') && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAction('reject')}
              >
                Reject
              </Button>
            )}
            {doc.allowed_actions.includes('esign') && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAction('esign')}
              >
                E-Sign
              </Button>
            )}
            {doc.allowed_actions.includes('archive') && (
              <Button
                variant="outlined"
                onClick={() => handleAction('archive')}
              >
                Archive
              </Button>
            )}
            {doc.allowed_actions.includes('resubmit') && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => setNewFile(null)}
              >
                Resubmit
              </Button>
            )}
          </Box>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Version History
          </Typography>
          <List dense>
            {doc.versions.map((v) => (
              <React.Fragment key={v.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSelectVersion(v)}>
                    <ListItemText
                      primary={`v${v.version_number} • ${new Date(v.created_at).toLocaleString()}`}
                      secondary={v.file_name}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>

          {doc.allowed_actions.includes('resubmit') && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Upload New Version</Typography>
              {newFile === null && (
                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                  Select File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              )}
              {newFile && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Typography>{newFile.name}</Typography>
                  <Button variant="contained" onClick={handleUpload}>
                    Upload
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>

        <Paper
          elevation={2}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          sx={{
            flex: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
          }}
        >
          {previewUrl ? (
            /\.(png|jpe?g|gif)$/i.test(previewUrl) ? (
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
                sx={{ width: '100%', height: 500, border: 'none' }}
              />
            )
          ) : (
            <Typography>Select a version or file to preview</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
