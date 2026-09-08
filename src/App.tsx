import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import RendezVous from "./pages/RendezVous";
import Clientes from "./pages/Clientes";
import Prestations from "./pages/Prestations";
import Equipe from "./pages/Equipe";
import FichePublique from "./pages/FichePublique";
import Paiements from "./pages/Paiements";
import Messages from "./pages/Messages";
import Marketing from "./pages/Marketing";
import Statistiques from "./pages/Statistiques";
import Parametres from "./pages/Parametres";
import { Modal, NewRdvForm } from "./components";
import { useAuth } from "./auth/AuthContext";
import Agency from "./pages/Agency";
import Activate from "./pages/Activate";

type AuthMode = "login" | "signup" | "onboarding";

export default function App() {
  const { ready, authenticated, logout, isAgencyAdmin } = useAuth();
  const [auth, setAuth] = useState<AuthMode>("login");
  const [activateToken, setActivateToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("activate");
  });
  const [page, setPage] = useState("dashboard");
  const [settingsTab, setSettingsTab] = useState("general");
  const [rdvOpen, setRdvOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 1100);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = (id: string) => {
    if (id === "settings") setSettingsTab("general");
    setPage(id);
  };

  const clearActivate = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("activate");
    window.history.replaceState({}, "", url.pathname + url.search);
    setActivateToken(null);
    setPage("dashboard");
  };

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-aya-bg text-sm text-aya-text">
        Chargement de la session…
      </div>
    );
  }

  if (activateToken && !authenticated) {
    return <Activate token={activateToken} onDone={clearActivate} onCancel={clearActivate} />;
  }

  if (!authenticated) {
    return (
      <Auth
        mode={auth}
        onMode={(m) => setAuth(m)}
        onEnter={() => {
          setPage("dashboard");
        }}
      />
    );
  }

  if (isAgencyAdmin) {
    return <Agency />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-aya-bg">
      <Sidebar
        active={page}
        setActive={go}
        collapsed={collapsed}
        onPremium={() => {
          setSettingsTab("plan");
          setPage("settings");
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {page === "dashboard" && <Dashboard onNavigate={go} onNewRdv={() => setRdvOpen(true)} />}
        {page === "agenda" && <Agenda onNewRdv={() => setRdvOpen(true)} />}
        {page === "rdv" && <RendezVous onNewRdv={() => setRdvOpen(true)} />}
        {page === "clientes" && <Clientes onMessage={() => go("messages")} />}
        {page === "presta" && <Prestations />}
        {page === "equipe" && <Equipe onAgenda={() => go("agenda")} />}
        {page === "fiche" && <FichePublique />}
        {page === "paiements" && <Paiements />}
        {page === "messages" && <Messages />}
        {page === "marketing" && <Marketing />}
        {page === "stats" && <Statistiques />}
        {page === "settings" && (
          <Parametres
            key={settingsTab}
            initialTab={settingsTab}
            onLogout={() => {
              logout();
              setAuth("login");
            }}
          />
        )}
      </div>
      {rdvOpen && (
        <Modal title="Nouveau rendez-vous" onClose={() => setRdvOpen(false)}>
          <NewRdvForm onClose={() => setRdvOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
