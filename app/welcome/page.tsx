"use client"
import Image from "next/image";
import { Login } from "../components/Login";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Email } from "./components/email-login";
import { OneGovID } from "./components/one-gov";
  
export default function Welcome() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleToggleLogin = () => {
        setIsLoginOpen(!isLoginOpen);
    };
    const handleCloseLogin = () => {
        setIsLoginOpen(false);
    }
    return (
        <main className="bg-sky-400 w-full h-screen">
            <div className="flex md:justify-start justify-center md:py-10 py-0">
                <div className="md:rounded-r-lg rounded-b-lg bg-white p-5 md:w-72 w-48">
                    <Image
                        src="/Code-of-Arms-colour.png"
                        width={350}
                        height={350}
                        alt="Picture of the coat of arms"
                    />
                </div>
            </div>
            <div className="flex justify-center md:justify-start">
                <div className="grid grid-cols-1 md:grid-cols-1 md:m-10 md:justify-start justify-center">
                    <div className="flex justify-center md:justify-start">
                        <h1 className="text-4xl font-bold">Welcome to</h1>
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <div className="flex md:rounded-r-lg rounded-b-l p-5 md:hidden w-44">
                            <Image
                                src="/main-icon.png"
                                width={350}
                                height={350}
                                alt="Picture of the coat of arms"
                            />
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col items-center md:items-start my-2">
                        <div className="flex md:text-white text-black text-5xl justify-center md:justify-start md:w-fit">
                            <h2 className="font-bold">Bo</h2>
                            <h2 className="font-light md:mr-2">tepco</h2>
                        </div>
                            <h2 className="font-bold text-5xl md:text-white text-black md:w-fit">e-Services Portal</h2> 
                        </div>
                </div>
            </div>
            <div className="flex md:justify-end justify-center mb-5">
                <div className="rounded-lg bg-teal-800 hidden"></div>
                <div className="flex space-x-1 md:space-x-10 md:pr-10">
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="px-10 py-4">Login</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Login</DialogTitle>
                            <DialogDescription>
                                Complete the form below to access your account.
                            </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="email" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="email">Email</TabsTrigger>
                                    <TabsTrigger value="onegov">IGov ID</TabsTrigger>
                                </TabsList>
                                <TabsContent value="email">
                                    <Email/>
                                </TabsContent>
                                <TabsContent value="onegov">
                                    <OneGovID/>
                                </TabsContent>
                            </Tabs> 
                            <DialogFooter>
                                {/* <Button type="submit">Submit</Button> */}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <button 
                    type="button" 
                    data-modal-target="crud-modal"
                    data-modal-toggle="crud-modal"
                    onClick={handleToggleLogin}
                    className="text-black bg-white hover:shadow-md focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-4 me-2 mb-2 focus:outline-none"
                    >
                        Login
                    </button>
                    <button 
                    type="button" 
                    className="text-white bg-gray-700 hover:shadow-md focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-4 me-2 mb-2 focus:outline-none"
                    >
                        Register
                    </button>
                    
                </div>
            </div>

            <Login isOpen={isLoginOpen} onClose={handleCloseLogin}/>
            <div className="flex flex-col md:hidden items-center">
                <button type="button" className="text-white bg-sky-300 hover:bg-sky-350 w-fit hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-base px-10 py-1.5 text-center me-2 mb-2">Get In Touch</button>
                <p className="text-sm">@ 2024 Botepco Portal v4.0.0</p>
            </div>
        </main>
    );
}