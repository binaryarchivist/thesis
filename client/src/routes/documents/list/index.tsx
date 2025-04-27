import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Button,
  useTheme,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion } from 'framer-motion';
import DocumentsApi, { Document } from 'api/DocumentsApi';

const MotionTableRow = motion(TableRow);

export default function DocumentsListPage() {
  const theme = useTheme();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'signed':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" color="text.primary">
          Documents
        </Typography>
        <Button
          component={RouterLink}
          to="/documents/new"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
        >
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
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                {[
                  'Title',
                  'Description',
                  'Created By',
                  'Assignee',
                  'Created At',
                  'Updated At',
                  'Status',
                  '',
                ].map((h) => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {docs.map((doc, idx) => (
                <MotionTableRow
                  key={doc.document_id}
                  transition={{ duration: 0.2 }}
                  sx={{
                    bgcolor:
                      idx % 2 === 0 ? 'background.default' : 'background.paper',
                  }}
                >
                  <TableCell>
                    <Typography
                      component={RouterLink}
                      to={`/documents/${doc.document_id}`}
                      sx={{
                        textDecoration: 'none',
                        color: theme.palette.primary.dark,
                        fontWeight: 500,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {doc.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{doc.description || '—'}</TableCell>
                  <TableCell>{doc.created_by}</TableCell>
                  <TableCell>{doc.assigned_to || '—'}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(doc.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status}
                      color={getStatusColor(doc.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details">
                      <IconButton
                        component={RouterLink}
                        to={`/documents/${doc.document_id}`}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </MotionTableRow>
              ))}

              {docs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
