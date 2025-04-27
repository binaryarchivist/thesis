// src/pages/documents/DocumentDetailsPage.tsx

import React, { useState, useEffect } from 'react';
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
  ListItemText,
  Divider,
} from '@mui/material';
import DocumentsApi from 'api/DocumentsApi';

interface DocumentDetail {
  document_id: string;
  title: string;
  description: string;
  created_at: string;
  created_by: string;
  assigned_to: string | null;
  status: string;
  allowed_actions: string[];
}

interface Version {
  id: number;
  version_number: number;
  download_url: string;
  file_name: string;
  created_at: string;
  created_by: string;
}

const DocumentActions = {
  approve: 'approve',
  reject: 'reject',
  archive: 'archive',
  esign: 'esign',
  resubmit: 'resubmit',
};

export default function DocumentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadDocument = async () => {
    setLoading(true);
    try {
      if (!id) {
        setError('Document ID is required');
        return;
      }
      const { data } = (await DocumentsApi.get(id)) as any;
      setDoc(data);
      setVersions(data.versions);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocument();
  }, []);

  const handleAction = async (
    action: 'approve' | 'reject' | 'archive' | 'esign'
  ) => {
    if (!id) {
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      switch (action) {
        case 'approve':
          await DocumentsApi.approve(id);
          break;
        case 'reject':
          await DocumentsApi.reject(id);
          break;
        case 'archive':
          await DocumentsApi.archive(id);
          break;
        case 'esign':
          await DocumentsApi.sign(id);
          break;
      }
      const { data } = (await DocumentsApi.get(id)) as any;
      setDoc(data);
    } catch (e: any) {
      setActionError(e.response?.data?.detail || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!id || !newFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      await DocumentsApi.save(id, { ...doc, file: newFile });
      await loadDocument();
      setNewFile(null);
    } catch (e: any) {
      setUploadError(e.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !doc || !id) {
    return <Alert severity="error">{error || 'Document not found'}</Alert>;
  }

  const ApproveAction = () => (
    <Button
      variant="contained"
      color="success"
      onClick={() => handleAction('approve')}
      disabled={actionLoading}
    >
      Approve
    </Button>
  );

  const RejectAction = () => (
    <Button
      variant="contained"
      color="error"
      onClick={() => handleAction('reject')}
      disabled={actionLoading}
    >
      Reject
    </Button>
  );

  const ArchiveAction = () => (
    <Button
      variant="outlined"
      onClick={() => handleAction('archive')}
      disabled={actionLoading}
    >
      Archive
    </Button>
  );

  const ESignAction = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleAction('esign')}
      disabled={actionLoading}
    >
      E-Sign
    </Button>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        &larr; Back
      </Button>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {doc.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {doc.description || '—'}
        </Typography>
        <Typography variant="caption" display="block">
          Created at: {new Date(doc.created_at).toLocaleString()}
        </Typography>
        <Typography variant="caption" display="block">
          Created by: {doc.created_by}
        </Typography>
        <Typography variant="caption" display="block">
          Assigned to: {doc.assigned_to || '—'}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mb: 2 }}>
          Status: {doc.status}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {doc.allowed_actions.includes(DocumentActions.approve) && (
            <ApproveAction />
          )}
          {doc.allowed_actions.includes(DocumentActions.reject) && (
            <RejectAction />
          )}
          {doc.allowed_actions.includes(DocumentActions.archive) && (
            <ArchiveAction />
          )}
          {doc.allowed_actions.includes(DocumentActions.esign) && (
            <ESignAction />
          )}
          {actionError && (
            <Alert severity="error" sx={{ width: '100%', mt: 1 }}>
              {actionError}
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Version history */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Version History
        </Typography>
        <List>
          {versions.map((v) => (
            <React.Fragment key={v.id}>
              <ListItem>
                <ListItemText
                  primary={`v${v.version_number} — ${new Date(v.created_at).toLocaleString()}`}
                  secondary={`Uploaded by ${v.created_by}`}
                />
                <Button
                  size="small"
                  component="a"
                  href={v.download_url}
                  target="_blank"
                  rel="noopener"
                >
                  View
                </Button>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {versions.length === 0 && (
            <Typography>No versions uploaded yet.</Typography>
          )}
        </List>
      </Paper>

      {doc.allowed_actions.includes(DocumentActions.resubmit) && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Upload New Version
          </Typography>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button variant="outlined" component="label">
              {newFile ? newFile.name : 'Select File'}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setNewFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!newFile || uploading}
            >
              Update
            </Button>
            {uploading && <CircularProgress size={24} />}
          </Box>
        </Paper>
      )}
    </Container>
  );
}
