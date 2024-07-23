import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, FileText, File, DollarSign, StickyNote, History, Search, Folder, CheckSquare, Plus, LogIn, LogOut } from 'lucide-react';

// Mock user data (replace with actual backend integration)
const USERS = {
  'client1@example.com': { password: 'password1', role: 'client', id: '1' },
  'client2@example.com': { password: 'password2', role: 'client', id: '2' },
  'admin@example.com': { password: 'adminpass', role: 'admin', id: 'admin' },
};

// Mock client data (replace with actual backend integration)
const CLIENT_DATA = {
  '1': { name: 'Client 1', projects: [/* ... */] },
  '2': { name: 'Client 2', projects: [/* ... */] },
};

const AuthContext = React.createContext(null);

const useAuth = () => React.useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = (email, password) => {
    const userInfo = USERS[email];
    if (userInfo && userInfo.password === password) {
      setUser({ email, role: userInfo.role, id: userInfo.id });
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signIn(email, password)) {
      setEmail('');
      setPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <Button type="submit">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// ... [Previous components like Header, ProjectManagement, etc. remain the same]

const ClientSelector = ({ onSelect }) => {
  const clients = Object.entries(CLIENT_DATA).map(([id, data]) => ({
    value: id,
    label: data.name,
  }));

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client.value} value={client.value}>
            {client.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ClientPortal = () => {
  const { user, signOut } = useAuth();
  const [selectedClient, setSelectedClient] = useState(null);
  const [projects, setProjects] = useState([]);
  // ... [Other state variables remain the same]

  useEffect(() => {
    if (user && user.role === 'client') {
      setSelectedClient(user.id);
      setProjects(CLIENT_DATA[user.id].projects || []);
    } else if (user && user.role === 'admin' && selectedClient) {
      setProjects(CLIENT_DATA[selectedClient].projects || []);
    }
  }, [user, selectedClient]);

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex justify-between items-center p-4">
        {user.role === 'admin' && (
          <ClientSelector onSelect={setSelectedClient} />
        )}
        <Button onClick={signOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
      <Tabs defaultValue="chat-notes" className="flex-grow">
        <TabsList>
          <TabsTrigger value="chat-notes">Chat & Notes</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="mr-2" />Documents</TabsTrigger>
          <TabsTrigger value="forms"><File className="mr-2" />Forms & Invoices</TabsTrigger>
          <TabsTrigger value="projects"><Folder className="mr-2" />Projects</TabsTrigger>
          <TabsTrigger value="history"><History className="mr-2" />History</TabsTrigger>
        </TabsList>

        {/* ... [TabsContent components remain largely the same, but now use the 'projects' state] */}

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Manage your projects, tasks, and subtasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectManagement projects={projects} setProjects={setProjects} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ... [History TabsContent remains the same] */}
      </Tabs>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <ClientPortal />
  </AuthProvider>
);

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
