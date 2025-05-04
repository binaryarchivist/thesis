import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function DocumentDetails({ document }) {
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-10 w-10 text-gray-300 mb-3" />
        <h3 className="font-medium text-gray-600">No document selected</h3>
        <p className="text-sm text-gray-500 mt-1">
          Select a document to view its details
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'signed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Signed
          </Badge>
        );
      case 'archived':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            High Priority
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Medium Priority
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Low Priority
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {getStatusBadge(document.status)}
          {getPriorityBadge(document.priority)}
          {document.document_type && (
            <Badge variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {document.document_type
                .replace('_', ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          )}
        </div>

        <h2 className="text-2xl font-bold">{document.title}</h2>

        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(document.created_date), 'PPP')}
          </div>

          {document.tags &&
            Array.isArray(document.tags) &&
            document.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {document.tags.join(', ')}
              </div>
            )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Document Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1">
                  {document.description || (
                    <span className="text-gray-400">
                      No description provided
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Document Type
                </dt>
                <dd className="mt-1 capitalize">
                  {document.document_type?.replace('_', ' ') || (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </dd>
              </div>

              {document.file_url && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Attached File
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={document.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Document
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Workflow Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Created By
                </dt>
                <dd className="mt-1 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {document.created_by || (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Reviewer</dt>
                <dd className="mt-1 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {document.reviewer_name || (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Assignee</dt>
                <dd className="mt-1 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {document.assignee_name || (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </dd>
              </div>

              {document.review_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Review Date
                  </dt>
                  <dd className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {format(new Date(document.review_date), 'PPP')}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {document.content && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Document Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </CardContent>
        </Card>
      )}

      {document.review_notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Review Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="whitespace-pre-line">{document.review_notes}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
