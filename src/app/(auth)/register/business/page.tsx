'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notify } from '@/lib/toast';
import AuthShell from '../../auth-shell';
import { STEP_FIELDS, buildPayload, businessSchema, defaultValues, type BusinessFormValues } from './components/business-schema';
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

export default function BusinessRegistrationWizard() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [serverError, setServerError] = useState<string | null>(null);

    const methods = useForm<BusinessFormValues>({
        resolver: zodResolver(businessSchema),
        defaultValues,
        mode: 'onTouched',
    });
    const { isSubmitting } = methods.formState;

    const go = (n: number) => {
        setStep(n);
        window.scrollTo({ top: 0 });
    };

    const next = async () => {
        if (step < REVIEW) {
            const ok = await methods.trigger(STEP_FIELDS[step]);
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

    const submit = async (values: BusinessFormValues) => {
        setServerError(null);

        // Adjust endpoint/format to your backend: JSON `payload` + the document as multipart
        const body = new FormData();
        body.append('payload', JSON.stringify(buildPayload(values)));
        if (values.document) body.append('registrationDocument', values.document);

        const res = await fetch('/api/auth/register-business', { method: 'POST', body });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const message = data.message ?? 'Could not create your account. Try again.';
            setServerError(message);
            notify.error(message);
            return;
        }

        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
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
        >
            <FormProvider {...methods}>
                <form onSubmit={onFormSubmit} noValidate>
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
                            <button type="submit" disabled={isSubmitting} className={`${primaryBtn} w-full`}>
                                {isSubmitting ? 'Creating account…' : 'Create account'}
                            </button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </AuthShell>
    );
}
