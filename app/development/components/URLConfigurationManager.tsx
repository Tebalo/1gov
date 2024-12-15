"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveIcon, RefreshCw } from 'lucide-react';

type Environment = 'dev' | 'uat' | 'prod';

interface URLConfig {
  apiUrl: string;
  invUrl: string;
  cpdUrl: string;
  appealUrl: string;
  renewalUrl: string;
  revocationUrl: string;
  restorationUrl: string;
  licUrl: string;
  authUrl: string;
  emailauthUrl: string;
  iamURL: string;
  otpUrl: string;
  DeTokenizeUrl: string;
  validateUrl: string;
  cmsUrl: string;
}

const defaultUrls: Record<Environment, URLConfig> = {
    dev: {
      apiUrl: 'http://10.0.25.164:8080/trls-80',
      invUrl: 'http://10.0.25.164:8084/trls-84',
      cpdUrl: 'http://10.0.25.164:8086/trls-86',
      appealUrl: 'http://10.0.25.164:8087/trls-87',
      renewalUrl: 'http://10.0.25.164:8088/trls-88',
      revocationUrl: 'http://10.0.25.164:8090/trls-90',
      restorationUrl: 'http://10.0.25.164:8088/trls-94',
      licUrl: 'http://66.179.253.57:8081/api',
      authUrl: 'https://gateway-cus-acc.gov.bw/auth/login/sms',
      emailauthUrl: 'https://gateway-cus-acc.gov.bw/auth/login',
      iamURL: 'https://gateway-cus-acc.gov.bw',
      otpUrl: 'https://dev-gateway.example.com/auth/login/sms',
      DeTokenizeUrl: 'https://gateway-cus-acc.gov.bw/auth/validate-token?token=',
      validateUrl: 'https://gateway-cus-acc.gov.bw/auth/validate/otp',
      cmsUrl: 'http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_001/',
    },
    uat: {
      apiUrl: 'http://uat.example.com/trls-80',
      invUrl: 'http://uat.example.com/trls-84',
      cpdUrl: 'http://uat.example.com/trls-86',
      appealUrl: 'http://uat.example.com/trls-87',
      renewalUrl: 'http://uat.example.com/trls-88',
      revocationUrl: 'http://uat.example.com/trls-90',
      restorationUrl: 'http://uat.example.com/trls-94',
      licUrl: 'http://uat.example.com/api',
      authUrl: 'https://uat-gateway.example.com/auth/login/sms',
      emailauthUrl: 'https://uat-gateway.example.com/auth/login',
      iamURL: 'https://uat-gateway.example.com',
      otpUrl: 'https://uat-gateway.example.com/auth/login/sms',
      DeTokenizeUrl: 'https://uat-gateway.example.com/auth/validate-token?token=',
      validateUrl: 'https://uat-gateway.example.com/auth/validate/otp',
      cmsUrl: 'http://uat.example.com/download/MESD_006_08_001/',
    },
    prod: {
      apiUrl: 'http://prod.example.com/trls-80',
      invUrl: 'http://prod.example.com/trls-84',
      cpdUrl: 'http://prod.example.com/trls-86',
      appealUrl: 'http://prod.example.com/trls-87',
      renewalUrl: 'http://prod.example.com/trls-88',
      revocationUrl: 'http://prod.example.com/trls-90',
      restorationUrl: 'http://prod.example.com/trls-94',
      licUrl: 'http://prod.example.com/api',
      authUrl: 'https://gateway.example.com/auth/login/sms',
      emailauthUrl: 'https://gateway.example.com/auth/login',
      iamURL: 'https://gateway.example.com',
      otpUrl: 'https://gateway.example.com/auth/login/sms',
      DeTokenizeUrl: 'https://gateway.example.com/auth/validate-token?token=',
      validateUrl: 'https://gateway.example.com/auth/validate/otp',
      cmsUrl: 'http://prod.example.com/download/MESD_006_08_001/',
    }
  };

const URLConfigurationManager = () => {
  const [selectedEnv, setSelectedEnv] = useState<Environment>('dev');
  const [urls, setUrls] = useState<Record<Environment, URLConfig>>(defaultUrls);
  const [isEditing, setIsEditing] = useState(false);

  const handleUrlChange = (key: keyof URLConfig, value: string) => {
    setUrls(prev => ({
      ...prev,
      [selectedEnv]: {
        ...prev[selectedEnv],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving URLs for environment:', selectedEnv, urls[selectedEnv]);
    setIsEditing(false);
  };

  const handleReset = () => {
    setUrls(prev => ({
      ...prev,
      [selectedEnv]: defaultUrls[selectedEnv]
    }));
  };

  const urlCategories = {
    'Core Services': ['apiUrl', 'invUrl', 'cpdUrl', 'appealUrl', 'renewalUrl', 'revocationUrl', 'restorationUrl'],
    'Authentication': ['authUrl', 'emailauthUrl', 'iamURL', 'otpUrl', 'DeTokenizeUrl', 'validateUrl'],
    'Other Services': ['licUrl', 'cmsUrl']
  };

  const formatUrlName = (url: string): string => {
    return url
      .replace(/URL|Url|url/, '')
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>URL Configuration Manager</span>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={!isEditing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Edit URLs'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dev" onValueChange={(value) => setSelectedEnv(value as Environment)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dev">Development</TabsTrigger>
            <TabsTrigger value="uat">UAT</TabsTrigger>
            <TabsTrigger value="prod">Production</TabsTrigger>
          </TabsList>

          {(['dev', 'uat', 'prod'] as const).map((env) => (
            <TabsContent key={env} value={env}>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-8 pr-4">
                  {Object.entries(urlCategories).map(([category, urlKeys]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-4">{category}</h3>
                      <div className="space-y-4">
                        {urlKeys.map((urlKey) => (
                          <div key={urlKey} className="space-y-2">
                            <Label htmlFor={`${env}-${urlKey}`}>
                              {formatUrlName(urlKey)}
                            </Label>
                            <Input
                              id={`${env}-${urlKey}`}
                              value={urls[env][urlKey as keyof URLConfig]}
                              onChange={(e) => handleUrlChange(urlKey as keyof URLConfig, e.target.value)}
                              disabled={!isEditing}
                              className="font-mono text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default URLConfigurationManager;