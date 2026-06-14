import React, { useState, useEffect, useRef } from 'react'
import { 
  Shield, 
  Search, 
  Copy, 
  Terminal, 
  ArrowRight, 
  Wallet, 
  Check, 
  Loader2, 
  Globe, 
  Cpu, 
  Coins, 
  TrendingUp, 
  X, 
  Activity, 
  Code, 
  AlertTriangle, 
  Layers, 
  ExternalLink,
  DollarSign,
  SearchIcon,
  Play
} from 'lucide-react'

// Mock services dataset
const SERVICES = [
  {
    id: 'solana-risk-scanner',
    name: 'Solana Risk Scanner',
    description: 'High-speed audit of Solana token mints, metadata integrity, and LP lock contracts.',
    cost: '0.002 USDC per query',
    costNum: 0.002,
    endpoint: 'https://api.querygate.com/v1/agents/solana-risk',
    status: 'Live',
    category: 'Security',
    curlCommand: (token, address) => `curl -X POST "https://api.querygate.com/v1/agents/solana-risk" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"mintAddress": "${address || '6bU9Y7B1...s9f2'}"}'`,
    logs: (address) => [
      { t: 0, text: 'INIT: Connecting to x402 decentralized payment processor...' },
      { t: 300, text: 'AUTH: Checking client balance in connected wallet...' },
      { t: 600, text: 'AUTH: Wallet authorized. Sufficient USDC balance found.' },
      { t: 900, text: 'TX: Initiating x402 micro-transaction: 0.002 USDC...' },
      { t: 1200, text: 'TX: Micropayment confirmed! [TxID: x402_solrisk_88e4f21a]' },
      { t: 1400, text: 'PROTOCOL: Take-rate fee (2.5%): 0.00005 USDC routed to Querygate Fee Pool.' },
      { t: 1600, text: 'SERVICE: Resolving agent endpoint: Solana Risk Scanner v2.1' },
      { t: 1900, text: `ANALYSIS: Fetching target contract [${address || '6bU9Y7B1...s9f2'}]...` },
      { t: 2200, text: 'ANALYSIS: Checking authorities... Mint Authority: DISABLED | Freeze Authority: DISABLED' },
      { t: 2500, text: 'ANALYSIS: Scanning Raydium LP burn metadata... 100% of initial LP tokens burned.' },
      { t: 2800, text: 'RESPONSE: Query executed successfully in 2.8s.' },
      { t: 2900, text: 'DATA:', isJson: true, data: {
        status: "safe",
        score: 98,
        contract: address || "6bU9Y7B1t...s9f2",
        details: {
          mintAuthority: "Disabled",
          freezeAuthority: "Disabled",
          lpTokensBurned: "100.00%",
          top10HoldersRatio: "14.2%"
        },
        recommendation: "EXCELLENT_LQP"
      }}
    ]
  },
  {
    id: 'token-sentiment-llm',
    name: 'Token Sentiment LLM',
    description: 'AI model parsing real-time social channels, sentiment signals, and on-chain trends.',
    cost: '0.005 USDC per query',
    costNum: 0.005,
    endpoint: 'https://api.querygate.com/v1/agents/sentiment-llm',
    status: 'Live',
    category: 'AI Agents',
    curlCommand: (token, symbol) => `curl -X POST "https://api.querygate.com/v1/agents/sentiment-llm" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"symbol": "${symbol || 'SOL'}"}'`,
    logs: (symbol) => [
      { t: 0, text: 'INIT: Connecting to x402 decentralized payment processor...' },
      { t: 200, text: 'AUTH: Checking client balance in connected wallet...' },
      { t: 500, text: 'AUTH: Wallet authorized. Sufficient USDC balance found.' },
      { t: 800, text: 'TX: Initiating x402 micro-transaction: 0.005 USDC...' },
      { t: 1100, text: 'TX: Micropayment confirmed! [TxID: x402_sentllm_9a82f1b4]' },
      { t: 1300, text: 'PROTOCOL: Take-rate fee (2.5%): 0.000125 USDC routed to Querygate Fee Pool.' },
      { t: 1500, text: `SERVICE: Dispatching query to Sentiment LLM agent [Query: ${symbol || 'SOL'}]...` },
      { t: 1800, text: 'NLP_AGENT: Aggregating last 500 tweets, telegram signals, and news tickers...' },
      { t: 2100, text: 'NLP_AGENT: Performing semantic weights extraction & token classification...' },
      { t: 2400, text: 'RESPONSE: Analysis complete.' },
      { t: 2500, text: 'DATA:', isJson: true, data: {
        ticker: symbol || "SOL",
        sentimentScore: 0.84,
        vibe: "Bullish",
        metrics: {
          socialVolume24h: 18450,
          bullishRatio: "76.4%",
          topKeywords: ["breakout", "ecosystem", "layer-1", "jupiter"]
        },
        agentSummary: "Strong positive momentum detected in organic community circles, backed by on-chain smart wallet accumulations."
      }}
    ]
  },
  {
    id: 'on-chain-liquidity-check',
    name: 'On-Chain Liquidity Check',
    description: 'Mempool and AMM liquidity check. Real-time slippage prediction across EVM & Solana.',
    cost: '0.001 USDC per query',
    costNum: 0.001,
    endpoint: 'https://api.querygate.com/v1/agents/liquidity-check',
    status: 'Live',
    category: 'DeFi Data',
    curlCommand: (token, pair) => `curl -X POST "https://api.querygate.com/v1/agents/liquidity-check" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"pair": "${pair || 'SOL-USDC'}"}'`,
    logs: (pair) => [
      { t: 0, text: 'INIT: Connecting to x402 decentralized payment processor...' },
      { t: 200, text: 'AUTH: Checking client balance in connected wallet...' },
      { t: 400, text: 'AUTH: Wallet authorized. Sufficient USDC balance found.' },
      { t: 600, text: 'TX: Initiating x402 micro-transaction: 0.001 USDC...' },
      { t: 800, text: 'TX: Micropayment confirmed! [TxID: x402_liqcheck_cf918a22]' },
      { t: 1000, text: 'PROTOCOL: Take-rate fee (2.5%): 0.000025 USDC routed to Querygate Fee Pool.' },
      { t: 1200, text: `SERVICE: Initializing pool lookup for pair [${pair || 'SOL-USDC'}]...` },
      { t: 1400, text: 'INDEXER: Fetching live price feeds from Orca, Raydium, and Meteora pools...' },
      { t: 1600, text: 'CALCULATING: Simulation run: $50k buy impact...' },
      { t: 1800, text: 'RESPONSE: Calculation finished.' },
      { t: 1900, text: 'DATA:', isJson: true, data: {
        pair: pair || "SOL-USDC",
        aggregateLiquidityUSD: 84920000,
        slippageEstimate: {
          buy1000USD: "0.01%",
          buy10000USD: "0.08%",
          buy50000USD: "0.34%"
        },
        primeVenues: [
          { venue: "Raydium CLMM", share: "54%" },
          { venue: "Orca Whirlpools", share: "36%" }
        ]
      }}
    ]
  },
  {
    id: 'mev-sandwich-estimator',
    name: 'MEV Sandwich Estimator',
    description: 'Predict probability of MEV sandwich attacks on specific transactions in the mempool.',
    cost: '0.003 USDC per query',
    costNum: 0.003,
    endpoint: 'https://api.querygate.com/v1/agents/mev-sandwich',
    status: 'Live',
    category: 'DeFi Data',
    curlCommand: (token, tx) => `curl -X POST "https://api.querygate.com/v1/agents/mev-sandwich" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"estimatedGas": 150000, "slippageLimit": 1.0}'`,
    logs: (tx) => [
      { t: 0, text: 'INIT: Connecting to x402 decentralized payment processor...' },
      { t: 200, text: 'AUTH: Checking client balance in connected wallet...' },
      { t: 500, text: 'AUTH: Wallet authorized. Sufficient USDC balance found.' },
      { t: 800, text: 'TX: Initiating x402 micro-transaction: 0.003 USDC...' },
      { t: 1100, text: 'TX: Micropayment confirmed! [TxID: x402_mevsand_ee419ab2]' },
      { t: 1300, text: 'PROTOCOL: Take-rate fee (2.5%): 0.000075 USDC routed to Querygate Fee Pool.' },
      { t: 1500, text: 'SERVICE: Processing gas and slippage vectors against active block builders...' },
      { t: 1800, text: 'SIMULATION: Simulating block builder sorting algorithms (Jito & flashbots)...' },
      { t: 2100, text: 'RESPONSE: Completed sandwich attack risk check.' },
      { t: 2200, text: 'DATA:', isJson: true, data: {
        attackProbability: "Medium-High",
        riskScore: 72,
        estimatedLossUSD: 42.50,
        safestSlippageThreshold: "0.25%",
        recommendation: "Submit via private RPC / flashbots bundle."
      }}
    ]
  },
  {
    id: 'deepseek-v3-contract-auditor',
    name: 'DeepSeek-V3 Contract Auditor',
    description: 'Fine-tuned specialist model for reviewing smart contract code and discovering vulnerabilities.',
    cost: '0.010 USDC per query',
    costNum: 0.010,
    endpoint: 'https://api.querygate.com/v1/agents/deepseek-auditor',
    status: 'Live',
    category: 'AI Agents',
    curlCommand: (token, contract) => `curl -X POST "https://api.querygate.com/v1/agents/deepseek-auditor" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceCode": "contract MyToken { ... }"}'`,
    logs: (contract) => [
      { t: 0, text: 'INIT: Connecting to x402 decentralized payment processor...' },
      { t: 200, text: 'AUTH: Checking client balance in connected wallet...' },
      { t: 500, text: 'AUTH: Wallet authorized. Sufficient USDC balance found.' },
      { t: 800, text: 'TX: Initiating x402 micro-transaction: 0.010 USDC...' },
      { t: 1100, text: 'TX: Micropayment confirmed! [TxID: x402_deepseek_aa88e1c3]' },
      { t: 1300, text: 'PROTOCOL: Take-rate fee (2.5%): 0.00025 USDC routed to Querygate Fee Pool.' },
      { t: 1500, text: 'SERVICE: Feeding source code buffer into DeepSeek-V3 fine-tuned parameters...' },
      { t: 1900, text: 'LLM: Analyzing AST (Abstract Syntax Tree), checking reentrancy and integer overflow vectors...' },
      { t: 2300, text: 'LLM: Checking access control ownership modifiers...' },
      { t: 2600, text: 'RESPONSE: Code evaluation successfully completed.' },
      { t: 2700, text: 'DATA:', isJson: true, data: {
        contractValid: true,
        criticalVulnerabilities: 0,
        highVulnerabilities: 1,
        mediumVulnerabilities: 3,
        details: [
          { type: "Unchecked External Call", location: "line 42", mitigation: "Use transfer() or openzeppelin Address library" }
        ],
        gasOptimizationTips: "Consolidate state variable storage inside writePoolState (save ~22,000 gas)."
      }}
    ]
  },
  {
    id: 'nft-metadata-guard',
    name: 'NFT Metadata Guard',
    description: 'Continuous verifier for NFT metadata consistency, IPFS durability, and image file size checks.',
    cost: '0.001 USDC per query',
    costNum: 0.001,
    endpoint: 'https://api.querygate.com/v1/agents/nft-metadata-guard',
    status: 'Live',
    category: 'Security',
    curlCommand: (token, tokenId) => `curl -X POST "https://api.querygate.com/v1/agents/nft-metadata-guard" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"nftAddress": "0xbc4ca...5467", "tokenId": 1}'`,
    logs: (tokenId) => [
      { t: 0, text: 'INIT: Connecting to x402 decentralized payment processor...' },
      { t: 100, text: 'AUTH: Checking client balance in connected wallet...' },
      { t: 300, text: 'AUTH: Wallet authorized. Sufficient USDC balance found.' },
      { t: 500, text: 'TX: Initiating x402 micro-transaction: 0.001 USDC...' },
      { t: 700, text: 'TX: Micropayment confirmed! [TxID: x402_nftguard_31a988d1]' },
      { t: 900, text: 'PROTOCOL: Take-rate fee (2.5%): 0.000025 USDC routed to Querygate Fee Pool.' },
      { t: 1100, text: 'SERVICE: Fetching NFT token metadata URI from on-chain state...' },
      { t: 1400, text: 'NETWORK: Resolving IPFS gateway latency & pinning check...' },
      { t: 1700, text: 'RESPONSE: Metadata validation complete.' },
      { t: 1800, text: 'DATA:', isJson: true, data: {
        metadataURI: "ipfs://QmeSjSinHp...607",
        metadataValid: true,
        ipfsPinningProviders: ["Pinata", "Infura"],
        attributesCount: 7,
        imageIntegrity: "Passed"
      }}
    ]
  }
]

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState(5.0000) // Simulated USD balance
  const [copiedTextId, setCopiedTextId] = useState(null)
  
  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState([
    { text: 'SYSTEM: Welcome to Querygate CLI. Select any agentic micro-service and click "Run" to process an live micro-payment query.', type: 'sys' }
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [runningServiceId, setRunningServiceId] = useState(null)
  const terminalEndRef = useRef(null)

  // Custom User Payment Token simulator
  const [userPaymentToken, setUserPaymentToken] = useState('x402_sk_live_7a3d90f2b841')

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [terminalLogs])

  const connectWallet = (walletType) => {
    setWalletModalOpen(false)
    setWalletConnected(true)
    const randomAddress = walletType === 'phantom' 
      ? 'F8a9S5Yt8x...ZqP4' 
      : walletType === 'metamask' 
      ? '0x7A3d...E85f' 
      : '0x9E2b...2B8c'
    setWalletAddress(randomAddress)
    
    // Add logs to console
    setTerminalLogs(prev => [
      ...prev,
      { text: `WALLET: Connected to ${walletType === 'phantom' ? 'Phantom Wallet' : walletType === 'metamask' ? 'MetaMask' : 'WalletConnect'} (${randomAddress})`, type: 'info' },
      { text: `WALLET: Synced with x402 payment protocol. Active balance: $5.0000 USDC`, type: 'info' }
    ])
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress('')
    setTerminalLogs(prev => [
      ...prev,
      { text: 'WALLET: Client wallet disconnected.', type: 'warning' }
    ])
  }

  const handleCopyEndpoint = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedTextId(id)
    setTimeout(() => {
      setCopiedTextId(null)
    }, 2000)
  }

  // Trigger terminal execution simulation
  const runServiceQuery = (service) => {
    if (isRunning) return
    setIsRunning(true)
    setRunningServiceId(service.id)
    setSelectedService(service) // sync with curl code block too
    
    // Clear terminal and prepare
    setTerminalLogs([
      { text: `CLIENT: Triggering query to "${service.name}"...`, type: 'cmd' },
    ])

    const logList = service.logs(searchQuery && searchQuery.startsWith('0x') ? searchQuery : '')
    
    // Run simulated logs sequence
    logList.forEach((log) => {
      setTimeout(() => {
        setTerminalLogs(prev => [
          ...prev,
          { 
            text: log.text, 
            type: log.text.startsWith('TX:') ? 'tx' : log.text.startsWith('RESPONSE:') ? 'success' : 'log',
            isJson: log.isJson,
            data: log.data
          }
        ])

        // If it's the last log, stop running and subtract micropayment balance
        if (log === logList[logList.length - 1]) {
          setIsRunning(false)
          setRunningServiceId(null)
          // Subtract cost from wallet balance
          setWalletBalance(prev => Math.max(0, prev - service.costNum))
        }
      }, log.t)
    })
  }

  // Filter services by search query and category
  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (searchQuery.startsWith('0x') && searchQuery.length > 5) // matching custom address mode
    
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Extract unique categories for filter tabs
  const categories = ['All', 'Security', 'DeFi Data', 'AI Agents']

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6] selection:bg-cyan-500 selection:text-black">
      
      {/* Glow Effects at Header background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-cyan-950/20 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0B0B]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <span className="text-black font-extrabold text-lg tracking-tighter">Q</span>
            </div>
            <div>
              <span className="text-white font-bold tracking-wider text-xl tech-font">QUERYGATE</span>
              <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest block -mt-1">
                x402 protocol marketplace
              </span>
            </div>
          </div>

          {/* Center stats */}
          <div className="hidden md:flex items-center gap-6 text-xs text-gray-400 border-l border-white/10 pl-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
              <span className="text-gray-300">Protocol: <strong className="text-white">Active</strong></span>
            </div>
            <div>
              Global MQV: <strong className="text-white tech-font">4.2M+ queries</strong>
            </div>
            <div>
              TPV: <strong className="text-cyan-400 tech-font">$8,419.04 USDC</strong>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            
            {walletConnected && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400">USDC Balance:</span>
                <span className="text-cyan-400 font-semibold tech-font">${walletBalance.toFixed(4)}</span>
              </div>
            )}

            {walletConnected ? (
              <div className="relative group">
                <button 
                  onClick={disconnectWallet}
                  className="flex items-center gap-2 bg-[#121212] hover:bg-red-950/20 text-[#f3f4f6] hover:text-red-400 border border-white/10 hover:border-red-900/50 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse group-hover:bg-red-500" />
                  <span className="tech-font">{walletAddress}</span>
                  <span className="text-[10px] text-gray-500 group-hover:text-red-400 pl-1 border-l border-white/10 ml-1">Disconnect</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setWalletModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black px-4.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
              >
                <Wallet size={14} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Banner Announcement */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-400 font-medium">
            <span className="text-[10px] bg-cyan-400 text-black px-1.5 py-0.5 rounded font-extrabold uppercase">NEW</span>
            <span>x402 Spec Revision 1.4 live on Solana & Arbitrum</span>
          </div>
        </div>

        {/* Value Prop */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            High-Velocity AI Services. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 shadow-sm">
              Micro-payments by default.
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Buy and sell highly granular, autonomous API agent queries instantly using the ultra-low friction <strong className="text-gray-200">x402 protocol</strong>. No subscription overheads. Pay-per-query processed automatically.
          </p>

          {/* Interactive Focused Search Input */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-15 group-focus-within:opacity-35 transition duration-300" />
            <div className="relative flex items-center bg-[#111] rounded-xl border border-white/10 group-focus-within:border-cyan-400/50 transition-all duration-300 overflow-hidden">
              <div className="pl-4 text-gray-500">
                <Search size={18} className="group-focus-within:text-cyan-400 transition-colors duration-200" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search micro-services or paste contract address..."
                className="w-full bg-transparent border-none outline-none py-4 px-3 text-sm text-white placeholder-gray-500 font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-gray-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Quick Suggestions / Address Mode Hint */}
            <div className="mt-3 flex justify-between items-center text-[11px] text-gray-500 px-1">
              <div className="flex gap-2">
                <span>Try:</span>
                <button onClick={() => setSearchQuery('Solana Risk Scanner')} className="text-gray-400 hover:text-cyan-400 transition-colors">Risk Scanner</button>
                <span className="text-gray-700">•</span>
                <button onClick={() => setSearchQuery('Sentiment')} className="text-gray-400 hover:text-cyan-400 transition-colors">Sentiment</button>
                <span className="text-gray-700">•</span>
                <button onClick={() => setSearchQuery('0x7A3d0E85f2b841e9512c0022fa981e42')} className="text-cyan-400/80 hover:text-cyan-400 transition-colors">EVM Address Mode</button>
              </div>
              <div>
                Press run to simulate Query payment
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                  selectedCategory === category 
                    ? 'bg-white/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 hidden sm:block">
            Showing <strong className="text-gray-300">{filteredServices.length}</strong> live micro-services
          </div>
        </div>

        {/* CORE WORK: SERVICE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => {
              const isCurrentRunning = isRunning && runningServiceId === service.id
              return (
                <div 
                  key={service.id} 
                  onClick={() => setSelectedService(service)}
                  className={`glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                    selectedService.id === service.id ? 'border-cyan-400/30 bg-white/[0.03]' : ''
                  }`}
                >
                  {/* Subtle active glow for currently selected card */}
                  {selectedService.id === service.id && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div>
                    {/* Header: Status and category */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider tech-font">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">{service.status}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-200 mb-2">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-6 h-12 overflow-hidden">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    {/* Cost section */}
                    <div className="flex items-baseline justify-between border-t border-white/5 pt-4 mb-4">
                      <span className="text-gray-500 text-xs">Cost per Query:</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white tech-font">{service.cost}</span>
                      </div>
                    </div>

                    {/* Quick copy, Run actions */}
                    <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                      
                      {/* Copy endpoint */}
                      <button
                        onClick={() => handleCopyEndpoint(service.endpoint, service.id)}
                        className="flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#181818] text-gray-300 hover:text-white border border-white/10 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200"
                        title="Copy endpoint URL to clipboard"
                      >
                        {copiedTextId === service.id ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Endpoint</span>
                          </>
                        )}
                      </button>

                      {/* Run simulator button */}
                      <button
                        disabled={isRunning}
                        onClick={() => runServiceQuery(service)}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          isCurrentRunning 
                            ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                            : isRunning
                            ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-cyan-400 hover:text-black border border-white/10 hover:border-cyan-400 text-white shadow-sm'
                        }`}
                      >
                        {isCurrentRunning ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Running</span>
                          </>
                        ) : (
                          <>
                            <Play size={11} className="fill-current" />
                            <span>Run Query</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-12 text-center bg-[#111] rounded-2xl border border-white/5">
              <AlertTriangle className="mx-auto text-yellow-500/80 mb-3" size={32} />
              <h4 className="text-white font-semibold text-sm mb-1">No micro-services found</h4>
              <p className="text-gray-500 text-xs max-w-sm mx-auto">
                No services matched "{searchQuery}". Try modifying your search or check EVM Contract Address formatting.
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM TWO-COLUMN: DEVELOPER CONSOLE & INTERACTIVE TERMINAL OUTPUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* COLUMN 1: INTERACTIVE RUN TERMINAL/MOCK LOG PANEL */}
          <div className="glass-panel rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl h-[450px]">
            
            {/* Terminal Header */}
            <div className="bg-[#111] px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="text-xs text-gray-400 font-medium ml-2 tech-font">querygate-terminal-simulation</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                <Terminal size={11} />
                Live Engine Feed
              </div>
            </div>

            {/* Terminal Logs Area */}
            <div className="flex-1 bg-[#060606] p-5 font-mono text-[11px] md:text-xs overflow-y-auto leading-relaxed flex flex-col gap-2 scrollbar-thin">
              {terminalLogs.map((log, index) => {
                let textClass = 'text-gray-400'
                if (log.type === 'cmd') textClass = 'text-cyan-400 font-semibold'
                else if (log.type === 'sys') textClass = 'text-gray-500'
                else if (log.type === 'info') textClass = 'text-blue-400'
                else if (log.type === 'tx') textClass = 'text-emerald-400 font-medium'
                else if (log.type === 'warning') textClass = 'text-amber-500'
                else if (log.type === 'success') textClass = 'text-emerald-300 font-bold'

                return (
                  <div key={index} className="break-all">
                    {log.isJson ? (
                      <div className="mt-1 bg-white/[0.02] border border-white/5 rounded-lg p-3 text-gray-300 max-w-full overflow-x-auto tech-font">
                        <pre className="text-[11px] leading-relaxed">{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    ) : (
                      <span className={textClass}>{log.text}</span>
                    )}
                  </div>
                )
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Footer */}
            <div className="bg-[#111] p-3 border-t border-white/5 text-[10px] text-gray-500 flex justify-between items-center">
              <span>Host IP: 184.21.90.4 • Powered by x402 Micropayments</span>
              <div className="flex items-center gap-1 text-cyan-500">
                <span>Fee Take-Rate: 2.5%</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: DEVELOPER CONSOLE & cURL TOOL */}
          <div className="glass-panel rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl h-[450px]">
            
            {/* Console Header with tabs */}
            <div className="bg-[#111] px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-cyan-400" />
                <span className="text-xs text-white font-semibold uppercase tracking-wider tech-font">Developer Integration Console</span>
              </div>
              <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-medium">
                Active Service: {selectedService.name}
              </span>
            </div>

            {/* Console Body */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-[#080808]">
              
              <div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Querygate utilizes direct decentralized token handshakes. To construct queries, inject your custom <code className="text-cyan-400 text-[11px] bg-cyan-950/30 px-1 py-0.5 rounded border border-cyan-800/20">X-x402-Payment-Token</code> in headers. All fees are compiled sub-second.
                </p>

                {/* Token configurator slider or input */}
                <div className="mb-4 bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="text-left w-full md:w-auto">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide">Configure Micro-payment Key:</span>
                    <span className="text-[11px] text-cyan-400/80 font-mono block break-all">{userPaymentToken}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const hex = '0123456789abcdef'
                      let rand = ''
                      for (let i = 0; i < 16; i++) rand += hex[Math.floor(Math.random() * 16)]
                      setUserPaymentToken(`x402_sk_live_${rand}`)
                    }}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-2.5 py-1 rounded font-medium transition-colors cursor-pointer shrink-0"
                  >
                    Cycle Keys
                  </button>
                </div>

                {/* cURL Display Pane */}
                <div className="relative">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleCopyEndpoint(selectedService.curlCommand(userPaymentToken, searchQuery), 'curl-copy')}
                      className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all duration-200"
                      title="Copy cURL command"
                    >
                      {copiedTextId === 'curl-copy' ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                  <div className="bg-black/80 rounded-xl border border-white/10 p-4 font-mono text-[11px] md:text-xs text-[#E5E7EB] overflow-x-auto h-[180px] leading-relaxed max-w-full">
                    <pre className="text-left text-cyan-300/90 select-all font-mono whitespace-pre-wrap">
                      {selectedService.curlCommand(userPaymentToken, searchQuery)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Console Footer */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3">
                <span className="flex items-center gap-1">
                  <Globe size={11} /> SDKs available: Javascript, Rust, Python
                </span>
                <span className="text-cyan-400 font-semibold cursor-pointer hover:underline flex items-center gap-0.5">
                  Read Protocol Docs <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* REVENUE MODEL & ARCHITECTURE TRANSPARENCY SECTION */}
        <section className="mt-24 border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Revenue / Fee model Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-cyan-400 mb-4">
                  <Coins size={20} />
                </div>
                <h4 className="text-white font-bold text-base mb-2">Protocol Take-Rate</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Querygate levies an ultra-low, standard <strong className="text-cyan-400">2.5% protocol fee</strong> on all successful micropayments processed via the x402 specification. Route fees in real-time instantly without locks.
                </p>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">Transparent Economics</span>
              </div>
            </div>

            {/* Enterprise Hosting & Relay Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-cyan-400 mb-4">
                  <Layers size={20} />
                </div>
                <h4 className="text-white font-bold text-base mb-2">Enterprise Hosting & Relay</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Unlock specialized dedicated relays, customized service level agreements (SLAs), and optimized rate limit configurations. Built specifically for high-velocity decentralized workloads.
                </p>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">Enterprise Ready</span>
              </div>
            </div>

            {/* Premium Verification Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-cyan-400 mb-4">
                  <Shield size={20} />
                </div>
                <h4 className="text-white font-bold text-base mb-2">Premium Verification</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Let creators secure the verified safe badge. All listed agents are subject to rigorous safety consensus parameters to avoid malicious payload relays.
                </p>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">Audited Security</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080808] px-6 py-12 text-center text-xs text-gray-500 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">QUERYGATE</span>
            <span className="text-gray-700">|</span>
            <span>© 2026 Querygate Protocol Foundation. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">x402 Spec</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Github</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Protocol Audits</a>
          </div>
        </div>
      </footer>

      {/* CONNECT WALLET SIMULATED MODAL */}
      {walletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Background absolute ambient glow inside modal */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wallet className="text-cyan-400" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider tech-font">Select Crypto Wallet</h3>
              </div>
              <button 
                onClick={() => setWalletModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Connect your developer wallet to establish a secure link with the Querygate protocol and simulate real-time query payments.
            </p>

            {/* Wallet Selection List */}
            <div className="flex flex-col gap-3 mb-6">
              
              {/* Phantom */}
              <button 
                onClick={() => connectWallet('phantom')}
                className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 p-3.5 rounded-xl text-left transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#512da8]/30 border border-[#512da8]/40 flex items-center justify-center font-bold text-white text-xs tech-font">
                    P
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">Phantom Wallet</span>
                    <span className="text-[10px] text-gray-500 block">Recommended for Solana integration</span>
                  </div>
                </div>
                <ChevronRightIcon className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" size={16} />
              </button>

              {/* MetaMask */}
              <button 
                onClick={() => connectWallet('metamask')}
                className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 p-3.5 rounded-xl text-left transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e65100]/30 border border-[#e65100]/40 flex items-center justify-center font-bold text-[#f57c00] text-xs tech-font">
                    M
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">MetaMask</span>
                    <span className="text-[10px] text-gray-500 block">EVM Compatibility & Arbitrum Spec</span>
                  </div>
                </div>
                <ChevronRightIcon className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" size={16} />
              </button>

              {/* WalletConnect */}
              <button 
                onClick={() => connectWallet('walletconnect')}
                className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 p-3.5 rounded-xl text-left transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0288d1]/30 border border-[#0288d1]/40 flex items-center justify-center font-bold text-[#03a9f4] text-xs tech-font">
                    W
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">WalletConnect</span>
                    <span className="text-[10px] text-gray-500 block">Universal multi-chain protocol support</span>
                  </div>
                </div>
                <ChevronRightIcon className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" size={16} />
              </button>

            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-500 text-center leading-relaxed">
              By connecting a wallet, you agree to the Querygate 2.5% takerate allocation policy. Micropayments in this dashboard are fully simulated sandbox queries.
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

// Small helper component for Chevron
function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
