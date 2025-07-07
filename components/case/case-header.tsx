import { Tags } from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

interface CaseHeaderProps {
    caseId: string;
    caseTitle: string;
    caseStatus: string;
    caseType: string;
    caseCreatedDate: string;
    caseCreatedBy: string;
    caseAssignedTo: string;
    actions: React.ReactNode;
    auditTrail: React.ReactNode;
    icon: React.ReactNode;
}

const CaseHeader: React.FC<CaseHeaderProps> = ({
    caseId,
    caseTitle,
    caseStatus,
    caseType,
    caseCreatedDate,
    caseCreatedBy,
    caseAssignedTo,
    auditTrail,
    actions,
    icon
}) => {
    return(
        <Card className="hover:shadow-md transition-shadow duration-200 mb-4 border-b-cyan-500">
            <CardHeader className="">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        {/* <div className="md:block hidden">
                            {icon}
                        </div>   */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{caseId}</h2>
                            <h3 className="text-sm text-sky-500">{caseTitle}</h3>
                            <div className="md:flex md:items-center md:space-x-4 mt-2">
                                <div className='flex items-center space-x-2 bg-slate-500/10 p-1 rounded-md'>
                                    <Tags className="w-4 h-4 text-gray-500" />
                                    <p className='text-purple-500 font-semibold text-sm'>{caseStatus}</p>
                                </div>
                            </div>
                            <div className="md:block hidden">                                
                                <span className='text-sm text-gray-500'>Created by {caseCreatedBy} on {caseCreatedDate ? new Date(caseCreatedDate).toLocaleDateString().toString(): ''}</span>
                            </div>
                            <div className="md:block hidden">                                
                                <span className='text-sm text-gray-500'>The record is currently locked by Bopaki Tebalo</span>
                                <Button variant={'link'}>Release Lock</Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {actions}
                        {auditTrail}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default CaseHeader;