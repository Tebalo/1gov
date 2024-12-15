import { PageTitle } from "@/app/components/PageTitle";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import RenewalContent from "./components/renewal";
import RevocationContent from "./components/revocation";

export default async function Page() {
    return (
        <>
            <div className="overflow-auto h-screen rounded-lg p-10">
                <div className="mb-5">
                    <PageTitle Title="RECORD UI TESTING USING DUMMY DATA"/>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Renewal View</AccordionTrigger>
                        <AccordionContent>
                            <RenewalContent/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Revocation View</AccordionTrigger>
                        <AccordionContent>
                            <RevocationContent/>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
}