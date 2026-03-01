import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "../utils/api";
import { LogOut, Plus, Pencil, Trash2, Save, X, ChevronDown, Layout } from "lucide-react";
import * as Icons from "lucide-react";
import FileUpload from "../components/FileUpload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Tab = "home" | "services" | "employees" | "projects" | "industries" | "stats" | "contacts" | "messages" | string;

interface ServiceRow { id?: string; _id?: string; icon: string; title: string; description: string; sort_order: number; status?: string; data?: Record<string, string>; }
interface EmployeeRow { id?: string; _id?: string; name: string; position: string; photo_url: string | null; sort_order: number; status?: string; data?: Record<string, string>; }
interface ProjectRow { id?: string; _id?: string; title: string; description: string; image_url: string | null; link: string | null; sort_order: number; status?: string; serviceId?: string; data?: Record<string, string>; }
interface IndustryRow { id?: string; _id?: string; icon: string; title: string; sort_order: number; status?: string; data?: Record<string, string>; }
interface StatRow { id?: string; _id?: string; value: string; label: string; sort_order: number; status?: string; data?: Record<string, string>; }
interface ContactRow { id?: string; _id?: string; title?: string; description?: string; address: string; phone: string; whatsapp: string; email: string; status?: string; data?: Record<string, string>; }
interface CustomTab { id?: string; _id?: string; name: string; slug: string; icon: string; fields: { name: string; type: string }[]; }
interface CustomItemRow { id?: string; _id?: string; tabSlug: string; title: string; data: Record<string, string>; image: string | null; status?: string; sort_order: number; }

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("home");
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [newTabIcon, setNewTabIcon] = useState("Layout");
  const [newTabFields, setNewTabFields] = useState<{ name: string; type: string }[]>([{ name: "Description", type: "textarea" }]);

  const fetchCustomTabs = async () => {
    const data = await api.get("custom-tabs");
    if (data) setCustomTabs(data);
  };

  useEffect(() => {
    fetchCustomTabs();
  }, []);

  const addCustomTab = async () => {
    if (!newTabName) return;
    const slug = newTabName.toLowerCase().replace(/\s+/g, '-');
    await api.post("custom-tabs", { name: newTabName, slug, icon: newTabIcon, fields: newTabFields });
    setNewTabName("");
    setNewTabIcon("Layout");
    setNewTabFields([{ name: "Description", type: "textarea" }]);
    setIsAddingTab(false);
    fetchCustomTabs();
  };

  const deleteCustomTab = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" tab and ALL its items?`)) return;
    await api.delete("custom-tabs", id);
    setTab("services");
    fetchCustomTabs();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="font-display text-xl font-bold text-foreground">Saltware Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground italic">Welcome, {user?.name || "Admin"}</span>
            <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {(["home", "services", "employees", "projects", "industries", "stats", "contacts", "messages"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
            >
              {t}
            </button>
          ))}
          {customTabs.slice(0, 3).map((ct) => (
            <div key={ct.slug} className="group relative">
              <button
                onClick={() => setTab(ct.slug)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === ct.slug ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
              >
                {ct.name}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); deleteCustomTab(ct.id || ct._id || "", ct.name); }}
                className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white group-hover:flex"
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {customTabs.length > 3 && (
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${customTabs.slice(3).some(ct => ct.slug === tab) ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                More Sections <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 overflow-hidden rounded-xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
                {customTabs.slice(3).map((ct) => (
                  <DropdownMenuItem key={ct.slug} className="flex items-center justify-between gap-2 p-0">
                    <button
                      onClick={() => setTab(ct.slug)}
                      className="flex-1 px-3 py-2 text-left text-sm font-medium hover:text-primary"
                    >
                      {ct.name}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCustomTab(ct.id || ct._id || "", ct.name); }}
                      className="mr-2 h-6 w-6 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors flex"
                    >
                      <X size={12} />
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button
            onClick={() => setIsAddingTab(true)}
            className="rounded-lg border-2 border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {isAddingTab && (
          <div className="mb-8 rounded-xl border-2 border-primary/20 bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-xl font-bold text-foreground">Design Your New Section</h3>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">Dynamic Builder</div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <Field
                  label="What do you want to call this section?"
                  value={newTabName}
                  onChange={setNewTabName}
                  placeholder="e.g. FAQs, Client Reviews, Our Values"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Additional Text Boxes</label>
                    <span className="text-[10px] text-muted-foreground italic">(Title, Image, Order & Status are already included)</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {newTabFields.map((field, idx) => (
                      <div key={idx} className="flex flex-col gap-2 rounded-lg border border-border/50 bg-secondary/20 p-3">
                        <div className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            value={field.name}
                            placeholder="Box Name (e.g. Price)"
                            onChange={(e) => {
                              const updated = [...newTabFields];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setNewTabFields(updated);
                            }}
                          />
                          <button
                            onClick={() => setNewTabFields(newTabFields.filter((_, i) => i !== idx))}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Box Type:</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { const u = [...newTabFields]; u[idx] = { ...u[idx], type: 'text' }; setNewTabFields(u); }}
                              className={`rounded px-2 py-1 text-[10px] font-bold transition-colors ${field.type === 'text' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                              SINGLE LINE
                            </button>
                            <button
                              onClick={() => { const u = [...newTabFields]; u[idx] = { ...u[idx], type: 'textarea' }; setNewTabFields(u); }}
                              className={`rounded px-2 py-1 text-[10px] font-bold transition-colors ${field.type === 'textarea' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                              PARAGRAPH
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setNewTabFields([...newTabFields, { name: "", type: "text" }])}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 p-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-all"
                  >
                    <Plus size={14} /> Add Another Text Box
                  </button>
                </div>

                <SelectField label="Choose an Icon" value={newTabIcon} onChange={setNewTabIcon} options={AVAILABLE_ICONS} showIcons />
              </div>

              <div className="rounded-xl bg-secondary/30 p-6">
                <h4 className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Form Preview</h4>
                <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4 opacity-70">
                  <div className="flex items-center gap-2">
                    {(() => { const Icon = (Icons as any)[newTabIcon] || Icons.Layout; return <Icon size={16} className="text-primary" />; })()}
                    <div className="h-4 w-1/3 rounded bg-muted"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 col-span-2"><div className="h-2 w-10 rounded bg-muted/50"></div><div className="h-8 rounded bg-secondary"></div></div>
                    {newTabFields.filter(f => f.name.trim()).map((f, i) => (
                      <div key={i} className={`space-y-1.5 ${f.type === 'textarea' ? 'col-span-2' : ''}`}>
                        <div className="h-2 w-16 rounded bg-muted/50"></div>
                        <div className={`rounded bg-secondary ${f.type === 'textarea' ? 'h-16' : 'h-8'}`}></div>
                      </div>
                    ))}
                    <div className="col-span-2 space-y-1.5"><div className="h-2 w-20 rounded bg-muted/50"></div><div className="aspect-video rounded bg-secondary"></div></div>
                    <div className="space-y-1.5"><div className="h-2 w-14 rounded bg-muted/50"></div><div className="h-8 rounded bg-secondary/50"></div></div>
                    <div className="space-y-1.5"><div className="h-2 w-14 rounded bg-muted/50"></div><div className="h-8 rounded bg-secondary/50"></div></div>
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] text-muted-foreground">Each item in {newTabName || 'this section'} will look like this.</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t border-border pt-6">
              <button
                onClick={addCustomTab}
                className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                Create Section
              </button>
              <button
                onClick={() => { setIsAddingTab(false); setNewTabFields([{ name: "Description", type: "textarea" }]); }}
                className="rounded-lg bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {tab === "services" && <ServicesPanel onViewProjects={(id) => { setServiceFilter(id); setTab("projects"); }} allTabs={customTabs} onTabsUpdate={fetchCustomTabs} />}
        {tab === "employees" && <EmployeesPanel allTabs={customTabs} onTabsUpdate={fetchCustomTabs} />}
        {tab === "projects" && <ProjectsPanel initialFilter={serviceFilter} onClearFilter={() => setServiceFilter(null)} allTabs={customTabs} onTabsUpdate={fetchCustomTabs} />}
        {tab === "industries" && <IndustriesPanel allTabs={customTabs} onTabsUpdate={fetchCustomTabs} />}
        {tab === "stats" && <StatsPanel allTabs={customTabs} onTabsUpdate={fetchCustomTabs} />}
        {tab === "contacts" && <ContactsPanel allTabs={customTabs} onTabsUpdate={fetchCustomTabs} />}
        {tab === "messages" && <MessagesPanel />}
        {tab === "home" && <HomePanel />}

        {/* Render dynamic tab content */}
        {customTabs.map(ct => ct.slug === tab && (
          <DynamicPanel
            key={ct.slug}
            tabSlug={ct.slug}
            title={ct.name}
            fields={ct.fields}
            allTabs={customTabs}
            onTabsUpdate={fetchCustomTabs}
          />
        ))}
      </div>
    </div>
  );
};

const AVAILABLE_ICONS = [
  "Code2", "Cloud", "Settings", "Headphones", "BarChart3", "Database", "Smartphone", "ShieldCheck", "Globe", "Cpu", "Monitor", "Wifi", "Server", "Lock",
  "Factory", "Landmark", "Heart", "HeartPulse", "ShoppingCart", "ShoppingBag", "Zap", "Plane", "Building2", "Droplets"
];

const AVAILABLE_SERVICES = [
  "EAD", "IOT", "MOBILE APP", "CLOUD SOLUTIONS", "CYBERSECURITY", "DATA ANALYTICS", "UI/UX DESIGN", "DEVOPS", "ARTIFICIAL INTELLIGENCE", "BLOCKCHAIN"
];

// ─── Services ─────────────────────────────────────────
const ServicesPanel = ({ onViewProjects, allTabs, onTabsUpdate }: { onViewProjects: (id: string) => void; allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const [serviceData, projectData] = await Promise.all([
      api.get("services"),
      api.get("projects")
    ]);
    if (serviceData) setItems(serviceData);
    if (projectData) setProjects(projectData);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    if (isNew) {
      await api.post("services", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("services", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...(editing.data || {}),
        [fieldName]: value
      }
    });
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("services", id);
    fetch();
  };

  const currentTabFields = allTabs.find(t => t.slug === 'services')?.fields || [];

  return (
    <CrudPanel
      title="Services"
      onAdd={() => {
        const initialData: Record<string, string> = {};
        currentTabFields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", icon: "Code2", title: "", description: "", sort_order: items.length + 1, status: "approved", data: initialData });
        setIsNew(true);
      }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <SelectField label="Icon" value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} options={AVAILABLE_ICONS} showIcons />
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />

          {/* Dynamic Fields */}
          {currentTabFields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={(editing.data && editing.data[f.name]) || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea'}
            />
          ))}

          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <SelectField label="Status" value={editing.status || "approved"} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}

      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box for all Services");
          if (!name) return;
          let uTab = allTabs.find(t => t.slug === 'services');
          if (!uTab) {
            await api.post("custom-tabs", { name: "Services Meta", slug: "services", icon: "Code2", fields: [{ name, type: 'text' }] });
          } else {
            const updatedFields = [...uTab.fields, { name, type: 'text' }];
            await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          }
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to all Services
      </button>
      {items.map((s) => {
        const count = projects.filter(p => p.serviceId === (s.id || s._id)).length;
        return (
          <ItemRow
            key={s.id || s._id}
            label={s.title}
            sub={(() => {
              const coreSub = s.description;
              const dynamicSub = Object.entries(s.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
              return dynamicSub ? `${coreSub} | ${dynamicSub}` : coreSub;
            })()}
            status={s.status}
            extraLabel={count > 0 ? `${count} Project${count > 1 ? 's' : ''}` : undefined}
            onEdit={() => { setEditing(s); setIsNew(false); }}
            onDelete={() => remove(s.id || s._id)}
            extraAction={{
              icon: <Icons.Briefcase size={15} />,
              tooltip: "Manage Projects",
              onClick: () => onViewProjects(s.id || s._id || "")
            }}
          />
        );
      })}
    </CrudPanel>
  );
};

// ─── Employees ────────────────────────────────────────
const EmployeesPanel = ({ allTabs, onTabsUpdate }: { allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<EmployeeRow[]>([]);
  const [editing, setEditing] = useState<EmployeeRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const data = await api.get("employees");
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    if (isNew) {
      await api.post("employees", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("employees", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...(editing.data || {}),
        [fieldName]: value
      }
    });
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("employees", id);
    fetch();
  };

  const currentTabFields = allTabs.find(t => t.slug === 'employees')?.fields || [];

  return (
    <CrudPanel
      title="Employees"
      onAdd={() => {
        const initialData: Record<string, string> = {};
        currentTabFields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", name: "", position: "", photo_url: null, sort_order: items.length + 1, status: "pending", data: initialData });
        setIsNew(true);
      }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Position" value={editing.position} onChange={(v) => setEditing({ ...editing, position: v })} />
          <FileUpload label="Team Member Photo" value={editing.photo_url} onChange={(url) => setEditing({ ...editing, photo_url: url })} />

          {/* Dynamic Fields */}
          {currentTabFields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={(editing.data && editing.data[f.name]) || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea'}
            />
          ))}

          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <SelectField label="Status" value={editing.status} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}

      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box for all Employees");
          if (!name) return;
          let uTab = allTabs.find(t => t.slug === 'employees');
          if (!uTab) {
            await api.post("custom-tabs", { name: "Employees Meta", slug: "employees", icon: "Users", fields: [{ name, type: 'text' }] });
          } else {
            const updatedFields = [...uTab.fields, { name, type: 'text' }];
            await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          }
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to all Employees
      </button>

      {items.map((e) => (
        <ItemRow
          key={e.id || e._id}
          label={e.name}
          sub={(() => {
            const coreSub = e.position;
            const dynamicSub = Object.entries(e.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
            return dynamicSub ? `${coreSub} | ${dynamicSub}` : coreSub;
          })()}
          status={e.status}
          onEdit={() => { setEditing(e); setIsNew(false); }}
          onDelete={() => remove(e.id || e._id)}
        />
      ))}
    </CrudPanel>
  );
};

// ─── Projects ─────────────────────────────────────────
const ProjectsPanel = ({ initialFilter, onClearFilter, allTabs, onTabsUpdate }: { initialFilter: string | null; onClearFilter: () => void; allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [serviceFilter, setServiceFilter] = useState<string | null>(initialFilter);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = async () => {
    const data = await api.get("projects");
    if (data) setItems(data);
  };

  const fetchServices = async () => {
    const data = await api.get("services");
    if (data) setServices(data);
  };

  useEffect(() => {
    fetchItems();
    fetchServices();
  }, []);

  const filteredItems = serviceFilter
    ? items.filter(p => p.serviceId === serviceFilter)
    : items;

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    if (isNew) {
      await api.post("projects", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("projects", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetchItems();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...(editing.data || {}),
        [fieldName]: value
      }
    });
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("projects", id);
    fetchItems();
  };

  const currentTabFields = allTabs.find(t => t.slug === 'projects')?.fields || [];

  return (
    <CrudPanel
      title={serviceFilter
        ? `Projects for ${services.find(s => (s.id || s._id) === serviceFilter)?.title || "Service"}`
        : "Projects"
      }
      onAdd={() => {
        const initialData: Record<string, string> = {};
        currentTabFields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", title: "", description: "", image_url: null, link: null, sort_order: items.length + 1, status: "approved", serviceId: serviceFilter || "", data: initialData });
        setIsNew(true);
      }}
      extraHeader={serviceFilter && (
        <button onClick={() => { setServiceFilter(null); onClearFilter(); }} className="text-xs text-primary hover:underline">
          Clear Filter
        </button>
      )}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
          <FileUpload label="Project Image" value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} />
          <Field label="Link (optional)" value={editing.link || ""} onChange={(v) => setEditing({ ...editing, link: v || null })} />
          <SelectField label="Service" value={editing.serviceId || ""} onChange={(v) => setEditing({ ...editing, serviceId: v })} options={["", ...services.map(s => s.id || s._id || "")]} displayOptions={["None", ...services.map(s => s.title)]} />

          {/* Dynamic Fields */}
          {currentTabFields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={(editing.data && editing.data[f.name]) || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea'}
            />
          ))}

          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <SelectField label="Status" value={editing.status || "approved"} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}

      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box for all Projects");
          if (!name) return;
          let uTab = allTabs.find(t => t.slug === 'projects');
          if (!uTab) {
            await api.post("custom-tabs", { name: "Projects Meta", slug: "projects", icon: "Briefcase", fields: [{ name, type: 'text' }] });
          } else {
            const updatedFields = [...uTab.fields, { name, type: 'text' }];
            await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          }
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to all Projects
      </button>

      {filteredItems.map((p) => (
        <ItemRow
          key={p.id || p._id}
          label={p.title}
          sub={(() => {
            const coreSub = `${services.find(s => (s.id || s._id) === p.serviceId)?.title || "No Service"} - ${p.description}`;
            const dynamicSub = Object.entries(p.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
            return dynamicSub ? `${coreSub} | ${dynamicSub}` : coreSub;
          })()}
          status={p.status}
          onEdit={() => { setEditing(p); setIsNew(false); }}
          onDelete={() => remove(p.id || p._id)}
        />
      ))}
    </CrudPanel>
  );
};

// ─── Industries ───────────────────────────────────────
const IndustriesPanel = ({ allTabs, onTabsUpdate }: { allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<IndustryRow[]>([]);
  const [editing, setEditing] = useState<IndustryRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const data = await api.get("industries");
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    if (isNew) {
      await api.post("industries", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("industries", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...(editing.data || {}),
        [fieldName]: value
      }
    });
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("industries", id);
    fetch();
  };

  const currentTabFields = allTabs.find(t => t.slug === 'industries')?.fields || [];

  return (
    <CrudPanel
      title="Industries"
      onAdd={() => {
        const initialData: Record<string, string> = {};
        currentTabFields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", icon: "Building2", title: "", sort_order: items.length + 1, status: "approved", data: initialData });
        setIsNew(true);
      }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <SelectField label="Icon" value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} options={AVAILABLE_ICONS} showIcons />
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />

          {/* Dynamic Fields */}
          {currentTabFields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={(editing.data && editing.data[f.name]) || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea'}
            />
          ))}

          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <SelectField label="Status" value={editing.status || "approved"} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}

      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box for all Industries");
          if (!name) return;
          let uTab = allTabs.find(t => t.slug === 'industries');
          if (!uTab) {
            await api.post("custom-tabs", { name: "Industries Meta", slug: "industries", icon: "Building2", fields: [{ name, type: 'text' }] });
          } else {
            const updatedFields = [...uTab.fields, { name, type: 'text' }];
            await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          }
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to all Industries
      </button>

      {items.map((ind) => (
        <ItemRow
          key={ind.id || ind._id}
          label={ind.title}
          sub={(() => {
            const coreSub = `Icon: ${ind.icon}`;
            const dynamicSub = Object.entries(ind.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
            return dynamicSub ? `${coreSub} | ${dynamicSub}` : coreSub;
          })()}
          status={ind.status}
          onEdit={() => { setEditing(ind); setIsNew(false); }}
          onDelete={() => remove(ind.id || ind._id)}
        />
      ))}
    </CrudPanel>
  );
};

// ─── Stats ────────────────────────────────────────────
const StatsPanel = ({ allTabs, onTabsUpdate }: { allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<StatRow[]>([]);
  const [editing, setEditing] = useState<StatRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const data = await api.get("stats");
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    if (isNew) {
      await api.post("stats", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("stats", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...(editing.data || {}),
        [fieldName]: value
      }
    });
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("stats", id);
    fetch();
  };

  const currentTabFields = allTabs.find(t => t.slug === 'stats')?.fields || [];

  return (
    <CrudPanel
      title="Stats"
      onAdd={() => {
        const initialData: Record<string, string> = {};
        currentTabFields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", value: "", label: "", sort_order: items.length + 1, status: "approved", data: initialData });
        setIsNew(true);
      }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Value" value={editing.value} onChange={(v) => setEditing({ ...editing, value: v })} />
          <Field label="Label" value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} />

          {/* Dynamic Fields */}
          {currentTabFields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={(editing.data && editing.data[f.name]) || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea'}
            />
          ))}

          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <SelectField label="Status" value={editing.status || "approved"} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}

      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box for all Stats");
          if (!name) return;
          let uTab = allTabs.find(t => t.slug === 'stats');
          if (!uTab) {
            await api.post("custom-tabs", { name: "Stats Meta", slug: "stats", icon: "BarChart3", fields: [{ name, type: 'text' }] });
          } else {
            const updatedFields = [...uTab.fields, { name, type: 'text' }];
            await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          }
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to all Stats
      </button>

      {items.map((s) => (
        <ItemRow
          key={s.id || s._id}
          label={s.value}
          sub={(() => {
            const coreSub = s.label;
            const dynamicSub = Object.entries(s.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
            return dynamicSub ? `${coreSub} | ${dynamicSub}` : coreSub;
          })()}
          status={s.status}
          onEdit={() => { setEditing(s); setIsNew(false); }}
          onDelete={() => remove(s.id || s._id)}
        />
      ))}
    </CrudPanel>
  );
};

