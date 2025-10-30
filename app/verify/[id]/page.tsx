import { Card, CardContent } from "@/components/ui/card";
import VerifyRegistrationStatus from "../component/verify-registration";


export default async function Verify({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <main className="min-h-auto bg-gray-50 m-2 md:m-10">
      <Card className="shadow-sm border-gray-200">
        <CardContent className="pt-6">
          <VerifyRegistrationStatus userId={id} />
        </CardContent>
      </Card>
    </main>
  );
}