import { notFound } from "next/navigation";
import { BUSINESSES } from "@/lib/data";
import { getBusinessDetails } from "@/lib/details";
import BusinessProfile from "./components/business-page";

export function generateStaticParams() {
    return BUSINESSES.map((b) => ({ id: b.id }));
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const business = getBusinessDetails(id);
    if (!business) notFound();

    return <BusinessProfile business={business} />;
}