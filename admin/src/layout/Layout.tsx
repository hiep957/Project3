import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";



interface Props {
    children: React.ReactNode;
  }
export const Layout = ({ children }: Props) =>{
    return (
        <div className="">
            <Header></Header>
            <div className="container mx-auto flex flex-row h-screen">
                <Sidebar></Sidebar>
                <div>{children}</div>
            </div>
            <div>footer</div>
        </div>
    )
}