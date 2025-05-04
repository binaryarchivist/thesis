import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function RecentDocumentsList({ documents }) {
  const getStatusDetails = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
      },
      approved: {
        label: 'Approved',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-rose-100 text-rose-800 border-rose-200',
      },
      signed: {
        label: 'Signed',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      archived: {
        label: 'Archived',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    };

    return (
      statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    );
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-10 w-10 text-gray-300 mb-2" />
        <h3 className="font-medium text-gray-600">No documents yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Create your first document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const statusDetails = getStatusDetails(doc.status);

        return (
          <Link
            key={doc.id}
            to={`/documents/${doc.id}`}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium line-clamp-1">{doc.title}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusDetails.color} border`}
                  >
                    {statusDetails.label}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {format(new Date(doc.created_date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        );
      })}
    </div>
  );
}
