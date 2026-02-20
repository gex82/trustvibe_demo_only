import { useAuth } from "../../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Maria", sublabel: "Customer", email: "maria.rodriguez@trustvibe.test", password: "DemoCustomer!123", color: "bg-teal-500" },
  { label: "Juan", sublabel: "Contractor", email: "juan.services@trustvibe.test", password: "DemoContractor!123", color: "bg-blue-500" },
  { label: "Admin", sublabel: "Admin", email: "admin@trustvibe.test", password: "DemoAdmin!123", color: "bg-purple-500" },
];

export default function DevSwitcher() {
  const { login, currentUser } = useAuth();

  return (
    <div
      className="fixed z-50 flex flex-col gap-2"
      style={{ bottom: 32, right: 32 }}
    >
      <div
        className="bg-black/80 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-2"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      >
        <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest text-center mb-1">
          Switch Role
        </p>
        {DEMO_ACCOUNTS.map((acc) => {
          const isActive = currentUser?.email === acc.email;
          return (
            <button
              key={acc.email}
              onClick={() => login(acc.email, acc.password)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all pressable ${
                isActive
                  ? "bg-white/20 ring-1 ring-white/30"
                  : "hover:bg-white/10"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full ${acc.color} flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0`}
              >
                {acc.label[0]}
              </div>
              <div>
                <div className="text-white font-semibold text-[12px] leading-none">
                  {acc.label}
                </div>
                <div className="text-white/50 text-[10px] mt-0.5">{acc.sublabel}</div>
              </div>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
