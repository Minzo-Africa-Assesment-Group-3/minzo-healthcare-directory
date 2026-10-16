'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { usersService, AppUser } from '@/services/users.service';
import { UserRole } from '@/lib/types';
import { notify } from '@/lib/toast';

const ALL_ROLES = [UserRole.ADMIN, UserRole.MAKER, UserRole.CHECKER, UserRole.VIEWER];

export function EditRolesDialog({
    user,
    onClose,
}: {
    user: AppUser | null;
    onClose: () => void;
}) {
    return (
        <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
            {user && <EditRolesForm key={user._id} user={user} onClose={onClose} />}
        </Dialog>
    );
}

function EditRolesForm({ user, onClose }: { user: AppUser; onClose: () => void }) {
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<UserRole[]>(user.roles);

    const { mutate, isPending } = useMutation({
        mutationFn: () => usersService.updateRoles(user._id, selected),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notify.success('Roles updated');
            onClose();
        },
    });

    return (
        <DialogContent className="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle>Edit Roles — {user.fullName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
                {ALL_ROLES.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                        <Checkbox
                            id={`edit-${role}`}
                            checked={selected.includes(role)}
                            onCheckedChange={(checked) => {
                                setSelected((prev) =>
                                    checked ? [...prev, role] : prev.filter((r) => r !== role),
                                );
                            }}
                        />
                        <Label htmlFor={`edit-${role}`} className="text-sm font-normal">
                            {role}
                        </Label>
                    </div>
                ))}
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={isPending || selected.length === 0}
                    className="bg-green-700 hover:bg-green-800"
                    onClick={() => mutate()}
                >
                    {isPending ? 'Saving…' : 'Save Roles'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}