'use client';

import { AuditLogEntry } from '@/services/audit.service';

export function LogDetail({ log }: { log: AuditLogEntry }) {
    return (
        <div className="space-y-3 bg-gray-50 p-4 text-sm">
            {log.errorMessage && (
                <div>
                    <p className="text-xs font-medium text-gray-500">Error</p>
                    <p className="text-red-600">{log.errorMessage}</p>
                </div>
            )}

            {log.requestBody && Object.keys(log.requestBody).length > 0 && (
                <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Request Body</p>
                    <pre className="overflow-x-auto rounded-md border bg-white p-3 text-xs">
                        {JSON.stringify(log.requestBody, null, 2)}
                    </pre>
                </div>
            )}

            {log.routeParams && Object.keys(log.routeParams).length > 0 && (
                <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Route Params</p>
                    <pre className="overflow-x-auto rounded-md border bg-white p-3 text-xs">
                        {JSON.stringify(log.routeParams, null, 2)}
                    </pre>
                </div>
            )}

            <div className="flex gap-6 text-xs text-gray-500">
                <span>IP: {log.ipAddress ?? '—'}</span>
                <span>Duration: {log.durationMs}ms</span>
            </div>
        </div>
    );
}