// ─── Contacts ─────────────────────────────────────────
const ContactsPanel = ({ allTabs, onTabsUpdate }: { allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<ContactRow[]>([]);
  const [editing, setEditing] = useState<ContactRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const data = await api.get("contacts");
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    if (isNew) {
      await api.post("contacts", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("contacts", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...(editing.data || {}),
        [fieldName]: value
      }
    });
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("contacts", id);
    fetch();
  };

  const currentTabFields = allTabs.find(t => t.slug === 'contacts')?.fields || [];

  return (
    <CrudPanel
      title="Contact Information"
      onAdd={() => {
        const initialData: Record<string, string> = {};
        currentTabFields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", title: "", description: "", address: "", phone: "", whatsapp: "", email: "", status: "approved", data: initialData });
        setIsNew(true);
      }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Section Title" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Section Description" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
          <Field label="Address" value={editing.address} onChange={(v) => setEditing({ ...editing, address: v })} textarea />
          <Field label="Phone Number" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} />
          <Field label="WhatsApp Number" value={editing.whatsapp} onChange={(v) => setEditing({ ...editing, whatsapp: v })} />
          <Field label="Email Address" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} />

          {/* Dynamic Fields */}
          {currentTabFields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={(editing.data && editing.data[f.name]) || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea'}
            />
          ))}

          <SelectField label="Status" value={editing.status || "approved"} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}

      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box for Contact Settings");
          if (!name) return;
          let uTab = allTabs.find(t => t.slug === 'contacts');
          if (!uTab) {
            await api.post("custom-tabs", { name: "Contact Meta", slug: "contacts", icon: "Phone", fields: [{ name, type: 'text' }] });
          } else {
            const updatedFields = [...uTab.fields, { name, type: 'text' }];
            await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          }
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to Contact Info
      </button>

      {items.map((c) => (
        <ItemRow
          key={c.id || c._id}
          label={c.address}
          sub={(() => {
            const coreSub = `${c.phone} | WA: ${c.whatsapp} | ${c.email}`;
            const dynamicSub = Object.entries(c.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
            return dynamicSub ? `${coreSub} | ${dynamicSub}` : coreSub;
          })()}
          status={c.status}
          onEdit={() => { setEditing(c); setIsNew(false); }}
          onDelete={() => remove(c.id || c._id)}
        />
      ))}
    </CrudPanel>
  );
};

