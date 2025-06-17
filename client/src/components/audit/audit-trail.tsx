import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, User, Calendar, Filter } from "lucide-react";
import { useState } from "react";
import { mockAuditTrail } from "@/lib/mockData";
import Papa from "papaparse";

interface AuditEntry {
  id: number;
  action: string;
  details: string;
  user: string;
  timestamp: Date;
  entityType: string;
  entityId: number;
}

interface AuditTrailProps {
  userRole: 'Staff' | 'Technician';
}

export default function AuditTrail({ userRole }: AuditTrailProps) {
  const [entries] = useState<AuditEntry[]>(mockAuditTrail);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.entityType.toLowerCase() === filter.toLowerCase();
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else {
      return a.timestamp.getTime() - b.timestamp.getTime();
    }
  });

  const exportAuditTrail = () => {
    const reportData = sortedEntries.map(entry => ({
      'ID': entry.id,
      'Action': entry.action,
      'Details': entry.details,
      'User': entry.user,
      'Timestamp': entry.timestamp.toLocaleString(),
      'Entity Type': entry.entityType,
      'Entity ID': entry.entityId,
    }));
    
    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'audit-trail.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('Added') || action.includes('Created')) return 'default';
    if (action.includes('Updated') || action.includes('Modified')) return 'secondary';
    if (action.includes('Deleted') || action.includes('Removed')) return 'destructive';
    if (action.includes('Completed')) return 'outline';
    return 'outline';
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail
          </CardTitle>
          <Button onClick={exportAuditTrail} variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="device">Equipment</SelectItem>
                <SelectItem value="rental">Rentals</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="department">Departments</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No audit entries found</p>
            </div>
          ) : (
            <>
              {sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={getActionBadgeVariant(entry.action)}>
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {entry.entityType} #{entry.entityId}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 mb-2">{entry.details}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>by {entry.user}</span>
                  </div>
                </div>
              ))}
              
              {sortedEntries.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="ghost">
                    Load More Entries
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}