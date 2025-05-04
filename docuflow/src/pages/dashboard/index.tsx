import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StatusCard from '../../components/dashboard/StatusCard';
import RecentDocumentsList from '../../components/dashboard/RecentDocumentsList';
import DocumentStatusChart from '../../components/dashboard/DocumentStatusChart';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    signed: 0,
    archived: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const user = await User.me(); GET USER API TODO
        const user = {};
        setUserData(user);

        // const allDocuments = await Document.list('-created_date'); GET DOCUMENTS API TODO
        const allDocuments = [];
        setDocuments(allDocuments);

        // Count documents by status
        const counts = {
          pending: 0,
          approved: 0,
          rejected: 0,
          signed: 0,
          archived: 0,
        };

        allDocuments.forEach((doc) => {
          if (counts[doc.status] !== undefined) {
            counts[doc.status]++;
          }
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPendingReviews = () => {
    return documents.filter(
      (doc) => doc.status === 'pending' && doc.reviewer_id === userData?.id
    ).length;
  };

  const getPendingSigns = () => {
    return documents.filter(
      (doc) => doc.status === 'approved' && doc.assignee_id === userData?.id
    ).length;
  };

  const getRecentDocuments = () => {
    return documents.slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Document Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your electronic documents workflow
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Pending Review"
          value={statusCounts.pending}
          description="Documents awaiting review"
          icon={<Clock className="h-5 w-5" />}
          color="bg-amber-500"
          link={"/pending"}
        />
        <StatusCard
          title="Approved"
          value={statusCounts.approved}
          description="Documents ready for signing"
          icon={<CheckCircle className="h-5 w-5" />}
          color="bg-emerald-500"
          link={"/approved"}
        />
        <StatusCard
          title="Rejected"
          value={statusCounts.rejected}
          description="Documents not approved"
          icon={<XCircle className="h-5 w-5" />}
          color="bg-rose-500"
        />
        <StatusCard
          title="Archived"
          value={statusCounts.archived}
          description="Completed documents"
          icon={<Archive className="h-5 w-5" />}
          color="bg-blue-500"
          link={"/archived"}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-48">
                <div className="w-full h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Document Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentStatusChart data={statusCounts} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Recent Documents
              </CardTitle>
              <Link to={"/create"}>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentDocumentsList documents={getRecentDocuments()} />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {!loading ? (
              <div className="space-y-4">
                <Link to={"/pending"} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Documents Awaiting Your Review
                        </p>
                        <p className="text-sm text-gray-500">
                          {getPendingReviews()} pending document
                          {getPendingReviews() !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>

                <Link to={"/approved"} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Documents Awaiting Your Signature
                        </p>
                        <p className="text-sm text-gray-500">
                          {getPendingSigns()} document
                          {getPendingSigns() !== 1 ? 's' : ''} to sign
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>

                <Link to={"/create"} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <PlusCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Create New Document</p>
                        <p className="text-sm text-gray-500">
                          Start a new document workflow
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-teal-50 p-4 border border-teal-100">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertCircle className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-teal-900">
                      Document Workflow
                    </h3>
                    <p className="text-sm text-teal-700 mt-1">
                      Documents follow a specific workflow: Create → Review →
                      Approve/Reject → Sign → Archive
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link to={"/create"}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Document
                    </Button>
                  </Link>
                  <Link to={"/pending"}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Review
                    </Button>
                  </Link>
                  <Link to={"/approved"}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Sign
                    </Button>
                  </Link>
                  <Link to={"/archived"}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
