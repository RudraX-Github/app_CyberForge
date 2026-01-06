import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Train, Landmark, Plus, Search, Trash2, ArrowRight, LayoutDashboard, 
  TrendingUp, CreditCard, Wallet, Clock, DollarSign, MapPin, Calendar, 
  Ticket, User, Calculator, FileText, X, History, Terminal, Code, Cpu, 
  Play, RefreshCw, Layout, Info, FileCode, Home, Box, Activity
} from 'lucide-react';

// ==========================================
// --- SHARED UI COMPONENTS ---
// ==========================================

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", type = "button", disabled = false, title = "" }) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30",
    secondary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30",
    ghost: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "border-2 border-gray-200 hover:border-gray-300 text-gray-600",
    dark: "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
  };
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-semibold text-gray-600 ml-1">{label}</label>}
    <input 
      className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 w-full"
      {...props}
    />
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

// --- Shared Code Viewer Component ---
const CodeViewer = ({ code }) => {
  const highlight = (text) => {
    const keywords = ['#include', 'void', 'int', 'char', 'string', 'vector', 'while', 'for', 'if', 'else', 'switch', 'case', 'break', 'return', 'true', 'false', 'class', 'public', 'private', 'using', 'namespace', 'std', 'struct', 'virtual', 'override', 'protected', 'bool', 'double', 'const', 'auto'];
    return text.split('\n').map((line, i) => {
      const tokens = line.split(/(\s+|[(){};,<>])/);
      return (
        <div key={i} className="leading-relaxed whitespace-pre">
          <span className="text-gray-600 select-none mr-4 text-xs w-6 inline-block text-right border-r border-gray-800 pr-2">{i + 1}</span>
          {tokens.map((token, j) => {
            if (keywords.includes(token)) return <span key={j} className="text-purple-400 font-bold">{token}</span>;
            if (token.startsWith('"') || token.startsWith("'")) return <span key={j} className="text-orange-300">{token}</span>;
            if (token.startsWith('//')) return <span key={j} className="text-green-600 italic">{token}</span>;
            if (['std', 'cout', 'cin', 'endl', 'vector', 'string'].includes(token)) return <span key={j} className="text-blue-300">{token}</span>;
            return <span key={j}>{token}</span>;
          })}
        </div>
      );
    });
  };
  return (
    <div className="font-mono text-sm overflow-auto h-full p-4 bg-[#1e1e1e] text-gray-300 shadow-inner">
      {code ? highlight(code) : <div className="text-gray-600 italic flex items-center gap-2 mt-20 justify-center"><Code className="w-5 h-5"/> No Source Loaded</div>}
    </div>
  );
};

// ==========================================
// --- MODULE 1: RAILWAY SYSTEM ---
// ==========================================

const RAILWAY_CPP = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <ctime>

// -- CORE ENTITIES --
struct Train {
    int id;
    std::string name;
    std::string source;
    std::string destination;
    std::string time;
};

struct Ticket {
    long pnr;
    std::string passengerName;
    int trainId;
    std::time_t bookingTime;
};

// -- SYSTEM CONTROLLER --
class RailwayManager {
private:
    std::vector<Train> fleet;
    std::vector<Ticket> bookings;

public:
    // Initialize fleet
    RailwayManager() {
        fleet.reserve(100); 
    }

    void addTrain(int id, std::string name, std::string src, std::string dest, std::string time) {
        // O(1) insertion
        fleet.push_back({id, name, src, dest, time});
        std::cout << "[SYS] Train " << id << " added to active fleet.\\n";
    }

    bool bookTicket(std::string passenger, int trainId) {
        // Validate train existence (O(N) search)
        auto it = std::find_if(fleet.begin(), fleet.end(), 
            [trainId](const Train& t) { return t.id == trainId; });
        
        if (it != fleet.end()) {
            // Generate pseudo-random PNR
            long pnr = std::rand() % 90000 + 10000;
            bookings.push_back({pnr, passenger, trainId, std::time(nullptr)});
            
            std::cout << "[SYS] Booking Confirmed. PNR: " << pnr << "\\n";
            return true;
        }
        
        std::cerr << "[ERR] Train ID not found.\\n";
        return false;
    }
    