// ─── Messages ─────────────────────────────────────────
const MessagesPanel = () => {
  const [items, setItems] = useState<{ id: string; _id: string; name: string; email: string; subject: string; message: string; createdAt: string }[]>([]);

  const fetch = async () => {
    const data = await api.get("messages");
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await api.delete("messages", id);
    fetch();
  };

  return (
    <CrudPanel title="Incoming Messages" onAdd={() => alert("Messages are created via the contact form.")}>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground italic">
          No messages yet.
        </div>
      ) : (
        items.map((m) => (
          <div key={m.id || m._id} className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-foreground">{m.subject}</h3>
                <p className="text-xs text-muted-foreground">From: <span className="font-medium text-primary">{m.name}</span> ({m.email})</p>
                <p className="text-[10px] text-muted-foreground/50 mt-1">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => remove(m.id || m._id)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="rounded-lg bg-secondary/30 p-4 text-sm text-foreground whitespace-pre-wrap border border-border/50">
              {m.message}
            </div>
          </div>
        ))
      )}
    </CrudPanel>
  );
};

// ─── Home Content ─────────────────────────────────────
const HomePanel = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const res = await api.get("home-content");
    if (res) setContent(res);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    await api.put("home-content", null, content);
    alert("Home content updated successfully!");
    fetch();
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!content) return <div className="p-8 text-center text-muted-foreground">Error loading content.</div>;

  const updateHero = (field: string, value: string) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const updateAbout = (field: string, value: any) => {
    setContent({ ...content, about: { ...content.about, [field]: value } });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-primary">
          <Layout size={20} />
          <h2 className="font-display text-xl font-bold">Hero Section</h2>
        </div>
        <div className="grid gap-6">
          <Field label="Subtitle (Pill text)" value={content.hero.subtitle} onChange={(v) => updateHero('subtitle', v)} />
          <Field label="Main Title" value={content.hero.title} onChange={(v) => updateHero('title', v)} />
          <Field label="Description" value={content.hero.description} onChange={(v) => updateHero('description', v)} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button Text" value={content.hero.primaryButtonText} onChange={(v) => updateHero('primaryButtonText', v)} />
            <Field label="Button Link" value={content.hero.primaryButtonLink} onChange={(v) => updateHero('primaryButtonLink', v)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-primary">
          <Layout size={20} />
          <h2 className="font-display text-xl font-bold">About Section</h2>
        </div>
        <div className="grid gap-6">
          <Field label="Subtitle" value={content.about.subtitle} onChange={(v) => updateAbout('subtitle', v)} />
          <Field label="Main Title" value={content.about.title} onChange={(v) => updateAbout('title', v)} />
          <Field label="Description Paragraph 1" value={content.about.description1} onChange={(v) => updateAbout('description1', v)} textarea />
          <Field label="Description Paragraph 2" value={content.about.description2} onChange={(v) => updateAbout('description2', v)} textarea />
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground">Key Competencies (Comma separated)</label>
            <textarea
              value={content.about.competencies.join(', ')}
              onChange={(e) => updateAbout('competencies', e.target.value.split(',').map(s => s.trim()))}
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={save}
          className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
        >
          <Save size={18} /> Save All Changes
        </button>
      </div>
    </div>
  );
};

