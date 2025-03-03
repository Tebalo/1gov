'use client'
import { Button } from "@/components/ui/button";
import { useTransition } from "react"
import { refreshRegistrations } from "./refresh-registrations";

export default function RefreshButton() {
    const [isPending, startTransition] = useTransition();

    return (
        <Button
        className="bg-secondary text-black hover:bg-gray-300"
        disabled={isPending}
        onClick={() => {
            startTransition(async () => {
                const result = await refreshRegistrations();
                if(result.success){
                    alert(result.message)
                } else {
                    alert(result.error)
                }
            })
        }}
        >
            {isPending ? 'Refreshing...' : 'Refresh'}
        </Button>
    )
}