import BusinessProfile from './components/business-profile';

// The route folder is [slug]; the API slug is the identifier.
export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <BusinessProfile slug={slug} />;
}