import { useState } from 'react';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Server, Shield, Database } from "lucide-react";
import { adminAuthUrl, AdminDeTokenizeUrl, apiUrl, appealUrl, cpdUrl, deltaCategoryUrl, invUrl, renewalUrl, restorationUrl, revocationUrl, studentTeacherUrl } from '@/app/lib/store';

const ApiEndpointsCard = () => {
    const [environment, setEnvironment] = useState<"development" | "production">("development");
    
    // Base URLs based on environment
    const baseUrls = {
        development: {
            trls: 'http://10.0.25.164:8080',
            iam: 'https://gateway-cus-acc.gov.bw',
            cms: 'http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_001/'
        },
        production: {
            trls: 'http://10.0.26.164:8080',
            iam: 'https://gateway-cus.gov.bw',
            cms: 'http://reg-ui.gov.bw:8080/download/MESD_006_08_001/'
        }
    };
    
    // Current base URLs
    const currentBaseUrls = baseUrls[environment];
    
    // API endpoints
    const apiEndpoints = {
        trls: [
            { name: "Registration API", url: `${apiUrl}` },
            { name: "Inventigation API", url: `${invUrl}` },
            { name: "CPD API", url: `${cpdUrl}` },
            { name: "Appeal API", url: `${appealUrl}` },
            { name: "Renewal API", url: `${renewalUrl}` },
            { name: "Revocation API", url: `${revocationUrl}` },
            { name: "Restoration API", url: `${restorationUrl}` },
            { name: "Change of Category API", url: `${deltaCategoryUrl}` },
            { name: "Student Teacher API", url: `${studentTeacherUrl}` }
        ],
        iam: [
            { name: "DeTokenize API", url: `${currentBaseUrls.iam}/auth/validate-token?token=` },
            { name: "Validate OTP API", url: `${currentBaseUrls.iam}/v2/auth/validate/otp` },
            { name: "SMS Auth API", url: `${currentBaseUrls.iam}/v2/auth/login/sms` },
            { name: "Email Auth API", url: `${currentBaseUrls.iam}/auth/login` }
        ],
        admin: [
            { name: "SMS Auth API", url: `${adminAuthUrl}`},
            { name: "DeTokenize API", url: `${AdminDeTokenizeUrl}` }
        ],
        cms: [
            { name: "CMS API", url: `${currentBaseUrls.cms}` }
        ]
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">API Endpoints</CardTitle>
                        <CardDescription>Configure system API endpoints</CardDescription>
                    </div>
                    <Server className="h-5 w-5 text-blue-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Environment</p>
                            <p className="text-sm text-muted-foreground">Toggle between development and production</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-green-500" />
                            <Switch 
                                checked={environment === "production"}
                                onCheckedChange={(checked) => setEnvironment(checked ? "production" : "development")}
                            />
                            <Globe className="h-4 w-4 text-blue-500" />
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-6 grid md:grid-cols-2 grid-cols-1 gap-6">
                        {/* TRLS APIs */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Server className="h-4 w-4 text-blue-500" />
                                <Label className="font-semibold">TRLS Services</Label>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pl-6">
                                {apiEndpoints.trls.map((endpoint, index) => (
                                    <div key={index} className="flex flex-col">
                                        <span className="text-sm font-medium">{endpoint.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{endpoint.url}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* IAM APIs */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-amber-500" />
                                <Label className="font-semibold">IAM Services</Label>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pl-6">
                                {apiEndpoints.iam.map((endpoint, index) => (
                                    <div key={index} className="flex flex-col">
                                        <span className="text-sm font-medium">{endpoint.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{endpoint.url}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 pl-6">
                                <span className="text-xs text-blue-500">Current Version: v2.50.99</span>
                            </div>
                        </div>

                        {/* ADMIN APIs */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-red-500" />
                                <Label className="font-semibold">ADMIN IAM Services</Label>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pl-6">
                                {apiEndpoints.admin.map((endpoint, index) => (
                                    <div key={index} className="flex flex-col">
                                        <span className="text-sm font-medium">{endpoint.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{endpoint.url}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* CMS APIs */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Database className="h-4 w-4 text-green-500" />
                                <Label className="font-semibold">CMS Services</Label>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pl-6">
                                {apiEndpoints.cms.map((endpoint, index) => (
                                    <div key={index} className="flex flex-col">
                                        <span className="text-sm font-medium">{endpoint.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{endpoint.url}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ApiEndpointsCard;