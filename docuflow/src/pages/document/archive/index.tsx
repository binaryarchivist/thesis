import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Archive as ArchiveIcon, 
  Search, 
  Filter, 
  ChevronDown, 
  FileText,
  Clock,
  ChevronRight,
  Tag
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import DocumentDetails from '../../../components/documents/DocumentDetails';

export default function Archive() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const allDocuments = await Document.list('-created_date'); // Fetch all documents TODO 
        const allDocuments = []
        // Get only signed documents for potential archiving
        const signedDocs = allDocuments.filter(doc => 
          doc.status === 'signed' || doc.status === 'archived'
        );
        setDocuments(signedDocs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleArchiveDocument = async (document) => {
    try {
    //   await Document.update(document.id, {
    //     ...document,
    //     status: 'archived',
    //     archive_date: new Date().toISOString()
    //   }); todo document archive api
      
      // Refresh documents
      const { data } = await Document.list(); // Fetch all documents TODO
      const updatedSignedDocs = data.filter(doc => 
        doc.status === 'signed' || doc.status === 'archived'
      );
      setDocuments(updatedSignedDocs);
      
      // If we archived the currently selected document, update it
      if (selectedDocument && selectedDocument.document_id === document.document_id) {
        const updatedDoc = updatedSignedDocs.find(doc => doc.document_id === document.document_id);
        if (updatedDoc) {
          setSelectedDocument(updatedDoc);
        }
      }
    } catch (error) {
      console.error('Error archiving document:', error);
    }
  };
  
  const getFilteredDocuments = () => {
    let filtered = [...documents];
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.document_type === filterType);
    }
    
    return filtered;
  };
  
  const handleOpenDocument = (document) => {
    setSelectedDocument(document);
  };
  
  const handleBackToList = () => {
    setSelectedDocument(null);
  };
  
  const getDocumentTypeOptions = () => {
    const types = new Set();
    documents.forEach(doc => {
      if (doc.document_type) {
        types.add(doc.document_type);
      }
    });
    return Array.from(types);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Archive</h1>
        <p className="text-muted-foreground mt-1">
          Manage and archive completed documents
        </p>
      </div>
      
      {!selectedDocument ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-medium">Document Library</CardTitle>
                <CardDescription>
                  Archive and access your completed documents
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
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterType('all')}>
                      All Types
                    </DropdownMenuItem>
                    {getDocumentTypeOptions().map((type) => (
                      <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
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
                {getFilteredDocuments().length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredDocuments().map((doc) => (
                      <div 
                        key={doc.document_id}
                        className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div 
                          className="flex items-start gap-4 flex-1 cursor-pointer"
                          onClick={() => handleOpenDocument(doc)}
                        >
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <FileText className="h-5 w-5" />
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className={doc.status === 'archived' ? 
                                'bg-gray-100 text-gray-800 border-gray-200' : 
                                'bg-blue-100 text-blue-800 border-blue-200'
                              }>
                                {doc.status === 'archived' ? 'Archived' : 'Signed'}
                              </Badge>
                              
                              {doc.document_type && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {doc.document_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                              )}
                              
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {doc.archive_date ? 
                                  `Archived on ${format(new Date(doc.archive_date), "MMM d, yyyy")}` : 
                                  `Signed on ${format(new Date(doc.sign_date), "MMM d, yyyy")}`
                                }
                              </span>
                            </div>
                          </div>
                          
                          <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                        </div>
                        
                        {doc.status === 'signed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveDocument(doc)}
                            className="whitespace-nowrap"
                          >
                            <ArchiveIcon className="h-4 w-4 mr-1" />
                            Archive
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <ArchiveIcon className="h-10 w-10 text-gray-300 mb-3" />
                    <h3 className="font-medium text-gray-600">No documents found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      No signed or archived documents match your search criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
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
                  Back to Archive
                </Button>
                
                {selectedDocument.status === 'signed' && (
                  <Button 
                    variant="outline"
                    onClick={() => handleArchiveDocument(selectedDocument)}
                  >
                    <ArchiveIcon className="h-4 w-4 mr-2" />
                    Archive Document
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <DocumentDetails document={selectedDocument} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
