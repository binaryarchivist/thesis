import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Search, Filter, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import DocumentsList from '../../../components/documents/DocumentsList';
import DocumentDetails from '../../../components/documents/DocumentDetails';
import ReviewForm from '../../../components/documents/ReviewForm';
import DocumentsApi from '@/api/DocumentsApi';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Review() {
  const { userData } = useAuthContext();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {data} = await DocumentsApi.list(); 
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReviewSubmit = async (reviewData) => {
    try {
      //   await Document.update(selectedDocument.id, {
      //     ...selectedDocument,
      //     ...reviewData,
      //     review_date: new Date().toISOString(),
      //   }); UPDATE DOCUMENT API TODO

      // Refresh documents
        const {data} = await DocumentsApi.list(); // GET DOCUMENT LIST API TODO
      setDocuments(data);

      // Reset UI state
      setShowReviewForm(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const getPendingDocuments = () => {
    let filtered = documents.filter(
      (doc) => doc.status === 'pending' && doc.reviewer_id === userData?.id
    );

    if (searchQuery) {
      filtered = filtered.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((doc) => doc.priority === filterPriority);
    }

    return filtered;
  };

  const getCompletedReviews = () => {
    let filtered = documents.filter(
      (doc) =>
        (doc.status === 'approved' || doc.status === 'rejected') &&
        doc.reviewer_id === userData?.user_id
    );

    if (searchQuery) {
      filtered = filtered.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((doc) => doc.priority === filterPriority);
    }

    return filtered;
  };

  const handleOpenDocument = (document) => {
    setSelectedDocument(document);
    setShowReviewForm(false);
  };

  const handleStartReview = () => {
    setShowReviewForm(true);
  };

  const handleBackToList = () => {
    setSelectedDocument(null);
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Review</h1>
        <p className="text-muted-foreground mt-1">
          Review, approve or reject documents
        </p>
      </div>

      {!selectedDocument ? (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-medium">
                    Documents for Review
                  </CardTitle>
                  <CardDescription>
                    Documents assigned to you for review
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setFilterPriority('all')}
                      >
                        All Priorities
                        {filterPriority === 'all' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority('high')}
                      >
                        High Priority
                        {filterPriority === 'high' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority('medium')}
                      >
                        Medium Priority
                        {filterPriority === 'medium' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority('low')}
                      >
                        Low Priority
                        {filterPriority === 'low' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Tabs
                defaultValue="pending"
                className="mt-4"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="pending" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Pending
                    <Badge variant="secondary">
                      {getPendingDocuments().length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Completed
                    <Badge variant="secondary">
                      {getCompletedReviews().length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                          <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <>
                  {activeTab === 'pending' &&
                    (getPendingDocuments().length > 0 ? (
                      <DocumentsList
                        documents={getPendingDocuments()}
                        onOpenDocument={handleOpenDocument}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Clock className="h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="font-medium text-gray-600">
                          No pending reviews
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          You don't have any documents to review at the moment
                        </p>
                      </div>
                    ))}

                  {activeTab === 'completed' &&
                    (getCompletedReviews().length > 0 ? (
                      <DocumentsList
                        documents={getCompletedReviews()}
                        onOpenDocument={handleOpenDocument}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <CheckCircle className="h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="font-medium text-gray-600">
                          No completed reviews
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          You haven't reviewed any documents yet
                        </p>
                      </div>
                    ))}
                </>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToList}
                  className="gap-1"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  Back to List
                </Button>

                {!showReviewForm && (
                  <Button
                    onClick={handleStartReview}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {selectedDocument.status === 'pending'
                      ? 'Start Review'
                      : 'Edit Review'}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {showReviewForm ? (
                <ReviewForm
                  document={selectedDocument}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                />
              ) : (
                <DocumentDetails document={selectedDocument} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
