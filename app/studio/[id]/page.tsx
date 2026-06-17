import StudioWorkspace from "@/components/studio/StudioWorkspace";

export async function generateStaticParams() {
    return [
        { id: "1" },
        { id: "2" },
        { id: "test" },
        { id: "12345" },
    ];
}

export default async function StudioDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: studioId } = await params;

    return <StudioWorkspace studioId={studioId} />;
}
