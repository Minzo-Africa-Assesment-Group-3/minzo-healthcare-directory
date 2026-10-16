'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { membersService } from '@/services/members.service';
import { cn } from '@/lib/utils';

interface MemberComboboxProps {
    value: string | null;
    onChange: (memberId: string) => void;
}

export function MemberCombobox({ value, onChange }: MemberComboboxProps) {
    const [open, setOpen] = useState(false);
    const { data: members } = useQuery({
        queryKey: ['members', 'ACTIVE'],
        queryFn: () => membersService.getAll({ status: 'ACTIVE' }),
    });

    const selected = members?.data?.find((m) => m._id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button variant="outline" className="w-full justify-between font-normal">
                        {selected ? `${selected.fullName} (${selected.membershipNumber})` : 'Select a member…'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                }
            />
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search members…" />
                    <CommandList>
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandGroup>
                            {members?.data?.map((member) => (
                                <CommandItem
                                    key={member._id}
                                    value={`${member.fullName} ${member.membershipNumber}`}
                                    onSelect={() => {
                                        onChange(member._id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === member._id ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    {member.fullName} ({member.membershipNumber})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}