import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Train, Landmark, Plus, Search, Trash2, ArrowRight, LayoutDashboard, 
  TrendingUp, CreditCard, Wallet, Clock, DollarSign, MapPin, Calendar, 
  Ticket, User, Calculator, FileText, X, History, Terminal, Code, Cpu, 
  Play, RefreshCw, Layout, Info, FileCode, Home, Box, Activity, ChevronRight,
  ShieldCheck, Lock, Zap, HardDrive, Network, Power, Gamepad2
} from 'lucide-react';

// ==========================================
// --- STYLES & ANIMATIONS ---
// ==========================================

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
    
    :root {
      font-family: 'JetBrains Mono', monospace;
      color-scheme: dark;
    }

    /* Custom Tech Scrollbar */
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: #050505; 
    }
    ::-webkit-scrollbar-thumb {
      background: #333; 
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555; 
    }

    /* CRT Scanline Effect - Subtle Tech feel */
    .scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.05) 50%,
        rgba(0,0,0,0.05)
      );
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 10;
      opacity: 0.3;
    }

    .tech-border {
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(10, 10, 12, 0.95);
    }

    /* Selection Highlight */
    ::selection {
      background: #f59e0b;
      color: #000;
    }

    /* --- DATE PICKER STYLING --- */
    input[type="date"] {
        color-scheme: dark;
    }
    
    /* Make the calendar icon YELLOW/AMBER using CSS filters */
    input[type="date"]::-webkit-calendar-picker-indicator {
        /* This filter combo generates a bright yellow/amber color from the default icon */
        filter: invert(86%) sepia(49%) saturate(3046%) hue-rotate(359deg) brightness(101%) contrast(106%);
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.9;
    }

    input[type="date"]::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
        background-color: rgba(251, 191, 36, 0.15); /* Yellow/Amber tint */
        transform: scale(1.15); 
        box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); /* Yellow glow */
    }
  `}</style>
);

// ==========================================
// --- GAME LOGIC ENGINES (Restored) ---
// ==========================================

const HANGMAN_PICS = [
  `+---+\n|   |\n    |\n    |\n    |\n    |`,
  `+---+\n|   |\nO   |\n    |\n    |\n    |`,
  `+---+\n|   |\nO   |\n|   |\n    |\n    |`,
  `+---+\n|   |\nO   |\n/|   |\n    |\n    |`,
  `+---+\n|   |\nO   |\n/|\\  |\n    |\n    |`,
  `+---+\n|   |\nO   |\n/|\\  |\n/    |\n    |`,
  `+---+\n|   |\nO   |\n/|\\  |\n/ \\  |\n    |`
];

class HangmanGame {
  constructor() {
    this.word = "SYSTEM";
    this.guessedWord = Array(this.word.length).fill('_');
    this.lives = 6;
    this.output = ["--- HANGMAN V1.0 ---", this.getArt(), this.guessedWord.join(" "), "Enter a letter to decrypt: "];
    this.isGameOver = false;
  }
  getArt() { return HANGMAN_PICS[6 - this.lives] || HANGMAN_PICS[6]; }
  processInput(input) {
    const guess = input.toUpperCase()[0];
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
    
    const newOutput = [`Input: ${guess}`, !correctGuess ? `ERROR! Integrity Dropped. Lives: ${this.lives}` : "MATCH FOUND.", this.getArt(), this.guessedWord.join(" ")];
    
    if (won) { newOutput.push("DECRYPTION COMPLETE. YOU WIN."); this.isGameOver = true; }
    else if (lost) { newOutput.push(`SYSTEM LOCKED. PASSWORD WAS "${this.word}".`); this.isGameOver = true; }
    else newOutput.push("Enter next char: ");
    
    this.output = newOutput;
    return this;
  }
}

class NumberGuessingGame {
  constructor() {
    this.target = Math.floor(Math.random() * 100) + 1;
    this.tries = 0;
    this.output = ["--- NUMBER CRUNCHER ---", "Target initialized [1-100].", "Enter estimate: "];
    this.isGameOver = false;
  }
  processInput(input) {
    const guess = parseInt(input);
    if (isNaN(guess)) { this.output = ["Invalid type. Integer required: "]; return this; }
    this.tries++;
    if (guess === this.target) { this.output = [`MATCH FOUND in ${this.tries} cycles. WIN.`]; this.isGameOver = true; }
    else if (guess < this.target) this.output = [`${guess} is TOO LOW. Adjust up: `];
    else this.output = [`${guess} is TOO HIGH. Adjust down: `];
    return this;
  }
}

class RPSGame {
  constructor() {
    this.output = ["--- ROCK PAPER SCISSORS ---", "Select Weapon (r/p/s): "];
    this.isGameOver = false;
  }
  processInput(input) {
    const userChoice = input.toLowerCase()[0];
    if (!['r', 'p', 's'].includes(userChoice)) { this.output = ["Invalid weapon. (r)ock, (p)aper, (s)cissors: "]; return this; }
    const choices = ['r', 'p', 's'];
    const compChoice = choices[Math.floor(Math.random() * 3)];
    const map = { r: 'ROCK', p: 'PAPER', s: 'SCISSORS' };
    let result = "";
    if (userChoice === compChoice) result = "TIE GAME.";
    else if ((userChoice === 'r' && compChoice === 's') || (userChoice === 's' && compChoice === 'p') || (userChoice === 'p' && compChoice === 'r')) result = "PLAYER VICTORIOUS.";
    else result = "CPU VICTORIOUS.";
    this.output = [`Player: ${map[userChoice]}`, `CPU: ${map[compChoice]}`, result, "--- TERMINATED ---"];
    this.isGameOver = true;
    return this;
  }
}

class TicTacToeGame {
  constructor() {
    this.board = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
    this.currentPlayer = 'X';
    this.output = ["--- TIC TAC TOE ---", this.drawBoard(), `Player ${this.currentPlayer}, input coords 'row col' (0-2): `];
    this.isGameOver = false;
  }
  drawBoard() { return this.board.map(row => row.join(" ")).join("\n"); }
  checkWin(player) {
    // Rows & Cols
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] === player && this.board[i][1] === player && this.board[i][2] === player) return true;
      if (this.board[0][i] === player && this.board[1][i] === player && this.board[2][i] === player) return true;
    }
    // Diagonals
    if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) return true;
    if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) return true;
    return false;
  }
  processInput(input) {
    const parts = input.trim().split(/\s+/);
    if (parts.length !== 2) { this.output = ["Syntax Error. Use 'row col': "]; return this; }
    const row = parseInt(parts[0]), col = parseInt(parts[1]);
    if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) { this.output = ["Index Out of Bounds (0-2): "]; return this; }
    if (this.board[row][col] !== '-') { this.output = ["Memory Address Occupied! Retry: "]; return this; }
    this.board[row][col] = this.currentPlayer;
    if (this.checkWin(this.currentPlayer)) { this.output = [this.drawBoard(), `PLAYER ${this.currentPlayer} WINS.`, "--- TERMINATED ---"]; this.isGameOver = true; }
    else { this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; this.output = [this.drawBoard(), `Player ${this.currentPlayer}, input: `]; }
    return this;
  }
}

// ==========================================
// --- SHARED UI COMPONENTS ---
// ==========================================

const Card = ({ children, className = "", highlight = "gray" }) => {
  const highlightColors = {
    amber: "hover:border-amber-500/50",
    cyan: "hover:border-cyan-500/50",
    rose: "hover:border-rose-500/50",
    gray: "hover:border-gray-500/50"
  };

  return (
    <div className={`tech-border rounded-lg transition-all duration-300 p-6 relative group ${highlightColors[highlight]} ${className}`}>
      <div className="absolute top-0 left-0 w-1 h-1 bg-white/10 group-hover:bg-white/50 transition-colors" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-white/50 transition-colors" />
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = "", type = "button", disabled = false, title = "" }) => {
  const variants = {
    primary: "bg-amber-500 text-black hover:bg-amber-400 font-bold",
    secondary: "bg-cyan-600 text-white hover:bg-cyan-500 font-bold",
    danger: "border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    outline: "border border-gray-700 text-gray-300 hover:border-white hover:text-white",
  };
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-5 py-2 uppercase text-xs tracking-wider transition-all active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-sm ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>}
    <input 
      className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-gray-200 focus:border-amber-500 focus:ring-0 outline-none transition-colors placeholder-gray-700 font-mono text-sm rounded-sm"
      {...props}
    />
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-900/20 text-blue-400 border-blue-500/30",
    green: "bg-emerald-900/20 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-900/20 text-amber-400 border-amber-500/30",
    cyan: "bg-cyan-900/20 text-cyan-400 border-cyan-500/30",
    rose: "bg-rose-900/20 text-rose-400 border-rose-500/30",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const CodeViewer = ({ code }) => {
  const highlight = (text) => {
    const keywords = ['#include', 'void', 'int', 'char', 'string', 'vector', 'while', 'for', 'if', 'else', 'switch', 'case', 'break', 'return', 'true', 'false', 'class', 'public', 'private', 'using', 'namespace', 'std', 'struct', 'virtual', 'override', 'protected', 'bool', 'double', 'const', 'auto'];
    return text.split('\n').map((line, i) => {
      const tokens = line.split(/(\s+|[(){};,<>])/);
      return (
        <div key={i} className="leading-relaxed whitespace-pre font-mono">
          <span className="text-gray-700 select-none mr-4 text-[10px] w-6 inline-block text-right">{i + 1}</span>
          {tokens.map((token, j) => {
            if (keywords.includes(token)) return <span key={j} className="text-[#ff79c6]">{token}</span>; 
            if (token.startsWith('"') || token.startsWith("'")) return <span key={j} className="text-[#f1fa8c]">{token}</span>; 
            if (token.startsWith('//')) return <span key={j} className="text-[#6272a4] italic">{token}</span>; 
            if (['std', 'cout', 'cin', 'endl', 'vector', 'string'].includes(token)) return <span key={j} className="text-[#8be9fd]">{token}</span>; 
            return <span key={j} className="text-[#f8f8f2]">{token}</span>;
          })}
        </div>
      );
    });
  };
  return (
    <div className="font-mono text-xs overflow-auto h-full p-4 bg-[#0a0a0a] relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-600 font-bold uppercase">Backend Source Code</div>
      {code ? highlight(code) : <div className="text-gray-600 italic flex items-center gap-2 mt-20 justify-center"><Code className="w-5 h-5"/> Awaiting Input...</div>}
    </div>
  );
};

// ==========================================
// --- MODULE 1: RAILWAY SYSTEM ---
// ==========================================

const RAILWAY_CPP = `#include <iostream>
#include <vector>
#include <string>

