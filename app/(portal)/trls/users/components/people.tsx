"use client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export function People() {
  return (
    <>
    <Button>Create</Button>
    <Table>
        <TableCaption>A list of users.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="">Name</TableHead>
                <TableHead className="">Persona</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Bopaki Tebalo</TableCell>
                <TableCell className="">Registration officer</TableCell>
                </TableRow>
            </TableBody>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Leapetswe Morwe</TableCell>
                <TableCell className="">Senior Registration officer</TableCell>
                </TableRow>
            </TableBody>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Selele Kotu</TableCell>
                <TableCell className="">Manager</TableCell>
                </TableRow>
            </TableBody>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Mothusi Tladi</TableCell>
                <TableCell className="">Director</TableCell>
                </TableRow>
            </TableBody>
    </Table>
    </>
  )
}
