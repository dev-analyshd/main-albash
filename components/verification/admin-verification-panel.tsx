"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VerificationRequest {
  id: string;
  user_id: string;
  entity_type: string;
  status: string;
  created_at: string;
  document_types: string[];
  users: {
    id: string;
    email: string;
    full_name: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-200 text-yellow-800",
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
};

export function AdminVerificationPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch("/api/admin/verification/pending?limit=50");

      if (!response.ok) {
        throw new Error("Failed to fetch pending requests");
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/verification/${selectedRequest.id}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review_notes: reviewNotes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve verification");
      }

      toast({
        title: "Success",
        description: `Verification approved for ${selectedRequest.users.email}`,
      });

      setSelectedRequest(null);
      setReviewNotes("");
      setAction(null);
      fetchPendingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/verification/${selectedRequest.id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review_notes: reviewNotes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject verification");
      }

      toast({
        title: "Success",
        description: `Verification rejected for ${selectedRequest.users.email}`,
      });

      setSelectedRequest(null);
      setReviewNotes("");
      setAction(null);
      fetchPendingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">Loading pending verifications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            {requests.length} pending verification(s) to review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending verification requests
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">
                        {request.users.full_name || "No Name"}
                      </h4>
                      <Badge className={STATUS_COLORS[request.status]}>
                        {request.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {request.entity_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.users.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted:{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedRequest(request);
                      setAction("approve");
                    }}
                    size="sm"
                    className="ml-4"
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={Boolean(selectedRequest && action)}
        onOpenChange={() => {
          if (!actionLoading) {
            setSelectedRequest(null);
            setReviewNotes("");
            setAction(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === "approve"
                ? "Approve Verification"
                : "Reject Verification"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.users.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Entity Type</p>
              <p className="text-sm text-gray-600 capitalize">
                {selectedRequest?.entity_type}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Review Notes</p>
              <Textarea
                placeholder="Add any notes about your decision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                disabled={actionLoading}
                rows={4}
              />
            </div>

            {action === "reject" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                The applicant will be notified and can reapply after 30 days.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
                setReviewNotes("");
                setAction(null);
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            {action === "approve" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setAction("reject")}
                  disabled={actionLoading}
                >
                  Reject Instead
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading ? "Approving..." : "Approve"}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleReject}
                disabled={actionLoading}
                variant="destructive"
              >
                {actionLoading ? "Rejecting..." : "Reject"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
