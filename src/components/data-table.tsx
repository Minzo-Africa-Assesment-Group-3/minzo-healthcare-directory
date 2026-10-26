'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from 'cn';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    className?: string;
    data: TData[];
    emptyMessage?: string;
    isLoading?: boolean;
    onRowClick?: (row: TData) => void;
    rowClassName?: (row: TData, rowIndex: number) => string | undefined;
    tableCellClassName?: string;
    tableHeadClassName?: string;
}

export function DataTable<TData, TValue>({
    columns,
    className,
    data,
    emptyMessage = 'No results found.',
    isLoading,
    onRowClick,
    rowClassName,
    tableCellClassName,
    tableHeadClassName,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className={cn('rounded-md border bg-white', className)}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead className={tableHeadClassName} key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                Loading…
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row, rowIndex) => (
                            <TableRow
                                key={row.id}
                                onClick={() => onRowClick?.(row.original)}
                                className={cn(
                                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : undefined,
                                    rowClassName?.(row.original, rowIndex),
                                )}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell className={tableCellClassName} key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
