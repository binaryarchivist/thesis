import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import DocumentDetails from '../../components/documents/DocumentDetails';

export default function DocumentDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const documentId = urlParams.get('id');

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get user data
        // const user = await User.me(); // GET USER API todo
        const user = {
          full_name: 'John Doe',
          role: 'Admin',
        };
        setUserData(user);

        // Get document by ID
        if (documentId) {
          const documents = await Document.list();
          const doc = documents.find((d) => d.id === documentId);
          if (doc) {
            setDocument(doc);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleArchiveDocument = async () => {
    setProcessing(true);
    try {
      await Document.update(document.id, {
        ...document,
        status: 'archived',
        archive_date: new Date().toISOString(),
      });

      // Refresh document
      //   const documents = await Document.list(); GET DOCUMENTS LIST API TODO
      const documents = [];
      const updatedDoc = documents.find((d) => d.id === documentId);
      if (updatedDoc) {
        setDocument(updatedDoc);
      }
    } catch (error) {
      console.error('Error archiving document:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const handleGoToReview = () => {
    navigate("/pending");
  };

  const handleGoToSign = () => {
    navigate("/approved");
  };

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
          <h1 className="text-2xl font-bold tracking-tight">
            Document Not Found
          </h1>
          <p className="text-muted-foreground mt-1">
            The document you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
        </div>

        <Button onClick={handleBackToDashboard} className="gap-1">
          <ChevronDown className="h-4 w-4 rotate-90" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Details</h1>
        <p className="text-muted-foreground mt-1">
          View details for this document
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToDashboard}
              className="gap-1"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
              Back to Dashboard
            </Button>

            <div className="flex gap-2">
              {document.status === 'pending' &&
                document.reviewer_id === userData?.id && (
                  <Button
                    onClick={handleGoToReview}
                    className="bg-amber-600 hover:bg-amber-700 gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Review
                  </Button>
                )}

              {document.status === 'approved' &&
                document.assignee_id === userData?.id && (
                  <Button
                    onClick={handleGoToSign}
                    className="bg-blue-600 hover:bg-blue-700 gap-1"
                  >
                    <PenTool className="h-4 w-4" />
                    Sign
                  </Button>
                )}

              {document.status === 'signed' && (
                <Button
                  variant="outline"
                  onClick={handleArchiveDocument}
                  disabled={processing}
                  className="gap-1"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArchiveIcon className="h-4 w-4" />
                  )}
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
    </div>
  );
}
