'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notify } from '@/lib/toast';
import AuthShell from '../../auth-shell';
import { authService, parseApiError, type ApiFailure } from '@/services/business-reg.service';
import {
    API_FIELD_TO_FORM,
    STEP_FIELDS,
    buildPayload,
    businessSchema,
    defaultValues,
    type BusinessFormValues,
} from './components/business-schema';
import { StepHeader, primaryBtn, secondaryBtn } from './components/wizard-ui';
import StepBusiness from './components/step-business';
import StepContact from './components/step-contact';
import StepAddress from './components/step-address';
import StepHours from './components/step-hours';
import StepServices from './components/step-services';
import StepStaff from './components/step-staff';
import StepRepresentative from './components/step-representative';
import StepReview from './components/step-review';
import StepPassword from './components/step-password';

const STEP_TITLES = [
    'Business Details',
    'Contact Details',
    'Address & Map',
    'Operating hours',
    'Services Rendered',
    'Staff members',
    'Personal details',
];
const REVIEW = 7;
const PASSWORD = 8;

const stepOf = (field: keyof BusinessFormValues) => STEP_FIELDS.findIndex((fields) => fields.includes(field));

export default function BusinessRegistrationWizard() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [serverError, setServerError] = useState<string | null>(null);
    const submitting = useRef(false); // blocks double submits (Enter + click, slow networks)
    const submitted = useRef(false);

    const methods = useForm<BusinessFormValues>({
        resolver: zodResolver(businessSchema),
        defaultValues,
        mode: 'onTouched',
    });
    const { isSubmitting, isDirty } = methods.formState;

    // Warn before a refresh / tab close throws away a half-filled form
    useEffect(() => {
        if (!isDirty) return;
        const warn = (e: BeforeUnloadEvent) => {
            if (submitted.current) return;
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [isDirty]);

    const go = (n: number) => {
        setStep(n);
        window.scrollTo({ top: 0 });
        document.getElementById('auth-main')?.scrollTo({ top: 0 }); // desktop: only the right panel scrolls
        requestAnimationFrame(() => document.getElementById('step-heading')?.focus({ preventScroll: true }));
    };

    const next = async () => {
        if (step < REVIEW) {
            const ok = await methods.trigger(STEP_FIELDS[step], { shouldFocus: true });
            if (!ok) return;
        }
        go(step + 1);
    };

    // If final validation fails, jump to the first step that has an error
    const onInvalid = (errors: FieldErrors<BusinessFormValues>) => {
        const idx = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in errors));
        if (idx >= 0) go(idx);
        notify.error('Please fix the highlighted fields');
    };

    // Put the API's complaint next to the field it's about
    const applyFailure = ({ status, message, fieldErrors }: ApiFailure) => {
        let target = -1;
        const flag = (field: keyof BusinessFormValues, msg: string) => {
            methods.setError(field, { type: 'server', message: msg });
            const s = stepOf(field);
            if (s >= 0 && (target === -1 || s < target)) target = s;
        };

        Object.entries(fieldErrors).forEach(([key, msg]) => {
            const field = API_FIELD_TO_FORM[key];
            if (field) flag(field, msg);
        });

        // Conflict without field details (e.g. "email already registered")
        if (target === -1 && status === 409) {
            const m = message.toLowerCase();
            if (m.includes('email')) flag('email', message);
            else if (m.includes('registration')) flag('registrationNumber', message);
        }

        if (target >= 0) {
            go(target);
            notify.error('Please check the highlighted field');
        } else {
            setServerError(message);
            notify.error(message);
        }
    };

    const submit = async (values: BusinessFormValues) => {
        if (submitting.current) return;
        submitting.current = true;
        setServerError(null);

        try {
            await authService.registerBusiness(buildPayload(values));
        } catch (err) {
            submitting.current = false;
            applyFailure(parseApiError(err));
            return;
        }

        submitted.current = true;
        const email = values.email.trim().toLowerCase();
        methods.reset(defaultValues); // wipe the password and personal details from memory
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (step === PASSWORD) return methods.handleSubmit(submit, onInvalid)(e);
        e.preventDefault();
        void next();
    };

    const isPassword = step === PASSWORD;

    return (
        <AuthShell
            title={isPassword ? 'Set your password' : 'I own a business'}
            subtitle={
                isPassword
                    ? 'Create a secure password to protect your account.'
                    : 'One account for searching, reviewing and following'
            }
            onBack={step > 0 ? () => go(step - 1) : undefined}
        >
            <FormProvider {...methods}>
                <form onSubmit={onFormSubmit} noValidate autoComplete="off">
                    {!isPassword && (
                        <StepHeader
                            title={step === REVIEW ? 'Review details' : STEP_TITLES[step]}
                            step={Math.min(step + 1, 7)}
                        />
                    )}

                    {step === 0 && <StepBusiness />}
                    {step === 1 && <StepContact />}
                    {step === 2 && <StepAddress />}
                    {step === 3 && <StepHours />}
                    {step === 4 && <StepServices />}
                    {step === 5 && <StepStaff />}
                    {step === 6 && <StepRepresentative />}
                    {step === REVIEW && <StepReview goTo={go} />}
                    {isPassword && <StepPassword serverError={serverError} />}

                    <div className="mt-10">
                        {step === 0 && (
                            <button type="submit" className={`${primaryBtn} w-full`}>
                                Next <ArrowRight className="h-5 w-5" aria-hidden />
                            </button>
                        )}

                        {step > 0 && !isPassword && (
                            <div className="flex justify-between gap-3">
                                <button type="button" onClick={() => go(step - 1)} className={`${secondaryBtn} w-36 sm:w-40`}>
                                    <ArrowLeft className="h-5 w-5" aria-hidden /> Previous
                                </button>
                                <button type="submit" className={`${primaryBtn} w-36 sm:w-40`}>
                                    {step === REVIEW ? 'Continue' : 'Next'} <ArrowRight className="h-5 w-5" aria-hidden />
                                </button>
                            </div>
                        )}

                        {isPassword && (
                            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`${primaryBtn} w-full`}>
                                {isSubmitting ? 'Creating account…' : 'Create account'}
                            </button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </AuthShell>
    );
}