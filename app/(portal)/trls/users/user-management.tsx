"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Persona } from "./components/persona"
import { People } from "./components/people"
import { Portals } from "./components/portals"

export function UserManagement() {
  return (
    <>
    <Tabs defaultValue="persona" className="w-full">
        <TabsList>
            <TabsTrigger value="persona">Personas</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="portals">Portals & Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="persona"><Persona/></TabsContent>
        <TabsContent value="people"><People/></TabsContent>
        <TabsContent value="portals"><Portals/></TabsContent>
    </Tabs>
    </>
  )
}
