import type {ReactNode} from "react";

export function AuthShell({children}:{children:ReactNode}){
 return <div className="athena-auth-screen">
  <section className="athena-auth-card" aria-label="Tài khoản Athena Studio">{children}</section>
 </div>;
}