// ─── Dynamic Panel ────────────────────────────────────
const DynamicPanel = ({ tabSlug, title, fields, allTabs, onTabsUpdate }: { tabSlug: string; title: string; fields: { name: string; type: string }[]; allTabs: CustomTab[]; onTabsUpdate: () => void }) => {
  const [items, setItems] = useState<CustomItemRow[]>([]);
  const [editing, setEditing] = useState<CustomItemRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchBySlug = async () => {
    const response = await api.get(`custom-items/${tabSlug}`);
    if (response) setItems(response);
  };
  useEffect(() => { fetchBySlug(); }, [tabSlug]);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing, tabSlug };
    if (isNew) {
      await api.post("custom-items", payload);
    } else {
      const id = editing.id || editing._id;
      if (!id) return;
      await api.put("custom-items", id, payload);
    }
    setEditing(null);
    setIsNew(false);
    fetchBySlug();
  };

  const remove = async (id: string | undefined) => {
    if (!id) return;
    await api.delete("custom-items", id);
    fetchBySlug();
  };

  const handleDataChange = (fieldName: string, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...editing.data,
        [fieldName]: value
      }
    });
  };

  return (
    <CrudPanel
      title={title}
      onAdd={() => {
        const initialData: Record<string, string> = {};
        fields.forEach(f => initialData[f.name] = "");
        setEditing({ id: "", tabSlug, title: "", data: initialData, image: null, status: "approved", sort_order: items.length + 1 });
        setIsNew(true);
      }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="System Title (Display Name)" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />

          {/* Dynamically render fields defined by user */}
          {fields.map((f, i) => (
            <Field
              key={i}
              label={f.name}
              value={editing.data[f.name] || ""}
              onChange={(v) => handleDataChange(f.name, v)}
              textarea={f.type === 'textarea' || f.name.toLowerCase().includes('description') || f.name.toLowerCase().includes('content')}
            />
          ))}

          <FileUpload label="Image (Optional)" value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} />
          <Field label="Sort Order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <SelectField label="Status" value={editing.status || "approved"} onChange={(v) => setEditing({ ...editing, status: v })} options={["pending", "approved", "rejected"]} />
        </EditCard>
      )}
      <button
        onClick={async () => {
          const name = prompt("Enter a name for your new box (e.g. Price, Author)");
          if (!name) return;
          const uTab = allTabs.find(t => t.slug === tabSlug);
          if (!uTab) return;
          const updatedFields = [...uTab.fields, { name, type: 'text' }];
          await api.put("custom-tabs", uTab.id || uTab._id, { fields: updatedFields });
          onTabsUpdate();
        }}
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-all"
      >
        <Plus size={14} /> Add One More Box to this Section
      </button>
      {items.map((it) => (
        <ItemRow
          key={it.id || it._id}
          label={it.title}
          sub={Object.entries(it.data || {}).map(([k, v]) => `${k}: ${v}`).join(" | ").substring(0, 100) + "..."}
          status={it.status}
          extraLabel={`Order: ${it.sort_order}`}
          onEdit={() => { setEditing(it); setIsNew(false); }}
          onDelete={() => remove(it.id || it._id)}
        />
      ))}
    </CrudPanel>
  );
};

