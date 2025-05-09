import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronDown,
  CheckCircle,
  PenTool,
  Archive as ArchiveIcon,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DocumentDetails from '../../../components/documents/DocumentDetails';
import { getAccessToken, useAuthContext } from '@/contexts/AuthContext';
import DocumentsApi from '@/api/DocumentsApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Version {
  version_number: number;
  filename: string;
  download_url: string;
  created_by: string;
  created_at: string;
}

interface DocumentResponse {
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  status: string;
  tags: string[];
  priority: string;
  reviewer: string;
  assignee: string;
  assignee_id: string;
  reviewer_id: string;
  document_type: string;
  versions: Version[];
  allowed_actions: string[];
}

export default function DocumentDetail() {
  const { userData } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [document, setDocument] = useState<DocumentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
      setLoading(true);
      try {
        if (id) {
          const { data } = await DocumentsApi.get(id);
          setDocument(data);
          // initialize version selection
          if (data.versions.length) {
            setSelectedVersion(data.versions[data.versions.length - 1]);
            // setPreviewUrl(data.versions[0].download_url);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }, [id])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // clean up any old blob‐URLs
    let active = true;
    let blobUrl: string | null = null;

    async function loadPreview() {
    //   if (newFile) {
    //     // local file → immediate preview
    //     blobUrl = URL.createObjectURL(newFile);
    //     setPreviewUrl(blobUrl);
    //     return;
    //   }

      if (!selectedVersion) {
        setPreviewUrl(null);
        return;
      }

      try {
        const res = await fetch(selectedVersion.download_url, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        if (!res.ok) {
            throw new Error('Fetch failed');
        }
        const blob = await res.blob();
        if (!active) {
            return;
        }
        blobUrl = URL.createObjectURL(blob);
        setPreviewUrl(blobUrl);
      } catch {
        console.error('Error loading preview:', error);
      }
    }

    loadPreview();

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [selectedVersion]);

  const handleArchiveDocument = async () => {
    if (!document) {
        return;
    }
    setProcessing(true);
    try {
      await DocumentsApi.archive(document.document_id);
      // refresh
      const { data } = await DocumentsApi.get(document.document_id);
      setDocument(data);
    } catch (error) {
      console.error('Error archiving document:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileUploading(true);
    try {
      //   const { file_url } = await UploadFile({ file });  // TODO UPLOAD FILE API
      const previewUrl = URL.createObjectURL(file); // Mock upload TODO
      setPreviewUrl(previewUrl);
      const form = new FormData()
      form.append('file', file)
      await DocumentsApi.save(document?.document_id, {
        ...document,
        file: file
      })
      fetchData();
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setFileUploading(false);
    }
  };

  const handleBackToDashboard = () => navigate('/');
  const handleGoToReview   = () => navigate('/pending');
  const handleGoToSign     = () => navigate('/approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Not Found</h1>
          <p className="text-muted-foreground mt-1">
            The document you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
        <Button onClick={handleBackToDashboard} className="gap-1">
          <ChevronDown className="h-4 w-4 rotate-90" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Details</h1>
        <p className="text-muted-foreground mt-1">View details for this document</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleBackToDashboard} className="gap-1">
              <ChevronDown className="h-4 w-4 rotate-90" /> Back to Dashboard
            </Button>

            <div className="flex gap-2">
              {document.status === 'pending' && document.reviewer_id === userData?.user_id && (
                <Button onClick={handleGoToReview} className="bg-amber-600 hover:bg-amber-700 gap-1">
                  <CheckCircle className="h-4 w-4" /> Review
                </Button>
              )}
              {document.status === 'approved' && document.assignee_id === userData?.user_id && (
                <Button onClick={handleGoToSign} className="bg-blue-600 hover:bg-blue-700 gap-1">
                  <PenTool className="h-4 w-4" /> Sign
                </Button>
              )}
              {document.status === 'signed' && (
                <Button
                  variant="outline"
                  onClick={handleArchiveDocument}
                  disabled={processing}
                  className="gap-1"
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArchiveIcon className="h-4 w-4" />}
                  Archive
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <DocumentDetails document={document} />
        </CardContent>
      </Card>

      {/* Versions & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Versions List */}
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Versions</div>
          </CardHeader>
          <Separator />
          {
            document.status === 'rejected' && document.assignee_id === userData?.user_id && (
              <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label>Upload another version</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={fileUploading}
                    className="flex-1"
                  />
                  {fileUploading && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>

              <Separator className="my-4" />

            </CardContent>
            )
          }
            <CardContent>
            {document.versions.map((v) => (
              <Button
                key={v.version_number}
                variant={v.version_number === selectedVersion?.version_number && 'outline'}
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedVersion(v);
                //   setPreviewUrl(v.download_url);
                }}
              >
                Version {v.version_number}
              </Button>
            ))}
            </CardContent>
        </Card>

        {/* Preview Pane */}
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Preview</div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0 h-screen">
            {previewUrl ? (
              <object
              data={previewUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="p-4 text-center">
                Unable to display PDF.{" "}
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 underline"
                >
                  Download PDF
                </a>
              </div>
            </object>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Select a version to preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
