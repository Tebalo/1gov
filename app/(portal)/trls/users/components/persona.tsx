"use client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export function Persona() {
  return (
    <>
    <Button>Add</Button>
    <Table>
        <TableCaption>A list of personas.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="">Persona</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Users</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Registration officer</TableCell>
                <TableCell>Registration Portal</TableCell>
                <TableCell className="text-right">4 users</TableCell>
                </TableRow>
            </TableBody>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Senior Registration officer</TableCell>
                <TableCell>Senior Registration Portal</TableCell>
                <TableCell className="text-right">2 users</TableCell>
                </TableRow>
            </TableBody>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Manager</TableCell>
                <TableCell>Manager Portal</TableCell>
                <TableCell className="text-right">1 users</TableCell>
                </TableRow>
            </TableBody>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">Director</TableCell>
                <TableCell>Director Portal</TableCell>
                <TableCell className="text-right">1 users</TableCell>
                </TableRow>
            </TableBody>
    </Table>
    </>
  )
}
