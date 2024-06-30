import { Logo } from "./Logo";
import { getSession} from "../auth/auth";
import SidebarNav from "./SidebarNav";
import NavUtils from "./NavComponents/NavUtilis";

async function getRole() {
    const session = await getSession();
    let userRole = '';
    const roles = ['REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', 'MANAGER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'ADMIN'];

    for(const role of session?.user?.realm_access?.roles || []){
        if(roles.includes(role)){
            userRole = role;
            break;
        }
    }
    return userRole;
}

const DynamicSidebar: React.FC = async ({}) => {
    const session = await getSession();

    const userRole = await getRole()
    const username = session?.user?.name
    return (
        <aside id="dynamic-sidebar" className=" top-0 left-0 lg:w-52 shadow-xl transition-transform -translate-x-full sm:translate-x-0 hidden md:block" aria-label="Sidebar">
            <div className="h-screen px-0 bg-sky-400 shadow-lg rounded-r-lg">
                <div className="md:rounded-r-lg rounded-b-lg bg-white lg:p-5 md:p-1 lg:w-48 md:w-36">
                    <Logo
                    width={350}
                    height={350}
                    />
                </div>
                <div className="my-10 ml-5">
                    <SidebarNav userRole={userRole}                    
                    />
                </div>
                <div className="absolute bottom-0 w-full border-t bg-sky-400">
                        <NavUtils userRole={username}/>
                </div>
            </div>
        </aside>
    );
}

export default DynamicSidebar;