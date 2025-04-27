import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Link,
  Button,
} from '@mui/material';
import DocumentsApi, { Document } from 'api/DocumentsApi';

export default function DocumentsListPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await DocumentsApi.list();
      setDocs(res.data);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Documents</Typography>
        <Button component={RouterLink} to="/documents/new" variant="contained">
          New Document
        </Button>
      </Box>

      {loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={load}>
              Retry
            </Button>
          </Box>
        </Alert>
      )}

      {!loading && !error && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.document_id}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/documents/${doc.document_id}`}
                    >
                      {doc.title}
                    </Link>
                  </TableCell>
                  <TableCell>{doc.description || '—'}</TableCell>
                  <TableCell>{doc.created_by}</TableCell>
                  <TableCell>{doc.assigned_to}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/documents/${doc.document_id}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {docs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
