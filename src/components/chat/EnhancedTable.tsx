import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronUp, ChevronDown, Search, Download, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableProps, TableColumn } from '@/types/chat';

export const EnhancedTable: React.FC<TableProps> = ({ 
  data, 
  columns: propColumns, 
  pageSize = 10, 
  searchable = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterField, setFilterField] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  // Auto-generate columns if not provided
  const columns: TableColumn[] = useMemo(() => {
    if (propColumns) return propColumns;
    if (data.length === 0) return [];
    
    return Object.keys(data[0]).map(key => ({
      key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      sortable: true,
      filterable: true
    }));
  }, [data, propColumns]);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (searchQuery && searchable) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Column filter
    if (filterField && filterValue) {
      filtered = filtered.filter(row =>
        String(row[filterField]).toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        // Handle numbers
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle strings
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [data, searchQuery, sortField, sortDirection, filterField, filterValue, searchable]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.header).join(',');
    const rows = processedData.map(row => 
      columns.map(col => String(row[col.key])).join(',')
    ).join('\n');
    
    const csv = headers + '\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oracle-data-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return (
      <Card className="p-6 border-oracle-red/20">
        <div className="text-center text-muted-foreground">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-oracle-red/20 bg-gradient-to-br from-background to-muted/20">
      <div className="p-4 border-b border-border/50">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-oracle-red/20 focus:border-oracle-red/50"
              />
            </div>
          )}

          {/* Filter */}
          <div className="flex gap-2">
            <Select value={filterField} onValueChange={setFilterField}>
              <SelectTrigger className="w-32 border-oracle-red/20">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No filter</SelectItem>
                {columns.filter(col => col.filterable).map(col => (
                  <SelectItem key={col.key} value={col.key}>
                    {col.header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filterField && (
              <Input
                placeholder="Filter value..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-32 border-oracle-red/20"
              />
            )}
          </div>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="border-oracle-red/20 hover:bg-oracle-red/5"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {paginatedData.length} of {processedData.length} results
            {processedData.length !== data.length && ` (filtered from ${data.length})`}
          </span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-oracle-red/20">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "font-semibold text-foreground bg-gradient-to-r from-oracle-red/5 to-oracle-purple/5",
                    column.sortable && "cursor-pointer hover:bg-oracle-red/10"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortField === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 text-oracle-red" /> : 
                        <ChevronDown className="w-4 h-4 text-oracle-red" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-oracle-red/10 hover:bg-oracle-red/5 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="py-3">
                    {String(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-oracle-red/20 hover:bg-oracle-red/5"
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 p-0",
                      currentPage === page 
                        ? "bg-gradient-to-r from-oracle-red to-oracle-purple" 
                        : "border-oracle-red/20 hover:bg-oracle-red/5"
                    )}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-oracle-red/20 hover:bg-oracle-red/5"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};