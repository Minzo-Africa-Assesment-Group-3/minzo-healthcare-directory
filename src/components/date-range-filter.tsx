'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DateRangeFilterProps {
    from: string;
    to: string;
    onFromChange: (v: string) => void;
    onToChange: (v: string) => void;
    onApply: () => void;
}

export function DateRangeFilter({ from, to, onFromChange, onToChange, onApply }: DateRangeFilterProps) {
    return (
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
            <div>
                <Label htmlFor="from" className="text-xs">From</Label>
                <Input id="from" type="date" value={from} onChange={(e) => onFromChange(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="to" className="text-xs">To</Label>
                <Input id="to" type="date" value={to} onChange={(e) => onToChange(e.target.value)} />
            </div>
            <Button onClick={onApply} className="bg-green-700 hover:bg-green-800">
                Apply
            </Button>
        </div>
    );
}