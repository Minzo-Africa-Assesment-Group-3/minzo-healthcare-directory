'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { notify } from '@/lib/toast';
import { TIMEZONES, type BusinessFormValues } from './business-schema';
import { Field, SelectInput, inputClass, outlineBtn } from './wizard-ui';
import { authService } from '@/services/business-reg.service';

interface County {
    id: string;
    name: string;
    slug: string;
}

interface City {
    id: string;
    countyId: string;
    name: string;
    slug: string;
}

export default function StepAddress() {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    
    const [locating, setLocating] = useState(false);
    const [counties, setCounties] = useState<{ value: string; label: string }[]>([]);
    const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
    const [loadingCounties, setLoadingCounties] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const county = watch('county');

    // Fetch Counties on component mount
    useEffect(() => {
        const fetchCounties = async () => {
            setLoadingCounties(true);
            try {
                const res = await authService.getCounties();
                const data = (res as unknown as County[]) || [];
                const formattedCounties = data.map((c) => ({
                    value: c.id,
                    label: c.name,
                }));
                setCounties(formattedCounties);
            } catch (error) {
                console.error(error);
                notify.error('Failed to load counties');
            } finally {
                setLoadingCounties(false);
            }
        };

        fetchCounties();
    }, []);

    // Fetch Cities whenever the selected county changes
    useEffect(() => {
        if (!county) return;

        const fetchCitiesByCounty = async (countyId: string) => {
            setLoadingCities(true);
            try {
                const res = await authService.getCities(countyId);
                // console.log(res)
                const data = (res as unknown as City[]) || [];
                const formattedCities = data.map((c) => ({
                    value: c.name, // Change to c.id if your backend expects city IDs
                    label: c.name,
                }));
                setCities(formattedCities);
            } catch (error) {
                console.error(error);
                notify.error('Failed to load cities');
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCitiesByCounty(county);
    }, [county]);

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            notify.error('Location is not supported on this device');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const opts = { shouldValidate: true, shouldDirty: true };
                setValue('latitude', coords.latitude.toFixed(6), opts);
                setValue('longitude', coords.longitude.toFixed(6), opts);
                setLocating(false);
            },
            () => {
                notify.error('Could not get your location. Check your browser permissions.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <Field label="County" htmlFor="county" error={errors.county?.message}>
                    <SelectInput
                        id="county"
                        options={counties}
                        disabled={loadingCounties}
                        invalid={!!errors.county}
                        {...register('county', { 
                            onChange: () => {
                                setValue('city', '');
                                setCities([]);
                            } 
                        })}
                    />
                </Field>
                <Field label="City" htmlFor="city" error={errors.city?.message}>
                    <SelectInput
                        id="city"
                        options={cities}
                        disabled={!county || loadingCities}
                        invalid={!!errors.city}
                        {...register('city')}
                    />
                </Field>
            </div>

            <Field label="Address Line" htmlFor="addressLine" error={errors.addressLine?.message}>
                <input
                    id="addressLine"
                    placeholder="e.g Broad Street"
                    autoComplete="street-address"
                    aria-invalid={!!errors.addressLine}
                    className={inputClass(!!errors.addressLine)}
                    {...register('addressLine')}
                />
            </Field>

            <Field label="Timezone" htmlFor="timezone" error={errors.timezone?.message}>
                <SelectInput id="timezone" options={TIMEZONES} invalid={!!errors.timezone} {...register('timezone')} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Longitude" htmlFor="longitude" error={errors.longitude?.message}>
                    <input
                        id="longitude"
                        inputMode="decimal"
                        placeholder="Longitude"
                        aria-invalid={!!errors.longitude}
                        className={inputClass(!!errors.longitude)}
                        {...register('longitude')}
                    />
                </Field>
                <Field label="Latitude" htmlFor="latitude" error={errors.latitude?.message}>
                    <input
                        id="latitude"
                        inputMode="decimal"
                        placeholder="Latitude"
                        aria-invalid={!!errors.latitude}
                        className={inputClass(!!errors.latitude)}
                        {...register('latitude')}
                    />
                </Field>
            </div>

            <div className="flex justify-center">
                <button type="button" onClick={useCurrentLocation} disabled={locating} className={`${outlineBtn} h-14 px-10 text-base`}>
                    <MapPin className="h-5 w-5" aria-hidden />
                    {locating ? 'Locating…' : 'Use my current location'}
                </button>
            </div>
        </div>
    );
}