// ─── Shared UI ────────────────────────────────────────
const CrudPanel = ({ title, onAdd, extraHeader, children }: { title: string; onAdd: () => void; extraHeader?: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
        {extraHeader}
      </div>
      <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <Plus size={16} /> Add
      </button>
    </div>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const EditCard = ({ onSave, onCancel, children }: { onSave: () => void; onCancel: () => void; children: React.ReactNode }) => (
  <div className="mb-4 rounded-xl border border-primary/30 bg-card p-6">
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    <div className="mt-4 flex gap-2">
      <button onClick={onSave} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Save size={14} /> Save</button>
      <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"><X size={14} /> Cancel</button>
    </div>
  </div>
);

const ItemRow = ({ label, sub, status, extraLabel, extraAction, onEdit, onDelete }: { label: string; sub: string; status?: string; extraLabel?: string; extraAction?: { icon: React.ReactNode; tooltip: string; onClick: () => void }; onEdit: () => void; onDelete: () => void }) => (
  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4">
    <div className="flex items-center gap-4 text-left">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {extraLabel && <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded">{extraLabel}</span>}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{sub}</p>
      </div>
      {status && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${status === "approved" ? "bg-green-500/10 text-green-500" :
          status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
            "bg-red-500/10 text-red-500"
          }`}>
          {status}
        </span>
      )}
    </div>
    <div className="flex gap-2">
      {extraAction && (
        <button onClick={extraAction.onClick} title={extraAction.tooltip} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
          {extraAction.icon}
        </button>
      )}
      <button onClick={onEdit} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={15} /></button>
      <button onClick={onDelete} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={15} /></button>
    </div>
  </div>
);

const Field = ({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="resize-none rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50" />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50" />
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options, displayOptions, showIcons }: { label: string; value: string; onChange: (v: string) => void; options: string[]; displayOptions?: string[]; showIcons?: boolean }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-border bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((opt, i) => (
          <option key={opt} value={opt}>{displayOptions ? displayOptions[i] : opt}</option>
        ))}
      </select>
      {showIcons && value && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
          {(() => {
            const IconComponent = (Icons as any)[value];
            return IconComponent ? <IconComponent size={18} /> : null;
          })()}
        </div>
      )}
    </div>
  </div>
);

export default AdminDashboard;
