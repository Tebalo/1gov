import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
export function OneGovID(){
    return(
        <>
            <div className="grid gap-4 py-4">
                <div className="">
                        <Label htmlFor="email" className="text-right">
                            1Gov ID
                        </Label>
                        <Input id="email" type="text" className="col-span-3" />
                    </div>
                    <div className="">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input id="password" type="password" className="col-span-3" />
                    </div>
            </div>
        </>
    )
}