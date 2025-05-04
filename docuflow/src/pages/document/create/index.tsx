import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UserSelectDropdown from '../../../components/documents/UserSelectDropdown';
import TagInput from '../../../components/documents/TagInput';

export default function CreateDocument() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    file_url: '',
    document_type: 'contract',
    reviewer_id: '',
    reviewer_name: '',
    assignee_id: '',
    assignee_name: '',
    tags: [],
    priority: 'medium',
    status: 'pending',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const usersList = await User.list(); FETCH USERS API TODO
        const usersList = [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Alice Johnson' },
            { id: '4', name: 'Bob Brown' },
        ]; // Mock data
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleTagsChange = (tags) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleReviewerChange = (userId, userName) => {
    setFormData((prev) => ({
      ...prev,
      reviewer_id: userId,
      reviewer_name: userName,
    }));
  };

  const handleAssigneeChange = (userId, userName) => {
    setFormData((prev) => ({
      ...prev,
      assignee_id: userId,
      assignee_name: userName,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileUploading(true);
    try {
      //   const { file_url } = await UploadFile({ file });  // TODO UPLOAD FILE API
      const file_url = URL.createObjectURL(file); // Mock upload
      setFormData((prev) => ({ ...prev, file_url }));
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error('File upload error:', err);
    } finally {
      setFileUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Document title is required');
      return false;
    }

    if (!formData.reviewer_id) {
      setError('Please select a reviewer');
      return false;
    }

    if (!formData.assignee_id) {
      setError('Please select an assignee');
      return false;
    }

    if (!formData.content && !formData.file_url) {
      setError('Please provide document content or upload a file');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      //   await Document.create(formData); CREATE New document API TODO
      setSuccess(true);

      // Redirect after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('Failed to create document. Please try again.');
      console.error('Error creating document:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create New Document
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a new document and start the workflow
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
          <AlertDescription>
            Document created successfully! Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Document Information
              </CardTitle>
              <CardDescription>
                Basic information about the document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Document Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter document title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_type">Document Type</Label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value) =>
                      handleSelectChange('document_type', value)
                    }
                  >
                    <SelectTrigger id="document_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the document"
                  rows={3}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleSelectChange('priority', value)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput value={formData.tags} onChange={handleTagsChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Workflow Assignments
              </CardTitle>
              <CardDescription>
                Assign people to review and sign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Reviewer <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Will review the document
                  </span>
                </Label>
                <UserSelectDropdown
                  users={users}
                  selectedUserId={formData.reviewer_id}
                  onChange={handleReviewerChange}
                  placeholder="Select reviewer"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Assignee <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Will sign after approval
                  </span>
                </Label>
                <UserSelectDropdown
                  users={users}
                  selectedUserId={formData.assignee_id}
                  onChange={handleAssigneeChange}
                  placeholder="Select assignee"
                />
              </div>

              <Alert className="bg-blue-50 border-blue-200 mt-4">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                <AlertDescription className="text-blue-700 text-sm">
                  The document will be sent to the reviewer first, and after
                  approval, it will be sent to the assignee for signature.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Document Content
              </CardTitle>
              <CardDescription>
                Add content or upload a document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>File Upload</Label>
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
                {formData.file_url && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    File uploaded successfully
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>
                  OR Enter Content
                  <span className="text-xs text-gray-500 ml-2">
                    You can type or paste content here
                  </span>
                </Label>
                {/* <div className="border rounded-md min-h-[200px]">
                  <ReactQuill
                    value={formData.content}
                    onChange={handleContentChange}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [
                          { list: 'ordered' },
                          { list: 'bullet' },
                          { indent: '-1' },
                          { indent: '+1' },
                        ],
                        ['link'],
                        ['clean'],
                      ],
                    }}
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Document
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