    // Analytics Engine
    int getFleetSize() const { return fleet.size(); }
};`;

const RailwaySystem = ({ onBack }) => {
  const [view, setView] = useState('trains'); 
  const [showKernel, setShowKernel] = useState(false);
  const [trains, setTrains] = useState([
    { id: 101, name: 'Rajdhani Express', source: 'New Delhi', dest: 'Mumbai', time: '16:30' },
    { id: 102, name: 'Shatabdi Express', source: 'Bangalore', dest: 'Chennai', time: '06:00' },
  ]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrain, setNewTrain] = useState({ id: '', name: '', source: '', dest: '', time: '' });
  
  const [bookingTrainId, setBookingTrainId] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => {
    const routeCounts = {};
    trains.forEach(t => {
      const route = `${t.source}-${t.dest}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    return {
      total: trains.length,
      routes: Object.keys(routeCounts).length,
      bookings: bookings.length
    };
  }, [trains, bookings]);

  const handleAddTrain = (e) => {
    e.preventDefault();
    setTrains([...trains, { ...newTrain, id: parseInt(newTrain.id) }]);
    setShowAddForm(false);
    setNewTrain({ id: '', name: '', source: '', dest: '', time: '' });
  };

  const handleRemoveTrain = (id) => {
    if (window.confirm(`Are you sure you want to remove train #${id}?`)) {
      setTrains(trains.filter(t => t.id !== id));
    }
  };

  const handleBookTicket = (e) => {
    e.preventDefault();
    const train = trains.find(t => t.id === bookingTrainId);
    if (!train) return;

    const newBooking = {
      id: Date.now(),
      passenger: passengerName,
      trainName: train.name,
      trainId: train.id,
      source: train.source,
      dest: train.dest,
      date: bookingDate
    };
    
    setBookings([...bookings, newBooking]);
    setBookingTrainId(null);
    setPassengerName('');
    setBookingDate(new Date().toISOString().split('T')[0]);
    alert("Ticket Booked Successfully!");
  };

  const handleCancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this ticket?")) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const filteredTrains = trains.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Main App Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showKernel ? 'w-1/2' : 'w-full'}`}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Train className="w-8 h-8 text-indigo-600" />
                Railway Admin
              </h2>
              <p className="text-slate-500">Fleet Logistics Interface</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant={showKernel ? "primary" : "outline"}
                onClick={() => setShowKernel(!showKernel)}
                title="Toggle Backend Source View"
              >
                <Code className="w-4 h-4" /> {showKernel ? 'Hide Kernel' : 'View Kernel'}
              </Button>
              <Button variant="ghost" onClick={onBack}>Exit</Button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Card className="!p-3 !py-2 flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-bold text-slate-400 uppercase">Fleet</span>
              <span className="text-xl font-black text-indigo-600">{stats.total}</span>
            </Card>
            <Card className="!p-3 !py-2 flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-bold text-slate-400 uppercase">Bookings</span>
              <span className="text-xl font-black text-indigo-600">{stats.bookings}</span>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            <button onClick={() => setView('trains')} className={`px-4 py-2 font-semibold rounded-lg transition-colors ${view === 'trains' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>Train Schedule</button>
            <button onClick={() => setView('bookings')} className={`px-4 py-2 font-semibold rounded-lg transition-colors ${view === 'bookings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>My Bookings</button>
          </div>

          {view === 'trains' && (
            <>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by Train Name or Number..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm bg-white focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="w-5 h-5" /> Add Train
                </Button>
              </div>

              {showAddForm && (
                <Card className="border-l-4 border-l-indigo-500 animate-slideDown">
                  <form onSubmit={handleAddTrain} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <Input label="Train No." required type="number" value={newTrain.id} onChange={e => setNewTrain({...newTrain, id: e.target.value})} />
                    <Input label="Name" required value={newTrain.name} onChange={e => setNewTrain({...newTrain, name: e.target.value})} />
                    <Input label="Source" required value={newTrain.source} onChange={e => setNewTrain({...newTrain, source: e.target.value})} />
                    <Input label="Destination" required value={newTrain.dest} onChange={e => setNewTrain({...newTrain, dest: e.target.value})} />
                    <Input label="Time" required type="time" value={newTrain.time} onChange={e => setNewTrain({...newTrain, time: e.target.value})} />
                    <Button type="submit" className="md:col-span-2 lg:col-span-5 w-full justify-center">Save Record</Button>
                  </form>
                </Card>
              )}

              {bookingTrainId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <Card className="w-full max-w-md animate-scaleUp">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Ticket className="text-indigo-600" /> Book Ticket
                    </h3>
                    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Booking for:</p>
                      <p className="font-bold text-gray-800">{trains.find(t => t.id === bookingTrainId)?.name} (#{bookingTrainId})</p>
                    </div>
                    <form onSubmit={handleBookTicket} className="space-y-4">
                      <Input label="Passenger Name" placeholder="Enter full name" required value={passengerName} onChange={(e) => setPassengerName(e.target.value)} autoFocus />
                      <Input label="Journey Date" type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                      <div className="flex gap-2 justify-end mt-6">
                        <Button variant="ghost" onClick={() => setBookingTrainId(null)}>Cancel</Button>
                        <Button type="submit">Confirm Booking</Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredTrains.map(train => (
                  <Card key={train.id} className="group hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Train className="w-24 h-24 text-indigo-900" />
                    </div>
                    <div className="relative z-10 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <Badge color="blue">#{train.id}</Badge>
                        <div className="flex items-center text-slate-500 text-sm font-medium bg-slate-100 px-2 py-1 rounded-md">
                          <Clock className="w-4 h-4 mr-1" /> {train.time}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-4">{train.name}</h3>
                      <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span className="font-semibold">{train.source}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="font-semibold">{train.dest}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 relative z-20">
                      <Button className="flex-1 justify-center" variant="outline" onClick={() => setBookingTrainId(train.id)}>
                        <Ticket className="w-4 h-4" /> Book
                      </Button>
                      <Button variant="danger" className="!px-3" onClick={() => handleRemoveTrain(train.id)} title="Remove Train">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {view === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700">Passenger Manifest</h3>
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                  <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No tickets booked yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="flex flex-col sm:flex-row justify-between items-center !p-4 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-gray-800">{booking.passenger}</span>
                        </div>
                        <div className="text-sm text-gray-500">{booking.trainName} (#{booking.trainId})</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                           <Calendar className="w-3 h-3"/> {booking.date} • {booking.source} → {booking.dest}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge color="green">CONFIRMED</Badge>
                        <button onClick={() => handleCancelBooking(booking.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel Ticket">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Backend Source Panel */}
      {showKernel && (
        <div className="w-1/2 bg-[#1e1e1e] flex flex-col border-l border-gray-700 animate-slideLeft">
          <div className="p-3 bg-black/40 border-b border-gray-700 flex justify-between items-center">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500"/> System Core (C++)
            </span>
            <span className="text-[10px] text-gray-600">Read-Only Access</span>
          </div>
          <CodeViewer code={RAILWAY_CPP} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// --- MODULE 2: BANKING SYSTEM ---
// ==========================================

const BANKING_CPP = `#include <iostream>
#include <vector>
#include <mutex>

// -- ABSTRACT ACCOUNT BASE --
class Account {
protected:
    int accNum;
    std::string holder;
    double balance;
    
public:
    Account(int n, std::string h, double b) 
        : accNum(n), holder(h), balance(b) {}
        
    virtual ~Account() {}
    
    // Virtual method for polymorphic behavior
    virtual bool withdraw(double amount) = 0;
    
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    
    double getBalance() const { return balance; }
};

// -- DERIVED TYPES --
class SavingsAccount : public Account {
    double interestRate;
public:
    SavingsAccount(int n, std::string h, double b, double r) 
        : Account(n, h, b), interestRate(r) {}
        
    bool withdraw(double amount) override {
        // Strict balance check
        if (balance - amount >= 0) {
            balance -= amount;
            return true;
        }
        return false; // Insufficient Funds
    }
};

class CheckingAccount : public Account {
    double overdraftLimit;
public:
    CheckingAccount(int n, std::string h, double b, double limit)
        : Account(n, h, b), overdraftLimit(limit) {}
        
    bool withdraw(double amount) override {
        // Allow negative balance up to limit
        if (balance - amount >= -overdraftLimit) {
            balance -= amount;
            return true;
        }
        return false; // Limit Exceeded
    }
};

// -- BANK KERNEL --
class BankCore {
    std::vector<Account*> accounts;
    std::mutex transactionMutex; // Thread safety
    
public:
    void processTransaction(int accNum, double amount, bool isDeposit) {
        std::lock_guard<std::mutex> lock(transactionMutex);
        
        // Find account (simplified loop)
        for(auto acc : accounts) {
            if (isDeposit) acc->deposit(amount);
            else acc->withdraw(amount);
            
            std::cout << "[TXN] Processed on Thread " 
                      << std::this_thread::get_id() << "\\n";
        }
    }
};`;

const BankingSystem = ({ onBack }) => {
  const [showKernel, setShowKernel] = useState(false);
  const [accounts, setAccounts] = useState([
    { number: '1001', name: 'John Doe', balance: 5000, type: 'savings', rate: 2.5 },
    { number: '1002', name: 'Jane Smith', balance: 1500, type: 'checking', limit: 500 },
    { number: '1003', name: 'Alice Brown', balance: 10000, type: 'fixed', term: 12 },
  ]);
  
  const [allTransactions, setAllTransactions] = useState([
    { id: 1, accNum: '1001', type: 'deposit', amount: 5000, date: new Date().toLocaleDateString(), balanceAfter: 5000 },
    { id: 2, accNum: '1002', type: 'deposit', amount: 1500, date: new Date().toLocaleDateString(), balanceAfter: 1500 },
    { id: 3, accNum: '1003', type: 'deposit', amount: 10000, date: new Date().toLocaleDateString(), balanceAfter: 10000 },
  ]);

  const [formType, setFormType] = useState('savings');
  const [newAcc, setNewAcc] = useState({ number: '', name: '', balance: '', rate: '', limit: '', term: '' });
  const [transaction, setTransaction] = useState({ accNum: '', amount: '', type: 'deposit' });
  const [showYields, setShowYields] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [historyViewAcc, setHistoryViewAcc] = useState(null);

  const stats = useMemo(() => {
    const totalLiquidity = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    return { totalLiquidity };
  }, [accounts]);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const accountData = {
      ...newAcc,
      balance: parseFloat(newAcc.balance),
      ...(formType === 'savings' && { rate: parseFloat(newAcc.rate) }),
      ...(formType === 'checking' && { limit: parseFloat(newAcc.limit) }),
      ...(formType === 'fixed' && { term: parseInt(newAcc.term) }),
      type: formType
    };
    
    const initialTx = {
      id: Date.now(),
      accNum: newAcc.number,
      type: 'deposit',
      amount: parseFloat(newAcc.balance),
      date: new Date().toLocaleString(),
      balanceAfter: parseFloat(newAcc.balance)
    };
    
    setAccounts([...accounts, accountData]);
    setAllTransactions([initialTx, ...allTransactions]);
    setNewAcc({ number: '', name: '', balance: '', rate: '', limit: '', term: '' });
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");

    let found = false;
    let receiptData = null;
    let newTxRecord = null;

    const updatedAccounts = accounts.map(acc => {
      if (acc.number === transaction.accNum) {
        found = true;
        let newBalance = acc.balance;
        let success = false;

        if (transaction.type === 'deposit') {
          newBalance += amount;
          success = true;
        } else {
          let canWithdraw = false;
          if (acc.type === 'checking') {
            canWithdraw = amount <= (acc.balance + acc.limit);
          } else {
            canWithdraw = amount <= acc.balance;
          }

          if (canWithdraw) {
            newBalance -= amount;
            success = true;
          } else {
            alert(acc.type === 'checking' ? "Exceeded overdraft limit." : "Insufficient funds.");
          }
        }

        if (success) {
           receiptData = {
             id: Math.floor(Math.random() * 1000000),
             date: new Date().toLocaleString(),
             type: transaction.type,
             amount: amount,
             accName: acc.name,
             accNum: acc.number,
             oldBalance: acc.balance,
             newBalance: newBalance
           };
           
           newTxRecord = {
             id: Date.now(),
             accNum: acc.number,
             type: transaction.type,
             amount: amount,
             date: new Date().toLocaleString(),
             balanceAfter: newBalance
           };
           
           return { ...acc, balance: newBalance };
        }
      }
      return acc;
    });

    if (!found) {
      alert("Account not found.");
    } else {
      setAccounts(updatedAccounts);
      if (receiptData) {
        setLastReceipt(receiptData);
        if (newTxRecord) {
            setAllTransactions(prev => [newTxRecord, ...prev]);
        }
        setTransaction({ accNum: '', amount: '', type: 'deposit' });
      }
    }
  };

  const fixedDepositYields = accounts
    .filter(acc => acc.type === 'fixed')
    .map(acc => ({
      ...acc,
      interest: (acc.balance * 5.0) / 100 
    }));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showKernel ? 'w-1/2' : 'w-full'}`}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Landmark className="w-8 h-8 text-emerald-600" />
                Core Banking
              </h2>
              <p className="text-slate-500">Financial Ledger System</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant={showKernel ? "primary" : "outline"}
                onClick={() => setShowKernel(!showKernel)}
                title="Toggle Backend Source View"
              >
                <Code className="w-4 h-4" /> {showKernel ? 'Hide Kernel' : 'View Kernel'}
              </Button>
              <Card className="!p-3 !py-2 flex flex-col items-center min-w-[120px]">
                <span className="text-xs font-bold text-slate-400 uppercase">Liquidity</span>
                <span className="text-xl font-black text-emerald-600">${stats.totalLiquidity.toLocaleString()}</span>
              </Card>
              <Button variant="ghost" onClick={onBack}>Exit</Button>
            </div>
          </div>

          {historyViewAcc && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-lg animate-scaleUp relative max-h-[80vh] flex flex-col">
                <button onClick={() => setHistoryViewAcc(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                 <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-600" /> Account History
                    </h3>
                    <p className="text-sm text-gray-500">Showing transactions for Account #{historyViewAcc}</p>
                 </div>
                 <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {allTransactions.filter(t => t.accNum === historyViewAcc).length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No transactions found.</p>
                    ) : (
                        allTransactions.filter(t => t.accNum === historyViewAcc).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Badge color={tx.type === 'deposit' ? 'green' : 'red'}>{tx.type.toUpperCase()}</Badge>
                                            <span className="text-xs text-gray-400">{tx.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-400">Bal: ${tx.balanceAfter.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))
                    )}
                 </div>
                 <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                     <Button onClick={() => setHistoryViewAcc(null)}>Close History</Button>
                 </div>
              </Card>
            </div>
          )}

          {lastReceipt && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm animate-scaleUp relative border-t-8 border-t-emerald-500">
                 <button onClick={() => setLastReceipt(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                 <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600"><FileText className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold text-gray-800">Transaction Receipt</h3>
                    <p className="text-sm text-gray-500">{lastReceipt.date}</p>
                 </div>
                 <div className="space-y-4 mb-6">
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span className="text-gray-500">Transaction ID</span>
                     <span className="font-mono font-bold text-gray-700">#{lastReceipt.id}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span className="text-gray-500">Account</span>
                     <div className="text-right"><div className="font-bold text-gray-800">{lastReceipt.accName}</div><div className="text-xs text-gray-400">#{lastReceipt.accNum}</div></div>
                   </div>
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span className="text-gray-500">Type</span>
                     <Badge color={lastReceipt.type === 'deposit' ? 'green' : 'red'}>{lastReceipt.type.toUpperCase()}</Badge>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                     <span className="text-gray-500">Amount</span>
                     <span className={`text-xl font-bold ${lastReceipt.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>{lastReceipt.type === 'deposit' ? '+' : '-'}${lastReceipt.amount.toLocaleString()}</span>
                   </div>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">New Balance</span>
                    <span className="text-lg font-black text-gray-800">${lastReceipt.newBalance.toLocaleString()}</span>
                 </div>
                 <div className="mt-6 flex gap-2">
                   <Button variant="outline" className="flex-1 justify-center" onClick={() => window.print()}>Print</Button>
                   <Button className="flex-1 justify-center" onClick={() => setLastReceipt(null)}>Close</Button>
                 </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="border-t-4 border-t-emerald-500">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> New Account</h3>
                <form onSubmit={handleCreateAccount} className="space-y-3">
                  <div className="flex gap-2 mb-2 p-1 bg-gray-100 rounded-lg">
                    {['savings', 'checking', 'fixed'].map(t => (
                      <button key={t} type="button" onClick={() => setFormType(t)} className={`flex-1 capitalize text-xs py-1.5 rounded-md font-semibold transition-all ${formType === t ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <Input placeholder="Acc Number" required value={newAcc.number} onChange={e => setNewAcc({...newAcc, number: e.target.value})} />
                     <Input placeholder="Holder Name" required value={newAcc.name} onChange={e => setNewAcc({...newAcc, name: e.target.value})} />
                  </div>
                  <Input placeholder="Initial Balance" type="number" required value={newAcc.balance} onChange={e => setNewAcc({...newAcc, balance: e.target.value})} />
                  {formType === 'savings' && <Input placeholder="Interest Rate %" type="number" required value={newAcc.rate} onChange={e => setNewAcc({...newAcc, rate: e.target.value})} />}
                  {formType === 'checking' && <Input placeholder="Overdraft Limit" type="number" required value={newAcc.limit} onChange={e => setNewAcc({...newAcc, limit: e.target.value})} />}
                  {formType === 'fixed' && <Input placeholder="Term (Months)" type="number" required value={newAcc.term} onChange={e => setNewAcc({...newAcc, term: e.target.value})} />}
                  <Button variant="secondary" type="submit" className="w-full justify-center mt-2">Create Account</Button>
                </form>
              </Card>

              <Card className="border-t-4 border-t-blue-500">
                 <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5" /> Teller Machine</h3>
                <form onSubmit={handleTransaction} className="space-y-3">
                  <Input placeholder="Target Account #" required value={transaction.accNum} onChange={e => setTransaction({...transaction, accNum: e.target.value})} />
                  <Input placeholder="Amount" type="number" required value={transaction.amount} onChange={e => setTransaction({...transaction, amount: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button onClick={() => setTransaction(prev => ({...prev, type: 'deposit'}))} className={transaction.type === 'deposit' ? 'ring-2 ring-emerald-500 bg-emerald-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} type="submit">Deposit</Button>
                    <Button onClick={() => setTransaction(prev => ({...prev, type: 'withdraw'}))} className={transaction.type === 'withdraw' ? 'ring-2 ring-red-500 bg-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} type="submit">Withdraw</Button>
                  </div>
                </form>
              </Card>

               <Card className="border-t-4 border-t-purple-500">
                 <h3 className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2"><Calculator className="w-5 h-5" /> FD Yield Projection</h3>
                <p className="text-xs text-slate-500 mb-4">Calculate returns for all Fixed Deposits (5% rate)</p>
                <Button variant="outline" className="w-full justify-center text-sm" onClick={() => setShowYields(!showYields)}>{showYields ? 'Hide Projections' : 'Calculate All Yields'}</Button>
                {showYields && (
                  <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
                    {fixedDepositYields.length === 0 ? <p className="text-sm text-gray-400">No FD accounts found.</p> : 
                      fixedDepositYields.map((fd, idx) => (
                        <div key={idx} className="flex justify-between text-sm p-2 bg-purple-50 rounded">
                          <span>#{fd.number}</span>
                          <span className="font-bold text-purple-700">+{fd.interest.toFixed(2)}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4">
               {accounts.map(acc => (
                 <Card key={acc.number} className="flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-lg transition-shadow">
                   <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-full ${acc.type === 'savings' ? 'bg-purple-100 text-purple-600' : acc.type === 'checking' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                       {acc.type === 'savings' ? <Wallet /> : acc.type === 'checking' ? <CreditCard /> : <Clock />}
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-800">{acc.name}</h4>
                       <div className="flex gap-2 mt-1">
                         <Badge color={acc.type === 'savings' ? 'purple' : acc.type === 'checking' ? 'blue' : 'orange'}>{acc.type.toUpperCase()}</Badge>
                         <span className="text-xs text-gray-500 font-mono self-center">#{acc.number}</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="text-right flex flex-col items-end gap-2">
                     <div>
                        <div className="text-2xl font-black text-slate-800">${acc.balance.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {acc.type === 'savings' && `Interest: ${acc.rate}%`}
                          {acc.type === 'checking' && `Overdraft: $${acc.limit}`}
                          {acc.type === 'fixed' && `Term: ${acc.term}mo (5% Return)`}
                        </div>
                     </div>
                     <Button variant="outline" className="!px-3 !py-1 text-xs" onClick={() => setHistoryViewAcc(acc.number)}><History className="w-3 h-3" /> History</Button>
                   </div>
                 </Card>
               ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Backend Source Panel */}
      {showKernel && (
        <div className="w-1/2 bg-[#1e1e1e] flex flex-col border-l border-gray-700 animate-slideLeft">
          <div className="p-3 bg-black/40 border-b border-gray-700 flex justify-between items-center">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500"/> Banking Kernel (C++)
            </span>
            <span className="text-[10px] text-gray-600">Read-Only Access</span>
          </div>
          <CodeViewer code={BANKING_CPP} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// --- MODULE 3: C++ GAME RUNNER ---
// ==========================================

// --- C++ Source Code Constants ---
const HANGMAN_CPP = `#include <iostream>
#include <string>
#include <vector>

void drawHangman(int lives) {
    switch (lives) {
        case 6: std::cout << " +---+\\n |   |\\n     |\\n"; break;
        // ... (rest of drawing logic)
    }
}

int main() {
    std::string word = "hangman";
    std::vector<char> guessedWord(word.size(), '_');
    int lives = 6;
    while (lives > 0) {
        drawHangman(lives);
        std::cout << "Guess a letter: ";
        char guess;
        std::cin >> guess;
    }
    return 0;
}`;

const NUMBER_CPP = `#include <iostream>
#include <cstdlib>
#include <ctime>

int main() {
    srand(time(0));
    int numberToGuess = rand() % 100 + 1;
    int tries = 0;
    while (true) {
        int userGuess;
        std::cout << "Guess a number between 1 and 100: ";
        std::cin >> userGuess;
        tries++;
        if (userGuess == numberToGuess) break;
    }
    return 0;
}`;

const RPS_CPP = `#include <iostream>
#include <cstdlib>
#include <ctime>

int main() {
    srand(time(0));
    while (true) {
        char userChoice;
        std::cout << "Enter choice (r/p/s): ";
        std::cin >> userChoice;
    }
    return 0;
}`;

const TICTACTOE_CPP = `#include <iostream>
#include <vector>

void drawBoard(const std::vector<std::vector<char>>& board) {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) std::cout << board[i][j] << " ";
        std::cout << "\\n";
    }
}

int main() {
    std::vector<std::vector<char>> board(3, std::vector<char>(3, '-'));
    char currentPlayer = 'X';
    while (true) {
        drawBoard(board);
        int row, col;
        std::cout << "Player " << currentPlayer << ", enter move: ";
        std::cin >> row >> col;
    }
    return 0;
}`;

// --- Game Logic Classes ---
const HANGMAN_PICS = [
  `
  +---+
  |   |
      |
      |
      |
      |
  `,
  `
  +---+
  |   |
  O   |
      |
      |
      |
  `,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
  `,
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
  `,
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
  `,
  `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
  `,
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
  `
];

class HangmanGame {
  constructor() {
    this.word = "hangman";
    this.guessedWord = Array(this.word.length).fill('_');
    this.lives = 6;
    this.output = ["--- HANGMAN ---", this.getArt(), this.guessedWord.join(" "), "Guess a letter: "];
    this.isGameOver = false;
  }
  getArt() {
    return HANGMAN_PICS[6 - this.lives] || HANGMAN_PICS[6];
  }
  processInput(input) {
    const guess = input.toLowerCase()[0];
    if (!guess) return this;
    let correctGuess = false;
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i] === guess) {
        this.guessedWord[i] = guess;
        correctGuess = true;
      }
    }
    if (!correctGuess) this.lives--;
    
    const won = !this.guessedWord.includes('_');
    const lost = this.lives === 0;
    
    const newOutput = [`You guessed: ${guess}`, !correctGuess ? `Incorrect! Lives: ${this.lives}` : "Correct!", this.getArt(), this.guessedWord.join(" ")];
    
    if (won) { newOutput.push("Congratulations! You won!"); this.isGameOver = true; }
    else if (lost) { newOutput.push(`Game over! The word was "${this.word}".`); this.isGameOver = true; }
    else newOutput.push("Guess a letter: ");
    
    this.output = newOutput;
    return this;
  }
}

class NumberGuessingGame {
  constructor() {
    this.target = Math.floor(Math.random() * 100) + 1;
    this.tries = 0;
    this.output = ["--- NUMBER GUESSING ---", "I have picked a number between 1 and 100.", "Guess a number: "];
    this.isGameOver = false;
  }
  processInput(input) {
    const guess = parseInt(input);
    if (isNaN(guess)) { this.output = ["Invalid number. Guess again: "]; return this; }
    this.tries++;
    if (guess === this.target) { this.output = [`Congratulations! You found the number in ${this.tries} tries.`]; this.isGameOver = true; }
    else if (guess < this.target) this.output = [`${guess} is too low! Try again: `];
    else this.output = [`${guess} is too high! Try again: `];
    return this;
  }
}

class RPSGame {
  constructor() {
    this.output = ["--- ROCK PAPER SCISSORS ---", "Enter choice (r for rock, p for paper, s for scissors): "];
    this.isGameOver = false;
  }
  processInput(input) {
    const userChoice = input.toLowerCase()[0];
    if (!['r', 'p', 's'].includes(userChoice)) { this.output = ["Invalid choice. Enter r, p, or s: "]; return this; }
    const choices = ['r', 'p', 's'];
    const compChoice = choices[Math.floor(Math.random() * 3)];
    const map = { r: 'Rock', p: 'Paper', s: 'Scissors' };
    let result = "";
    if (userChoice === compChoice) result = "It's a tie!";
    else if ((userChoice === 'r' && compChoice === 's') || (userChoice === 's' && compChoice === 'p') || (userChoice === 'p' && compChoice === 'r')) result = "You win!";
    else result = "Computer wins!";
    this.output = [`You chose: ${map[userChoice]}`, `Computer chose: ${map[compChoice]}`, result, "--- Game Over ---"];
    this.isGameOver = true;
    return this;
  }
}

class TicTacToeGame {
  constructor() {
    this.board = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
    this.currentPlayer = 'X';
    this.output = ["--- TIC TAC TOE ---", this.drawBoard(), `Player ${this.currentPlayer}, enter move (row col, e.g. '0 1'): `];
    this.isGameOver = false;
  }
  drawBoard() { return this.board.map(row => row.join(" ")).join("\n"); }
  checkWin(player) {
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] === player && this.board[i][1] === player && this.board[i][2] === player) return true;
      if (this.board[0][i] === player && this.board[1][i] === player && this.board[2][i] === player) return true;
    }
    if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) return true;
    if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) return true;
    return false;
  }
  processInput(input) {
    const parts = input.trim().split(/\s+/);
    if (parts.length !== 2) { this.output = ["Invalid format. Use 'row col': "]; return this; }
    const row = parseInt(parts[0]), col = parseInt(parts[1]);
    if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) { this.output = ["Out of bounds. Enter 0-2: "]; return this; }
    if (this.board[row][col] !== '-') { this.output = ["Space occupied! Try again: "]; return this; }
    this.board[row][col] = this.currentPlayer;
    if (this.checkWin(this.currentPlayer)) { this.output = [this.drawBoard(), `Player ${this.currentPlayer} wins!`, "--- Game Over ---"]; this.isGameOver = true; }
    else { this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; this.output = [this.drawBoard(), `Player ${this.currentPlayer}, enter move: `]; }
    return this;
  }
}

const CppRunnerSystem = ({ onBack }) => {
  const [history, setHistory] = useState(["Welcome to C++ Runner.", "Click a game in the sidebar to compile & run.", " "]);
  const [inputVal, setInputVal] = useState("");
  const [currentGame, setCurrentGame] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [activeCode, setActiveCode] = useState("");
  const [showCode, setShowCode] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const startGame = (type) => {
    let game, name, source;
    switch (type) {
      case 'hangman': game = new HangmanGame(); name = "Hangman"; source = HANGMAN_CPP; break;
      case 'number': game = new NumberGuessingGame(); name = "Number Guessing"; source = NUMBER_CPP; break;
      case 'rps': game = new RPSGame(); name = "Rock Paper Scissors"; source = RPS_CPP; break;
      case 'tictactoe': game = new TicTacToeGame(); name = "Tic Tac Toe"; source = TICTACTOE_CPP; break;
      default: return;
    }
    setCurrentGame(game);
    setGameName(name);
    setActiveCode(source);
    setHistory([`> g++ ${name.toLowerCase().replace(/\s/g, '_')}.cpp -o game`, `> ./game`, ...game.output]);
  };

  const handleInput = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const cmd = inputVal;
    setInputVal("");
    if (!currentGame) { setHistory([...history, `> ${cmd}`, "No game running. Please select a game from the sidebar."]); return; }
    currentGame.processInput(cmd);
    setHistory(prev => [...prev, `> ${cmd}`, ...currentGame.output]);
    if (currentGame.isGameOver) {
      setCurrentGame(null);
      setGameName(null);
      setHistory(prev => [...prev, " ", "Process finished with exit code 0."]);
    }
  };

  return (
    <div className="h-screen bg-neutral-950 text-gray-200 font-sans flex flex-col md:flex-row overflow-hidden absolute inset-0 z-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col z-10 shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2 text-white"><Cpu className="w-5 h-5 text-blue-500" /> C++ Runner</h1>
            <p className="text-xs text-neutral-500 mt-1">Web Assembly Simulator</p>
          </div>
          <button onClick={onBack} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Available Programs</h2>
            <div className="space-y-2">
              {[{ id: 'hangman', label: '1. Word Guessing', color: 'text-green-400', icon: FileCode }, { id: 'number', label: '2. Number Guessing', color: 'text-blue-400', icon: FileCode }, { id: 'rps', label: '3. Rock Paper Scissors', color: 'text-yellow-400', icon: FileCode }, { id: 'tictactoe', label: '4. Tic Tac Toe', color: 'text-red-400', icon: FileCode }].map((item) => (
                <button key={item.id} onClick={() => startGame(item.id)} disabled={!!currentGame} className={`w-full text-left px-3 py-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-3 border border-transparent hover:border-neutral-700 group ${currentGame && 'opacity-30'}`}>
                  <div className={`p-1.5 rounded bg-neutral-900 ${item.color}`}><item.icon className="w-4 h-4" /></div>
                  <span className="font-medium text-neutral-300 group-hover:text-white">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">System Controls</h2>
            <button onClick={() => { setCurrentGame(null); setGameName(null); setHistory([...history, "^C", "Terminated."]); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-red-900/10 text-red-400 text-sm flex items-center gap-2 transition-colors"><X className="w-4 h-4" /> Stop Execution</button>
            <button onClick={() => setHistory([])} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-800 text-neutral-400 text-sm flex items-center gap-2 transition-colors mt-1"><RefreshCw className="w-4 h-4" /> Clear Console</button>
          </div>
        </div>
      </div>
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-neutral-400 bg-black/20 px-3 py-1 rounded text-sm"><Terminal className="w-4 h-4" /> <span>Console</span></div>
             {showCode && <div className="hidden md:flex items-center gap-2 text-neutral-400 bg-neutral-800 px-3 py-1 rounded text-sm border-l border-green-500/50"><Code className="w-4 h-4 text-green-500" /> <span>{gameName ? `${gameName.replace(/\s/g,'_')}.cpp` : 'Source Viewer'}</span></div>}
          </div>
          <button onClick={() => setShowCode(!showCode)} className="text-neutral-400 hover:text-white p-2 rounded hover:bg-neutral-800 transition-colors hidden md:block" title="Toggle Split View"><Layout className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div className={`flex-1 flex flex-col bg-black p-4 font-mono transition-all duration-300 ${showCode ? 'md:w-1/2 border-r border-neutral-800' : 'w-full'}`}>
            <div className="flex-1 overflow-y-auto custom-scrollbar" onClick={() => document.getElementById('terminal-input')?.focus()}>
              {history.map((line, i) => <div key={i} className={`whitespace-pre-wrap leading-relaxed mb-1 ${line.startsWith('>') ? 'text-white font-bold' : 'text-green-400/90'}`}>{line}</div>)}
              <form onSubmit={handleInput} className="flex mt-2 items-center group">
                <span className="text-blue-500 mr-2 font-bold">$</span>
                <input id="terminal-input" type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="bg-transparent border-none outline-none text-white w-full font-mono focus:ring-0 placeholder-neutral-700" autoFocus autoComplete="off" placeholder={currentGame ? "Type input here..." : "Waiting for program..."} />
              </form>
              <div ref={bottomRef} />
            </div>
          </div>
          {showCode && <div className="flex-1 bg-neutral-900 flex flex-col border-t md:border-t-0 md:h-auto h-1/2 md:w-1/2 relative"><div className="absolute top-0 right-0 p-2 z-10"><span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 bg-black/50 px-2 py-1 rounded border border-neutral-800">Read Only</span></div><CodeViewer code={activeCode} /></div>}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- MAIN APP SHELL ---
// ==========================================

export default function App() {
  const [activeApp, setActiveApp] = useState(null); 

  if (activeApp === 'railway') return <RailwaySystem onBack={() => setActiveApp(null)} />;
  if (activeApp === 'banking') return <BankingSystem onBack={() => setActiveApp(null)} />;
  if (activeApp === 'cpp') return <CppRunnerSystem onBack={() => setActiveApp(null)} />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl w-full z-10 relative">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Activity className="w-3 h-3" /> System Online
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            CyberForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">Systems</span>
          </h1>
          <p className="text-gray-500 text-xl font-light max-w-2xl mx-auto">
            Advanced enterprise architecture with unified C++ kernel visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Railway Card */}
          <button 
            onClick={() => setActiveApp('railway')}
            className="group relative bg-[#15151a] border border-white/5 rounded-2xl p-8 text-left transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#1a1a20]"
          >
            <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Train className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Railway Logistics</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Fleet scheduling, route optimization, and passenger reservation logistics.</p>
            <div className="flex items-center text-indigo-500 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Initialize Module <ArrowRight className="ml-2 w-3 h-3" />
            </div>
          </button>

          {/* Banking Card */}
          <button 
            onClick={() => setActiveApp('banking')}
            className="group relative bg-[#15151a] border border-white/5 rounded-2xl p-8 text-left transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#1a1a20]"
          >
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Landmark className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Core Banking</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Secure transaction ledger, polymorphic account management, and audits.</p>
            <div className="flex items-center text-emerald-500 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Initialize Module <ArrowRight className="ml-2 w-3 h-3" />
            </div>
          </button>

           {/* C++ Card */}
           <button 
            onClick={() => setActiveApp('cpp')}
            className="group relative bg-[#15151a] border border-white/5 rounded-2xl p-8 text-left transition-all duration-300 hover:border-blue-500/50 hover:bg-[#1a1a20]"
          >
            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Terminal className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">C++ Runtime</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Web Assembly simulator for running compiled legacy game algorithms.</p>
            <div className="flex items-center text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Initialize Module <ArrowRight className="ml-2 w-3 h-3" />
            </div>
          </button>
        </div>
        
        <div className="mt-16 flex justify-between items-center text-xs text-gray-600 border-t border-white/5 pt-8">
            <p>CyberForge Systems v4.0.1</p>
            <p className="font-mono">SYS_STATUS: OPTIMAL</p>
        </div>
      </div>
    </div>
  );
}