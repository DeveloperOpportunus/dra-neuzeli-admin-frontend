import { NavLink } from "@/components/NavLink";
import { Home, Users, UserPlus, BarChart3 } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { title: "Painel", icon: Home, path: "/painel" },
    { title: "Pacientes", icon: Users, path: "/pacientes" },
    { title: "Novo Paciente", icon: UserPlus, path: "/pacientes/novo" },
    { title: "Dashboard", icon: BarChart3, path: "/dashboard" },
  ];

  return (
    <aside className="w-64 bg-sidebar min-h-screen shadow-elevated flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-xl text-sidebar-accent-foreground font-bold">NR</span>
          </div>
          <div>
            <h2 className="text-sidebar-foreground font-bold text-lg">Dra. Neuzeli</h2>
            <p className="text-sidebar-foreground/80 text-sm">Rougemont</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/90 hover:bg-sidebar-accent transition-all duration-200"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-soft"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-sidebar-foreground/60 text-xs text-center">
          Sistema de Gestão de Pacientes v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
