import { BellIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
interface StatusChange {
    newStatus: string;
    timestamp: Date;
    changedBy: string;
}

interface StatusChangeProps {
    statusHistory: StatusChange[];
}


const statusHistory1: React.FC<StatusChangeProps> = ({statusHistory}) => {
    return(
        <div>
            <h2>Status Change History</h2>
            <ul>
                {statusHistory.map((change, index) => (
                    <li key={index}>

                        <p><strong>Status:</strong> {change.newStatus}</p>
                        <p><strong>Date:</strong> {change.timestamp.toLocaleString()}</p>
                        {change.changedBy && <p><strong>Changed by:</strong>{change.changedBy}</p>}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const notifications = [
    {
      title: "Your call has been confirmed.",
      description: "1 hour ago",
    },
    {
      title: "You have a new message!",
      description: "1 hour ago",
    },
    {
      title: "Your subscription is expiring soon!",
      description: "2 hours ago",
    },
  ]

 const statuses = [
    { newStatus: "Pending-Review", timestamp: new Date('2023-10-31T10:20:00'), changedBy: 'Oaitse Segala' },
    { newStatus: "Pending-Screening", timestamp: new Date('2023-11-02T16:05:00'), changedBy: 'Masego Sam' },
    { newStatus: "Needs Additional Info", timestamp: new Date('2023-11-05T09:12:00'), changedBy: 'System' } // Example of a system-generated change
]

type CardProps = React.ComponentProps<typeof Card>

export function statusHistory({ className, ...props }: CardProps) {
    return(
        <div className={cn("w-full", className)} {...props}>
        <CardHeader>
          <CardTitle>Status change history</CardTitle>
          <CardDescription>The record has 3 status changes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {statuses.map((status, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {status.newStatus}
                  </p>
                  <div className="flex space-x-5">
                  <p className="text-sm text-muted-foreground">
                    Updated {status.timestamp.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                   - {status.changedBy}
                  </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        {/**<CardFooter>
          <Button className="w-full bg-sky-400">
            <CheckIcon className="mr-2 h-4 w-4" /> Add comment
          </Button>
        </CardFooter>*/}
      </div>
    )
}
export default statusHistory;