// -- CORE ENTITIES --
struct Train {
    int id;
    std::string name;
    std::string source;
    std::string destination;
    std::string time;
};

// -- SYSTEM CONTROLLER --
class RailwayManager {
private:
    std::vector<Train> fleet;
public:
    void addTrain(int id, std::string name, std::string src, std::string dest) {
        // High-speed O(1) insertion
        fleet.push_back({id, name, src, dest});
        std::cout << "[SYS] Unit " << id << " active.\\n";
    }
};`;

const RailwaySystem = ({ onBack }) => {
  const [view, setView] = useState('trains'); 
  const [showKernel, setShowKernel] = useState(false);
  const [trains, setTrains] = useState([
    { id: 22436, name: 'Vande Bharat Exp', source: 'New Delhi', dest: 'Varanasi', time: '06:00' },
    { id: 12951, name: 'Rajdhani Exp', source: 'Mumbai Central', dest: 'New Delhi', time: '17:00' },
    { id: 12009, name: 'Shatabdi Exp', source: 'Mumbai Central', dest: 'Ahmedabad', time: '06:20' },
  ]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrain, setNewTrain] = useState({ id: '', name: '', source: '', dest: '', time: '' });
  
  const [bookingTrainId, setBookingTrainId] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => {
    return {
      total: trains.length,
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
    if (window.confirm(`Are you sure you want to delete train #${id}?`)) {
      setTrains(trains.filter(t => t.id !== id));
    }
  };

  const handleBookTicket = (e) => {
    e.preventDefault();
    const train = trains.find(t => t.id === bookingTrainId);
    if (!train) return;
    setBookings([...bookings, {
      id: Date.now(),
      passenger: passengerName,
      trainName: train.name,
      trainId: train.id,
      source: train.source,
      dest: train.dest,
      date: bookingDate
    }]);
    setBookingTrainId(null);
    setPassengerName('');
  };

  const handleCancelBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const filteredTrains = trains.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex h-screen overflow-hidden text-gray-300 font-mono">
      <div className={`flex-1 flex flex-col transition-all duration-300 bg-[#080808] relative ${showKernel ? 'w-1/2' : 'w-full'}`}>
        <div className="scanline"></div>
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0c0c0c]">
          <div className="flex items-center gap-4">
             <Train className="w-6 h-6 text-amber-500" />
             <h1 className="text-xl font-bold tracking-widest text-white uppercase">Train<span className="text-amber-500">Manager</span></h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-amber-900/50 text-amber-500 hover:border-amber-500" onClick={() => setShowKernel(!showKernel)}>
              <Code className="w-4 h-4" /> View Code
            </Button>
            <Button variant="danger" onClick={onBack}> <Power className="w-4 h-4"/> Exit</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="!p-4 border-l-2 border-l-amber-500 flex items-center justify-between bg-amber-900/5">
              <div>
                <div className="text-[10px] text-amber-500/80 uppercase tracking-wider">Total Trains</div>
                <div className="text-2xl text-white font-bold">{stats.total}</div>
              </div>
              <Train className="w-5 h-5 text-amber-500 opacity-50" />
            </Card>
            <Card className="!p-4 border-l-2 border-l-gray-600 flex items-center justify-between bg-gray-900/5">
              <div>
                <div className="text-[10px] text-gray-500/80 uppercase tracking-wider">Total Bookings</div>
                <div className="text-2xl text-white font-bold">{stats.bookings}</div>
              </div>
              <Ticket className="w-5 h-5 text-gray-500 opacity-50" />
            </Card>
          </div>

          <div className="flex gap-2 border-b border-gray-800 pb-2">
            <button onClick={() => setView('trains')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${view === 'trains' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-600 hover:text-gray-400'}`}>All Trains</button>
            <button onClick={() => setView('bookings')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${view === 'bookings' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-600 hover:text-gray-400'}`}>My Bookings</button>
          </div>

          {view === 'trains' && (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="Search trains..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="w-4 h-4" /> Add Train
                </Button>
              </div>

              {showAddForm && (
                <Card className="border-l-2 border-l-amber-500 animate-slideDown bg-[#0f0f11]">
                  <form onSubmit={handleAddTrain} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <Input label="Train No" required type="number" value={newTrain.id} onChange={e => setNewTrain({...newTrain, id: e.target.value})} />
                    <Input label="Train Name" required value={newTrain.name} onChange={e => setNewTrain({...newTrain, name: e.target.value})} />
                    <Input label="From Station" required value={newTrain.source} onChange={e => setNewTrain({...newTrain, source: e.target.value})} />
                    <Input label="To Station" required value={newTrain.dest} onChange={e => setNewTrain({...newTrain, dest: e.target.value})} />
                    <Input label="Time" required type="time" value={newTrain.time} onChange={e => setNewTrain({...newTrain, time: e.target.value})} />
                    <Button type="submit" className="md:col-span-2 lg:col-span-5 w-full">Save Train</Button>
                  </form>
                </Card>
              )}

              {bookingTrainId && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                  <Card className="w-full max-w-md border border-amber-500/50">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
                      <h3 className="text-lg font-bold text-amber-500 uppercase">Book Ticket</h3>
                      <button onClick={() => setBookingTrainId(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="mb-6 p-2 bg-amber-900/10 border border-amber-900/30 text-amber-200 text-xs font-mono">
                      BOOKING FOR: {trains.find(t => t.id === bookingTrainId)?.name}
                    </div>
                    <form onSubmit={handleBookTicket} className="space-y-4">
                      <Input label="Passenger Name" placeholder="e.g. Rahul Sharma" required value={passengerName} onChange={(e) => setPassengerName(e.target.value)} autoFocus />
                      
                      {/* --- FEATURE: CALENDAR DATE PICKER --- */}
                      <Input 
                        label="Travel Date" 
                        type="date" 
                        required 
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)} 
                        min={new Date().toISOString().split('T')[0]} 
                      />
                      
                      <div className="flex gap-2 justify-end mt-6">
                        <Button variant="ghost" onClick={() => setBookingTrainId(null)}>Cancel</Button>
                        <Button type="submit">Confirm Booking</Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {filteredTrains.map(train => (
                  <Card key={train.id} highlight="amber" className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-amber-500 font-bold text-lg">{train.name}</span>
                        <Badge color="amber">#{train.id}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                        <span>From: {train.source}</span>
                        <ChevronRight className="w-3 h-3 text-gray-700"/>
                        <span>To: {train.dest}</span>
                        <span className="text-white ml-2 px-2 py-0.5 bg-gray-800">{train.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="outline" className="text-xs !py-1" onClick={() => setBookingTrainId(train.id)}>Book Ticket</Button>
                       <button onClick={() => handleRemoveTrain(train.id)} className="p-2 text-gray-600 hover:text-rose-500 transition-colors" title="Delete Train"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

           {view === 'bookings' && (
             <div className="space-y-2">
                {bookings.map(b => (
                   <div key={b.id} className="border border-gray-800 p-3 flex justify-between items-center hover:bg-white/5 transition-colors rounded">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 bg-gray-800 flex items-center justify-center font-bold text-gray-400 rounded-full">{b.passenger[0]}</div>
                         <div>
                            <div className="font-bold text-white text-sm">{b.passenger}</div>
                            <div className="text-[10px] text-gray-500">{b.trainName} | {b.date}</div>
                         </div>
                      </div>
                      <button onClick={() => handleCancelBooking(b.id)} className="text-rose-500 hover:text-rose-400 text-xs uppercase font-bold tracking-wider">Cancel</button>
                   </div>
                ))}
                {bookings.length === 0 && <div className="text-center text-gray-600 text-xs py-10 uppercase tracking-widest">No Bookings Yet</div>}
             </div>
           )}
        </div>
      </div>
      
      {showKernel && (
        <div className="w-1/2 flex flex-col border-l border-gray-800">
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
    double balance;
public:
    virtual bool withdraw(double amount) = 0;
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
};

class BankCore {
    std::mutex transactionMutex;
public:
    void process(int acc, double amt) {
        std::lock_guard<std::mutex> lock(transactionMutex);
        // ... Secure Execution
    }
};`;

const BankingSystem = ({ onBack }) => {
  const [showKernel, setShowKernel] = useState(false);
  const [accounts, setAccounts] = useState([
    { number: '1001', name: 'John Smith', balance: 5000, type: 'savings', rate: 2.5 },
    { number: '1002', name: 'Tech Solutions Inc', balance: 15000, type: 'checking', limit: 500 },
  ]);
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [formType, setFormType] = useState('savings');
  const [newAcc, setNewAcc] = useState({ number: '', name: '', balance: '', rate: '', limit: '', term: '' });
  const [transaction, setTransaction] = useState({ accNum: '', amount: '', type: 'deposit' });
  const [lastReceipt, setLastReceipt] = useState(null);
  const [historyViewAcc, setHistoryViewAcc] = useState(null); // State for history modal

  const stats = useMemo(() => {
    return { totalLiquidity: accounts.reduce((acc, curr) => acc + curr.balance, 0) };
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
    
    // Initial deposit transaction
    const initialTx = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      type: 'deposit',
      amount: parseFloat(newAcc.balance),
      accNum: newAcc.number,
      accName: newAcc.name
    };

    setAccounts([...accounts, accountData]);
    setAllTransactions(prev => [initialTx, ...prev]);
    setNewAcc({ number: '', name: '', balance: '', rate: '', limit: '', term: '' });
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");

    let found = false;
    let receiptData = null;

    const updatedAccounts = accounts.map(acc => {
      if (acc.number === transaction.accNum) {
        found = true;
        let newBalance = acc.balance;

        if (transaction.type === 'deposit') newBalance += amount;
        else newBalance -= amount;

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
        
        setAllTransactions(prev => [{...receiptData, id: Date.now()}, ...prev]);
        return { ...acc, balance: newBalance };
      }
      return acc;
    });

    if (!found) alert("Account not found.");
    else {
      setAccounts(updatedAccounts);
      setLastReceipt(receiptData);
      setTransaction({ accNum: '', amount: '', type: 'deposit' });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-gray-300 font-mono">
      <div className={`flex-1 flex flex-col transition-all duration-300 bg-[#080808] relative ${showKernel ? 'w-1/2' : 'w-full'}`}>
        <div className="scanline"></div>
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0c0c0c]">
          <div className="flex items-center gap-4">
             <Landmark className="w-6 h-6 text-cyan-500" />
             <h1 className="text-xl font-bold tracking-widest text-white uppercase">Bank<span className="text-cyan-500">System</span></h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-cyan-900/50 text-cyan-500 hover:border-cyan-500" onClick={() => setShowKernel(!showKernel)}>
              <Code className="w-4 h-4" /> View Code
            </Button>
            <Button variant="danger" onClick={onBack}><Power className="w-4 h-4"/> Sign Out</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="w-full bg-cyan-900/10 border border-cyan-500/20 p-4 flex items-center justify-between rounded-lg">
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Total Deposits</span>
              <span className="text-2xl font-bold text-white tracking-tighter">${stats.totalLiquidity.toLocaleString()}</span>
           </div>

           {/* --- FEATURE: TRANSACTION HISTORY MODAL --- */}
           {historyViewAcc && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-lg border border-cyan-500 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                  <h3 className="text-lg font-bold text-cyan-500 uppercase">Transaction History</h3>
                  <button onClick={() => setHistoryViewAcc(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                  {allTransactions.filter(t => t.accNum === historyViewAcc).length === 0 ? (
                    <div className="text-center text-gray-600 py-10">No transactions found.</div>
                  ) : (
                    allTransactions.filter(t => t.accNum === historyViewAcc).map((tx, idx) => (
                      <div key={idx} className="p-3 bg-gray-900/50 border border-gray-800 rounded flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-gray-500">{tx.date}</div>
                          <div className="text-xs uppercase font-bold text-white">{tx.type}</div>
                        </div>
                        <div className={`font-mono font-bold ${tx.type === 'deposit' ? 'text-cyan-400' : 'text-rose-400'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
           )}

           {lastReceipt && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm border border-cyan-500">
                 <div className="bg-cyan-500 text-black p-4 text-center font-bold uppercase tracking-wider mb-4 rounded-sm">Success</div>
                 <div className="space-y-4 font-mono text-xs">
                   <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-500">Transaction ID</span><span className="text-cyan-500">{lastReceipt.id}</span></div>
                   <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-500">Type</span><span className="uppercase text-white">{lastReceipt.type}</span></div>
                   <div className="flex justify-between items-center pt-2"><span className="text-gray-500">Amount</span><span className={`text-xl font-bold ${lastReceipt.type === 'deposit' ? 'text-cyan-500' : 'text-rose-500'}`}>{lastReceipt.type === 'deposit' ? '+' : '-'}${lastReceipt.amount.toLocaleString()}</span></div>
                 </div>
                 <div className="mt-6"><Button variant="secondary" className="w-full" onClick={() => setLastReceipt(null)}>Close Receipt</Button></div>
              </Card>
            </div>
           )}

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             <div className="lg:col-span-4 space-y-6">
               <Card className="border-l-2 border-l-cyan-500">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Open New Account</h3>
                  <form onSubmit={handleCreateAccount} className="space-y-3">
                    <div className="flex gap-1 mb-2">
                      {['savings', 'checking', 'fixed'].map(t => (
                        <button key={t} type="button" onClick={() => setFormType(t)} className={`flex-1 text-[10px] py-2 uppercase font-bold border rounded-sm ${formType === t ? 'bg-cyan-500 text-black border-cyan-500' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>{t}</button>
                      ))}
                    </div>
                    <Input placeholder="Account No" required value={newAcc.number} onChange={e => setNewAcc({...newAcc, number: e.target.value})} />
                    <Input placeholder="Holder Name" required value={newAcc.name} onChange={e => setNewAcc({...newAcc, name: e.target.value})} />
                    <Input placeholder="Initial Balance ($)" type="number" required value={newAcc.balance} onChange={e => setNewAcc({...newAcc, balance: e.target.value})} />
                    <Button variant="secondary" type="submit" className="w-full mt-4">Create Account</Button>
                  </form>
               </Card>
               <Card className="border-l-2 border-l-rose-500">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Money Transfer</h3>
                  <form onSubmit={handleTransaction} className="space-y-3">
                    <Input placeholder="To Account No" required value={transaction.accNum} onChange={e => setTransaction({...transaction, accNum: e.target.value})} />
                    <Input placeholder="Amount ($)" type="number" required value={transaction.amount} onChange={e => setTransaction({...transaction, amount: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button onClick={() => setTransaction(prev => ({...prev, type: 'deposit'}))} variant="outline" type="submit">Deposit</Button>
                      <Button onClick={() => setTransaction(prev => ({...prev, type: 'withdraw'}))} variant="outline" className="text-rose-500 border-rose-900 hover:border-rose-500" type="submit">Withdraw</Button>
                    </div>
                  </form>
               </Card>
             </div>

             <div className="lg:col-span-8 space-y-4">
                {accounts.map(acc => (
                  <Card key={acc.number} highlight="cyan" className="flex justify-between items-center !bg-[#0c0c0e]">
                    <div className="flex items-center gap-4">
                       <div className="p-3 border border-gray-800 bg-black rounded-lg">
                          {acc.type === 'savings' ? <Wallet className="text-purple-400"/> : acc.type === 'checking' ? <CreditCard className="text-cyan-400"/> : <Lock className="text-amber-400"/>}
                       </div>
                       <div>
                         <div className="text-lg font-bold text-white tracking-wide">{acc.name}</div>
                         <div className="flex items-center gap-2 mt-1">
                           <Badge color={acc.type === 'savings' ? 'purple' : acc.type === 'checking' ? 'cyan' : 'amber'}>{acc.type}</Badge>
                           <span className="text-xs text-gray-600">#{acc.number}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="text-right">
                          <div className="text-2xl font-bold text-white tracking-tighter">${acc.balance.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Current Balance</div>
                       </div>
                       <Button variant="outline" className="text-xs !py-1 h-8" onClick={() => setHistoryViewAcc(acc.number)}>View History</Button>
                    </div>
                  </Card>
                ))}
             </div>
           </div>
        </div>
      </div>

      {showKernel && (
        <div className="w-1/2 flex flex-col border-l border-gray-800">
          <CodeViewer code={BANKING_CPP} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// --- MODULE 3: C++ GAME RUNNER ---
// ==========================================

const CppRunnerSystem = ({ onBack }) => {
  const [history, setHistory] = useState(["[SYSTEM] Game Console Ready...", "Type a game name to launch:", "1. Hangman", "2. Number Guess", "3. RPS", "4. TicTacToe", " "]);
  const [inputVal, setInputVal] = useState("");
  const [showCode, setShowCode] = useState(true);
  const [currentGame, setCurrentGame] = useState(null); // Tracks the active game instance
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  // --- FEATURE: GAME ENGINE START ---
  const startGame = (name) => {
    let game;
    switch(name) {
      case 'Hangman': game = new HangmanGame(); break;
      case 'Number Guess': game = new NumberGuessingGame(); break;
      case 'RPS': game = new RPSGame(); break;
      case 'TicTacToe': game = new TicTacToeGame(); break;
      default: return;
    }
    setCurrentGame(game);
    setHistory(prev => [...prev, `> Launching ${name}...`, ...game.output]);
  }

  const handleInput = (e) => {
    e.preventDefault();
    if(!inputVal.trim()) return;
    
    // If no game is running, check menu selection
    if (!currentGame) {
      const lowerInput = inputVal.toLowerCase();
      if (lowerInput.includes('hang') || lowerInput === '1') startGame('Hangman');
      else if (lowerInput.includes('numb') || lowerInput === '2') startGame('Number Guess');
      else if (lowerInput.includes('rps') || lowerInput === '3') startGame('RPS');
      else if (lowerInput.includes('tic') || lowerInput === '4') startGame('TicTacToe');
      else setHistory(prev => [...prev, `> ${inputVal}`, "Unknown command. Select a game."]);
    } else {
      // Pass input to active game
      currentGame.processInput(inputVal);
      setHistory(prev => [...prev, `> ${inputVal}`, ...currentGame.output]);
      if (currentGame.isGameOver) {
        setCurrentGame(null);
        setHistory(prev => [...prev, " ", "[SYSTEM] Returning to menu...", "1. Hangman", "2. Number Guess", "3. RPS", "4. TicTacToe"]);
      }
    }
    setInputVal("");
  }

  return (
    <div className="h-screen bg-[#050505] text-gray-300 font-mono flex flex-col md:flex-row overflow-hidden absolute inset-0 z-50">
      <div className="w-full md:w-64 bg-[#080808] border-r border-gray-800 flex flex-col z-10">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-lg font-bold flex items-center gap-2 text-rose-500 uppercase tracking-wider"><Gamepad2 className="w-5 h-5" /> Arcade</h1>
          <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">C++ Game Station</p>
        </div>
        <div className="p-4 space-y-6">
           <div>
            <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 pl-2">Quick Launch</h2>
             <div className="space-y-1">
               {['Hangman', 'Number Guess', 'RPS', 'TicTacToe'].map((g, i) => (
                 <button key={i} onClick={() => startGame(g)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-rose-500 transition-all flex items-center gap-3">
                   <FileCode className="w-3 h-3 text-gray-600" />
                   {g}
                 </button>
               ))}
             </div>
           </div>
           <Button variant="danger" className="w-full" onClick={onBack}>Exit to Menu</Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#030303] relative">
         <div className="h-10 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0a0a0a]">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
               <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
               Console Active
            </div>
            <button onClick={() => setShowCode(!showCode)} className="text-gray-600 hover:text-white"><Layout className="w-4 h-4" /></button>
         </div>

         <div className="flex-1 flex">
            <div className="flex-1 p-6 font-mono text-sm relative bg-black">
               <div className="h-full overflow-y-auto custom-scrollbar pb-10">
                  {history.map((line, i) => (
                    <div key={i} className={`mb-1 whitespace-pre-wrap ${line.startsWith('>') ? 'text-rose-500 font-bold' : 'text-gray-400'}`}>{line}</div>
                  ))}
                  <form onSubmit={handleInput} className="flex mt-2 items-center">
                    <span className="text-rose-500 mr-2">player@console:~$</span>
                    <input autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)} className="bg-transparent border-none outline-none text-white w-full caret-rose-500" />
                  </form>
                  <div ref={bottomRef} />
               </div>
            </div>
            {showCode && <div className="w-1/2 border-l border-gray-800 bg-[#080808]"><CodeViewer code={`// C++ Source Code Visualization\n// Logic is simulated in JavaScript for WebAssembly emulation.`} /></div>}
         </div>
      </div>
    </div>
  );
}

// ==========================================
// --- MAIN LANDING PAGE ---
// ==========================================

export default function App() {
  const [activeApp, setActiveApp] = useState(null); 

  if (activeApp === 'railway') return <><GlobalStyles /><RailwaySystem onBack={() => setActiveApp(null)} /></>;
  if (activeApp === 'banking') return <><GlobalStyles /><BankingSystem onBack={() => setActiveApp(null)} /></>;
  if (activeApp === 'cpp') return <><GlobalStyles /><CppRunnerSystem onBack={() => setActiveApp(null)} /></>;

  return (
    <>
    <GlobalStyles />
    <div className="min-h-screen bg-[#050505] text-gray-200 flex items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-amber-500/30">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)] z-0 pointer-events-none"></div>

      <div className="max-w-7xl w-full z-10 relative">
        <div className="text-center mb-20 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-800 bg-black/50 text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-8 rounded-full">
            <Activity className="w-3 h-3" /> System_Online
          </div>
          <h1 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase relative inline-block">
            System Portal
            <span className="absolute -top-4 -right-12 text-xs text-gray-600 font-normal tracking-widest border border-gray-800 px-2 py-1 bg-black rounded">v4.1</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto tracking-wide">
            Select a module to begin operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Logistics */}
          <button onClick={() => setActiveApp('railway')} className="group text-left relative transition-all duration-300 hover:-translate-y-2">
            <div className="h-full bg-[#0a0a0c] border border-gray-800 p-8 relative overflow-hidden group-hover:border-amber-500/50 transition-colors rounded-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Train className="w-32 h-32 text-amber-500" />
              </div>
              <div className="w-12 h-12 bg-amber-900/20 border border-amber-500/30 flex items-center justify-center mb-8 rounded-lg">
                <Train className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tighter">Train Manager</h2>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed uppercase tracking-widest">Manage Schedules & Tickets</p>
              <div className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                Open App <ArrowRight className="ml-2 w-3 h-3" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          </button>

          {/* Card 2: Banking */}
          <button onClick={() => setActiveApp('banking')} className="group text-left relative transition-all duration-300 hover:-translate-y-2">
             <div className="h-full bg-[#0a0a0c] border border-gray-800 p-8 relative overflow-hidden group-hover:border-cyan-500/50 transition-colors rounded-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Landmark className="w-32 h-32 text-cyan-500" />
              </div>
              <div className="w-12 h-12 bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mb-8 rounded-lg">
                <Landmark className="w-6 h-6 text-cyan-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tighter">Bank Manager</h2>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed uppercase tracking-widest">Accounts & Transactions</p>
              <div className="flex items-center text-cyan-500 text-[10px] font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                Open App <ArrowRight className="ml-2 w-3 h-3" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          </button>

          {/* Card 3: Runtime */}
          <button onClick={() => setActiveApp('cpp')} className="group text-left relative transition-all duration-300 hover:-translate-y-2">
             <div className="h-full bg-[#0a0a0c] border border-gray-800 p-8 relative overflow-hidden group-hover:border-rose-500/50 transition-colors rounded-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Cpu className="w-32 h-32 text-rose-500" />
              </div>
              <div className="w-12 h-12 bg-rose-900/20 border border-rose-500/30 flex items-center justify-center mb-8 rounded-lg">
                <Terminal className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tighter">Game Center</h2>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed uppercase tracking-widest">Play Classic C++ Games</p>
              <div className="flex items-center text-rose-500 text-[10px] font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                Open App <ArrowRight className="ml-2 w-3 h-3" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          </button>
        </div>
        
        <div className="mt-24 flex justify-between items-center border-t border-gray-900 pt-8 text-[10px] text-gray-700 font-mono uppercase tracking-widest">
            <p>ID: NODE_884_ALPHA</p>
            <p>STATUS: OPTIMAL</p>
        </div>
      </div>
    </div>
    </>
  );
}