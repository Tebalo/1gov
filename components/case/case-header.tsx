import { Cross, Tags, Undo2, UserMinus, UserX } from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

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
    resendPayment?: React.ReactNode;
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
    resendPayment,
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
                            {caseAssignedTo && (
                                <div className="md:block hidden">                                
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                            Assigned to 
                                            <span className="italic font-medium text-gray-700">{caseAssignedTo}</span>
                                        </span>
                                        <Link href={`/trls/work/teacher/${caseId.substring(3)}?assigned_to=`}>
                                            <Button 
                                                variant="link" 
                                                size="sm"
                                                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                                Unassign
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <div className="md:block hidden">                                
                                <span className='text-sm text-gray-500'>Created by {caseCreatedBy} on {caseCreatedDate ? new Date(caseCreatedDate).toLocaleDateString().toString(): ''}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 flex-row">
                        {actions}
                        {auditTrail}
                        {resendPayment}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default CaseHeader;