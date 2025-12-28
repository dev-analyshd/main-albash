"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface VerificationData {
  status: string;
  verified_at: string | null;
  entity_type: string | null;
  blockchain_verified: boolean;
  latest_request: {
    id: string;
    status: string;
    created_at: string;
    review_date: string | null;
    review_notes: string | null;
    entity_type: string;
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  unverified: "bg-gray-200 text-gray-800",
  pending: "bg-yellow-200 text-yellow-800",
  verified: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  suspended: "bg-orange-200 text-orange-800",
};

const STATUS_MESSAGES: Record<string, string> = {
  unverified:
    "Your account is not yet verified. Submit an application to get started.",
  pending:
    "Your verification is being reviewed. You will be notified when a decision is made.",
  verified:
    "Congratulations! Your account is verified. You have full access to AlbashSolution.",
  rejected:
    "Your verification application was rejected. You can reapply after 30 days.",
  suspended:
    "Your verification has been suspended. Contact support for more information.",
};

export function VerificationStatus({ userId }: { userId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/verification/status/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch verification status");
        }

        const result = await response.json();
        setData(result.verification);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId, user, router, toast]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Loading verification status...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.refresh()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">No verification data found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Your AlbashSolution account verification</CardDescription>
          </div>
          <Badge className={STATUS_COLORS[data.status]}>
            {data.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Message */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            {STATUS_MESSAGES[data.status]}
          </p>
        </div>

        {/* Status Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <p className="text-lg font-semibold capitalize">
                {data.status}
              </p>
            </div>
            {data.entity_type && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Entity Type
                </p>
                <p className="text-lg font-semibold capitalize">
                  {data.entity_type}
                </p>
              </div>
            )}
            {data.verified_at && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Verified Date
                </p>
                <p className="text-lg font-semibold">
                  {new Date(data.verified_at).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Blockchain Status
              </p>
              <Badge
                className={
                  data.blockchain_verified
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }
              >
                {data.blockchain_verified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Latest Request Details */}
        {data.latest_request && (
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Latest Request</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Request ID:</span>
                <span className="text-sm font-mono">
                  {data.latest_request.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={STATUS_COLORS[data.latest_request.status]}>
                  {data.latest_request.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm">
                  {new Date(data.latest_request.created_at).toLocaleDateString()}
                </span>
              </div>
              {data.latest_request.review_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reviewed:</span>
                  <span className="text-sm">
                    {new Date(data.latest_request.review_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {data.latest_request.review_notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 mb-1">Review Notes:</p>
                  <p className="text-sm text-gray-700">
                    {data.latest_request.review_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t pt-6 flex gap-3">
          {data.status === "unverified" && (
            <Button
              onClick={() => router.push(`/verification/apply`)}
              className="flex-1"
            >
              Submit Verification
            </Button>
          )}
          {data.status === "rejected" && (
            <Button
              onClick={() => router.push(`/verification/apply`)}
              variant="outline"
              className="flex-1"
            >
              Reapply
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
