import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatTableProps {
  data: Array<Record<string, any>>;
}

export const ChatTable: React.FC<ChatTableProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);
  
  const formatCellValue = (value: any) => {
    if (typeof value === 'string' && value.startsWith('$')) {
      return <Badge variant="secondary">{value}</Badge>;
    }
    if (typeof value === 'string' && value.includes('%')) {
      const isPositive = value.includes('+');
      return (
        <Badge variant={isPositive ? "default" : "destructive"}>
          {value}
        </Badge>
      );
    }
    return value;
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column} className="font-semibold">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/30">
                {columns.map((column) => (
                  <TableCell key={column}>
                    {formatCellValue(row[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Table Footer */}
      <div className="px-4 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
        Showing {data.length} {data.length === 1 ? 'record' : 'records'}
      </div>
    </Card>
  );
};