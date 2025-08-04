import { Loader2 } from "lucide-react"
const LoadingSkeleton=()=>{
    return(
    <div className="w-full h-[calc(100vh-4rem)] bg-background/50flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
            <div className="text-center space-y-1">
                <h3 className="font-medium">Loading your content</h3>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
        </div>
    </div>
    );
}

export default function Loading() {
    return <LoadingSkeleton />
  }