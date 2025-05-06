import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { FileText, Tag, ChevronRight, Clock, AlertCircle } from 'lucide-react';

export default function DocumentsList({ documents = [], onOpenDocument }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-800 border-emerald-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-rose-100 text-rose-800 border-rose-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'signed':
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Signed
          </Badge>
        );
      case 'archived':
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            <Clock className="h-3 w-3 mr-1" />
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
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDocumentTypeBadge = (type) => {
    if (!type) return null;
    return (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-800 border-gray-200"
      >
        <Tag className="h-3 w-3 mr-1" />
        {type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FileText className="h-10 w-10 text-gray-300 mb-3" />
        <h3 className="font-medium text-gray-600">No documents found</h3>
        <p className="text-sm text-gray-500 mt-1">
          There are no documents to display at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.document_id}
          onClick={() => onOpenDocument(doc)}
          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <FileText className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{doc.title}</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Created on {format(new Date(doc.created_at), 'MMM d, yyyy')}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {getStatusBadge(doc.status)}
              {getPriorityBadge(doc.priority)}
              {doc.document_type && getDocumentTypeBadge(doc.document_type)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
