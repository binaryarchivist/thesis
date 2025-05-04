import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  PenTool,
  Save,
  Loader2,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import DocumentsList from '../../../components/documents/DocumentsList';
import DocumentDetails from '../../../components/documents/DocumentDetails';
import SignatureCanvas from '../../../components/documents/SignatureCanvas';

export default function Sign() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showSignForm, setShowSignForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [signatureNotes, setSignatureNotes] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const user = await User.me(); // GET USER API todo
        const user = {
          full_name: 'John Doe',
          role: 'Admin'
        };
        setUserData(user);
        
        // const allDocuments = await Document.list('-created_date'); GET DOCUMENTS API todo
        const allDocuments = []
        setDocuments(allDocuments);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSignDocument = async () => {
    if (!signatureData) {
      alert('Please provide a signature before submitting');
      return;
    }
    
    setSigningInProgress(true);
    
    try {
    //   await Document.update(selectedDocument.id, {
    //     ...selectedDocument,
    //     status: 'signed',
    //     sign_date: new Date().toISOString(),
    //     signature_data: signatureData,
    //     signature_notes: signatureNotes
    //   }); // TODO SIGN DOCUMENT API  
      
      // Refresh documents
    //   const updatedDocuments = await Document.list('-created_date'); // GET DOCUMENTS API todo
        const updatedDocuments = []
      setDocuments(updatedDocuments);
      
      // Reset UI state
      setShowSignForm(false);
      setSelectedDocument(null);
      setSignatureData('');
      setSignatureNotes('');
    } catch (error) {
      console.error('Error signing document:', error);
    } finally {
      setSigningInProgress(false);
    }
  };
  
  const getPendingDocuments = () => {
    let filtered = documents.filter(doc => 
      doc.status === 'approved' && 
      doc.assignee_id === userData?.id
    );
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(doc => doc.priority === filterPriority);
    }
    
    return filtered;
  };
  
  const getSignedDocuments = () => {
    let filtered = documents.filter(doc => 
      doc.status === 'signed' && 
      doc.assignee_id === userData?.id
    );
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(doc => doc.priority === filterPriority);
    }
    
    return filtered;
  };
  
  const handleOpenDocument = (document) => {
    setSelectedDocument(document);
    setShowSignForm(false);
  };
  
  const handleStartSigning = () => {
    setShowSignForm(true);
  };
  
  const handleBackToList = () => {
    setSelectedDocument(null);
    setShowSignForm(false);
    setSignatureData('');
    setSignatureNotes('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sign Documents</h1>
        <p className="text-muted-foreground mt-1">
          Sign approved documents
        </p>
      </div>
      
      {!selectedDocument ? (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-medium">Documents for Signing</CardTitle>
                  <CardDescription>
                    Documents assigned to you for signature
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
                      <DropdownMenuItem onClick={() => setFilterPriority('all')}>
                        All Priorities
                        {filterPriority === 'all' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                        High Priority
                        {filterPriority === 'high' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                        Medium Priority
                        {filterPriority === 'medium' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority('low')}>
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
                    <PenTool className="h-4 w-4" />
                    To Sign
                    <Badge variant="secondary">{getPendingDocuments().length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="signed" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Signed
                    <Badge variant="secondary">{getSignedDocuments().length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
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
                  {activeTab === 'pending' && (
                    getPendingDocuments().length > 0 ? (
                      <DocumentsList
                        documents={getPendingDocuments()}
                        onOpenDocument={handleOpenDocument}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <PenTool className="h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="font-medium text-gray-600">No documents to sign</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          You don't have any approved documents to sign at the moment
                        </p>
                      </div>
                    )
                  )}
                  
                  {activeTab === 'signed' && (
                    getSignedDocuments().length > 0 ? (
                      <DocumentsList
                        documents={getSignedDocuments()}
                        onOpenDocument={handleOpenDocument}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <CheckCircle className="h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="font-medium text-gray-600">No signed documents</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          You haven't signed any documents yet
                        </p>
                      </div>
                    )
                  )}
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
                
                {!showSignForm && selectedDocument.status === 'approved' && (
                  <Button 
                    onClick={handleStartSigning}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Sign Document
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {showSignForm ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Sign Document</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Please add your signature to complete this document
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Draw your signature</label>
                      <div className="border rounded-lg p-4">
                        <SignatureCanvas 
                          onSign={setSignatureData}
                          width={600}
                          height={200}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSignatureData('')}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes (optional)</label>
                      <Textarea
                        value={signatureNotes}
                        onChange={(e) => setSignatureNotes(e.target.value)}
                        placeholder="Add any notes about your signature or this document..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowSignForm(false)}
                        disabled={signingInProgress}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSignDocument}
                        disabled={signingInProgress || !signatureData}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {signingInProgress ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Complete Signature
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
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
