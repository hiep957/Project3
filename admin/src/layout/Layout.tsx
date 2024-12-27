import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";



interface Props {
    children: React.ReactNode;
  }
export const Layout = ({ children }: Props) =>{
    return (
        <div className="">
            <Header></Header>
            <div className="container mx-auto flex">
                <Sidebar></Sidebar>
                <div className="flex-1 bg-gray-100">{children}</div>
            </div>
     
        </div>
    )
}