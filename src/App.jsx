import React, { useState, useEffect, useRef } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Search, 
  Copy, 
  Terminal, 
  ArrowRight, 
  Check, 
  Loader2, 
  Globe, 
  Cpu, 
  Coins, 
  X, 
  Activity, 
  Code, 
  AlertTriangle, 
  Layers, 
  ExternalLink,
  Play,
  FileJson,
  Download,
  CheckCircle2,
  Lock,
  SearchCode
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
    riskScore: 12, // Low Risk
    riskLevel: 'Safe',
    riskColor: 'text-emerald-400',
    insights: `### Solana Risk Scanner Report

#### Executive Summary
The target mint address has been fully audited against active Solana security vector patterns. No critical vulnerabilities or hidden freeze authorities were discovered.

#### Core Findings
* **Freeze Authority**: **Disabled** (The creator cannot freeze user accounts).
* **Mint Authority**: **Disabled** (Supply is hard-capped and cannot be inflated).
* **Liquidity Pool Burn**: **100% Burned** (Initial LP tokens have been routed to the incinerator address).
* **Top 10 Holders**: **14.2% ownership** (Extremely decentralized allocation).

#### Recommendation
**EXCELLENT_LQP**: No suspicious owner actions or honeypot threats detected. Proceed with confidence.`,
    curlCommand: (token, address) => `curl -X POST "https://api.querygate.com/v1/agents/solana-risk" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"mintAddress": "${address || '6bU9Y7B1...s9f2'}"}'`,
    logs: [
      "Validating x402 payment header... Handshake confirmed [TxID: x402_solrisk_88e4f21a].",
      "Initializing Agentic Service... Solana Risk Scanner Agent v2.1 activated.",
      "Fetching blockchain state... Fetching Raydium CLMM pool and Metaplex metadata.",
      "Executing LLM deep analysis... Verifying owner authority signatures, freeze authority, and top 10 distribution."
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
    riskScore: 35, // Low-Medium Risk
    riskLevel: 'Moderate',
    riskColor: 'text-yellow-400',
    insights: `### AI Token Sentiment Analysis

#### Executive Summary
Social volumes and on-chain trading actions indicate heavily bullish organic positioning with minimal coordinated sybil actions.

#### Core Findings
* **Social Velocity**: **+184%** (Extremely high growth on X and Telegram).
* **Smart Money Wallets**: **+14 Wallets net positive** (On-chain tracking indicates active accumulation).
* **Coordinated Hype Index**: **12%** (Very low, suggesting organic viral momentum rather than temporary bot farming).
* **Key Keywords**: *Breakout, Layer-1, Liquidity, Expansion*.

#### Recommendation
**BULLISH**: Strong community-driven backing and organic trader demand detected. Momentum likely to persist in the near-term.`,
    curlCommand: (token, symbol) => `curl -X POST "https://api.querygate.com/v1/agents/sentiment-llm" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"symbol": "${symbol || 'SOL'}"}'`,
    logs: [
      "Validating x402 payment header... Handshake confirmed [TxID: x402_sentllm_9a82f1b4].",
      "Initializing Agentic Service... Sentiment LLM Core active.",
      "Fetching blockchain state... Aggregating last 500 Twitter API signals and Telegram channel feeds.",
      "Executing LLM deep analysis... Extracting semantic weights and intent classification."
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
    riskScore: 8, // Safe
    riskLevel: 'Very Safe',
    riskColor: 'text-emerald-400',
    insights: `### On-Chain Liquidity & Slippage Forecast

#### Executive Summary
Aggregated liquidity pools across top decentralized exchanges (Raydium, Orca, Meteora) show extremely deep orderbooks capable of absorbing mid-to-large size trades.

#### Core Findings
* **Aggregate Liquidity**: **$84.92M USD** locked inside core pools.
* **$10k Buy Impact**: **0.08% slippage** (Extremely shallow impact).
* **$50k Buy Impact**: **0.34% slippage** (Highly optimized routing is advised).
* **Top Routing Venues**: Raydium CLMM (54%), Orca Whirlpools (36%).

#### Recommendation
**VERY_SAFE**: Extremely deep liquidity depth. Simple routing handles trades up to $25k with negligible price slippage.`,
    curlCommand: (token, pair) => `curl -X POST "https://api.querygate.com/v1/agents/liquidity-check" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"pair": "${pair || 'SOL-USDC'}"}'`,
    logs: [
      "Validating x402 payment header... Handshake confirmed [TxID: x402_liqcheck_cf918a22].",
      "Initializing Agentic Service... On-Chain Indexer agent online.",
      "Fetching blockchain state... Fetching pool reserves across Raydium, Orca, and Meteora.",
      "Executing LLM deep analysis... Running orderbook aggregation and price impact calculations."
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
    riskScore: 78, // High Risk
    riskLevel: 'High Risk',
    riskColor: 'text-red-500',
    insights: `### MEV Sandwich Attack Estimator

#### Executive Summary
Warning: High MEV sandwich attack probability detected on public mempool routing with standard slippage parameters.

#### Core Findings
* **Slippage Threshold**: **1.0%** (Extremely high, open to sandwich exploitation).
* **Pending Mempool Blocks**: **3 Active searcher bundles** matching the gas signature.
* **Estimated Attack Loss**: **$42.50 USD** (Based on $2,000 swap sizing).
* **Jito Block Builder Sorter**: Active (Searchers can package frontrun and backrun bundles).

#### Recommendation
**HIGH_RISK**: Do not broadcast transaction to public RPC nodes. Reduce slippage threshold to **0.25%** or route via a private RPC endpoint (e.g., flashbots/Jito).`,
    curlCommand: (token, tx) => `curl -X POST "https://api.querygate.com/v1/agents/mev-sandwich" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"estimatedGas": 150000, "slippageLimit": 1.0}'`,
    logs: [
      "Validating x402 payment header... Handshake confirmed [TxID: x402_mevsand_ee419ab2].",
      "Initializing Agentic Service... Mempool Monitor active.",
      "Fetching blockchain state... Analyzing pending tx state and block builder bundles.",
      "Executing LLM deep analysis... Running sandwich attack simulation against block builder sort algorithms."
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
    riskScore: 48, // Moderate Risk
    riskLevel: 'Moderate',
    riskColor: 'text-yellow-400',
    insights: `### DeepSeek-V3 Smart Contract Audit

#### Executive Summary
Vulnerability scan finished. No critical reentrancy or ownership capture vulnerabilities were identified, but 1 High and 3 Medium issues require immediate developer attention.

#### Core Findings
* **Reentrancy Vectors**: **None** (Modifiers are properly ordered and lock checks are present).
* **Unchecked External Call**: **1 High Vulnerability** (Line 42 contains raw address call without check).
* **Gas Optimizations**: **Medium Severity** (Consolidate state variables to save ~22,000 gas units per write).
* **Access Control**: **Safe** (OnlyOwner limits are properly enforced).

#### Recommendation
**MODERATE**: Do not deploy contract directly to Mainnet. Modify Line 42 to use OpenZeppelin SafeERC20 / address check before mainnet launch.`,
    curlCommand: (token, contract) => `curl -X POST "https://api.querygate.com/v1/agents/deepseek-auditor" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceCode": "contract MyToken { ... }"}'`,
    logs: [
      "Validating x402 payment header... Handshake confirmed [TxID: x402_deepseek_aa88e1c3].",
      "Initializing Agentic Service... DeepSeek Auditor Model active.",
      "Fetching blockchain state... Fetching contract AST and dependency files.",
      "Executing LLM deep analysis... Reviewing call vectors, reentrancy vulnerabilities, and gas storage arrays."
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
    riskScore: 5, // Safe
    riskLevel: 'Very Safe',
    riskColor: 'text-emerald-400',
    insights: `### NFT Metadata Integrity Audit

#### Executive Summary
Verification of metadata fields, image hashes, and decentralized IPFS pinning permanence has successfully passed all consensus checks.

#### Core Findings
* **IPFS Pinned Providers**: **Pinata, Infura** (Well redundant).
* **Metadata Hash Match**: **100% Match** (Local hash matches decentralized storage registry).
* **Attributes Consistency**: **Passed** (No mismatched traits or dangling assets).
* **Image Availability**: **Passed** (Sub-100ms fetch delay).

#### Recommendation
**VERY_SAFE**: Extremely durable NFT deployment. Metadata is fully standardized and safely secured.`,
    curlCommand: (token, tokenId) => `curl -X POST "https://api.querygate.com/v1/agents/nft-metadata-guard" \\
  -H "Authorization: x402 ${token || 'YOUR_PAYMENT_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"nftAddress": "0xbc4ca...5467", "tokenId": 1}'`,
    logs: [
      "Validating x402 payment header... Handshake confirmed [TxID: x402_nftguard_31a988d1].",
      "Initializing Agentic Service... NFT Metadata Inspector active.",
      "Fetching blockchain state... Fetching token URI from smart contract on-chain state.",
      "Executing LLM deep analysis... Resolving decentralized IPFS gateway latency and metadata hashing."
    ]
  }
]

export default function App() {
  const { isConnected, address } = useAccount()
  const { data: balanceData } = useBalance({ address })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [copiedTextId, setCopiedTextId] = useState(null)
  const [userPaymentToken, setUserPaymentToken] = useState('x402_sk_live_7a3d90f2b841')

  // Real-time stream & results console log states
  const [terminalLogs, setTerminalLogs] = useState([])
  const [logIndex, setLogIndex] = useState(-1)
  const [showProcessView, setShowProcessView] = useState(false)
  const [showResultsDashboard, setShowResultsDashboard] = useState(false)

  // Auto-scroll terminal
  const terminalEndRef = useRef(null)
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [terminalLogs])

  // TanStack Query Mutation handling the query request flow
  const runMutation = useMutation({
    mutationFn: async (service) => {
      // Simulate real-time API latency
      await new Promise((resolve) => setTimeout(resolve, 3200))
      return service
    },
    onMutate: (service) => {
      // Setup and open the "Process View" overlay immediately on click
      setShowProcessView(true)
      setShowResultsDashboard(false)
      setTerminalLogs([])
      setLogIndex(0)
    },
    onSuccess: (service) => {
      // Delay transition slightly for terminal slide animation to look organic
      setTimeout(() => {
        setShowResultsDashboard(true)
      }, 500)
    }
  })

  // Stream console logs step by step during mutation
  useEffect(() => {
    if (!showProcessView || runMutation.isPending === false) return

    const service = runMutation.variables
    if (!service) return

    if (logIndex >= 0 && logIndex < service.logs.length) {
      const timer = setTimeout(() => {
        setTerminalLogs(prev => [...prev, service.logs[logIndex]])
        setLogIndex(prev => prev + 1)
      }, 700) // stream a log every 700ms
      return () => clearTimeout(timer)
    }
  }, [logIndex, showProcessView, runMutation.isPending])

  const handleCopyEndpoint = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedTextId(id)
    setTimeout(() => {
      setCopiedTextId(null)
    }, 2000)
  }

  // Filter services by search query and category
  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (searchQuery.startsWith('0x') && searchQuery.length > 5)
    
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'Security', 'DeFi Data', 'AI Agents']

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6] selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      
      {/* Glow Effects */}
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

          {/* Stats Bar */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-gray-400 border-l border-white/10 pl-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
              <span className="text-gray-300">Protocol Status: <strong className="text-white">Active</strong></span>
            </div>
            <div>
              Global MQV: <strong className="text-white tech-font">4.2M+ queries</strong>
            </div>
            <div>
              TPV: <strong className="text-cyan-400 tech-font">$8,419.04 USDC</strong>
            </div>
          </div>

          {/* Wallet integration using the official RainbowKit ConnectButton component */}
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-400 font-medium">
            <span className="text-[10px] bg-cyan-400 text-black px-1.5 py-0.5 rounded font-extrabold uppercase">NEW</span>
            <span>x402 Spec Revision 1.4 live on Ethereum & Arbitrum</span>
          </div>
        </div>

        {/* Hero */}
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

          {/* Centric Search Bar with Focus Effects */}
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
                placeholder="Search micro-services or enter contract address..."
                className="w-full bg-transparent border-none outline-none py-4 px-3 text-sm text-white placeholder-gray-500 font-sans"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-500 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Quick Hints */}
            <div className="mt-3 flex justify-between items-center text-[11px] text-gray-500 px-1">
              <div className="flex gap-2">
                <span>Suggestions:</span>
                <button onClick={() => setSearchQuery('Solana Risk Scanner')} className="text-gray-400 hover:text-cyan-400 transition-colors">Risk Scanner</button>
                <span className="text-gray-700">•</span>
                <button onClick={() => setSearchQuery('Sentiment')} className="text-gray-400 hover:text-cyan-400 transition-colors">Sentiment</button>
                <span className="text-gray-700">•</span>
                <button onClick={() => setSearchQuery('0x7A3d0E85f2b841e9512c0022fa981e42')} className="text-cyan-400/80 hover:text-cyan-400 transition-colors">EVM Address Mode</button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS & CONTROLS */}
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

        {/* SERVICE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => {
              const isSelected = selectedService.id === service.id
              const isCurrentRunning = runMutation.isPending && runMutation.variables?.id === service.id

              return (
                <div 
                  key={service.id} 
                  onClick={() => setSelectedService(service)}
                  className={`glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                    isSelected ? 'border-cyan-400/30 bg-white/[0.03]' : ''
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div>
                    {/* Header */}
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
                    {/* Cost */}
                    <div className="flex items-baseline justify-between border-t border-white/5 pt-4 mb-4">
                      <span className="text-gray-500 text-xs">Cost per Query:</span>
                      <span className="text-sm font-bold text-white tech-font">{service.cost}</span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleCopyEndpoint(service.endpoint, service.id)}
                        className="flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#181818] text-gray-300 hover:text-white border border-white/10 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200"
                      >
                        {copiedTextId === service.id ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy Endpoint</span>
                          </>
                        )}
                      </button>

                      <button
                        disabled={runMutation.isPending}
                        onClick={() => runMutation.mutate(service)}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          isCurrentRunning 
                            ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                            : runMutation.isPending
                            ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-cyan-400 hover:text-black border border-white/10 hover:border-cyan-400 text-white'
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
                            <span>Run Service</span>
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
              <p className="text-gray-500 text-xs max-w-sm mx-auto">No services matched your query.</p>
            </div>
          )}
        </div>

        {/* DEVELOPER CODE BLOCK & STATIC TRANS-ECONOMICS COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-20">
          
          {/* COLUMN 1: Developer Console & cURL Generator */}
          <div className="glass-panel rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl h-[420px]">
            <div className="bg-[#111] px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-cyan-400" />
                <span className="text-xs text-white font-semibold uppercase tracking-wider tech-font">Developer Integration Console</span>
              </div>
              <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-medium">
                Service: {selectedService.name}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between bg-[#080808]">
              <div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Querygate utilizes direct decentralized token handshakes. To construct queries, inject your custom <code className="text-cyan-400 text-[11px] bg-cyan-950/30 px-1 py-0.5 rounded border border-cyan-800/20">X-x402-Payment-Token</code> in headers.
                </p>

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

                <div className="relative">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleCopyEndpoint(selectedService.curlCommand(userPaymentToken, searchQuery), 'curl-copy')}
                      className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all duration-200"
                    >
                      {copiedTextId === 'curl-copy' ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                  <div className="bg-black/80 rounded-xl border border-white/10 p-4 font-mono text-[11px] md:text-xs text-[#E5E7EB] overflow-x-auto h-[160px] leading-relaxed max-w-full">
                    <pre className="text-left text-cyan-300/90 select-all font-mono whitespace-pre-wrap">
                      {selectedService.curlCommand(userPaymentToken, searchQuery)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3">
                <span className="flex items-center gap-1">
                  <Globe size={11} /> SDKs: Javascript, Rust, Python
                </span>
                <span className="text-cyan-400 font-semibold cursor-pointer hover:underline flex items-center gap-0.5">
                  Read Protocol Specs <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Protocol Take-Rate & Token Architecture Specs */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center">
                  <Coins size={16} />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider tech-font text-white">Direct Micropayment Specifications</span>
              </div>
              <h4 className="text-white font-bold text-base mb-2">Protocol Fee Structure</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Querygate processed queries leverage direct decentralized token handshakes under the x402 payment scheme. High-velocity workloads route standard <strong className="text-cyan-400">2.5% protocol take-rate</strong> cuts straight to decentralized treasury pools, preventing subscription leakage or heavy vendor lock-ins.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Decentralized Protocol Take-rate</span>
                  <span className="text-lg font-bold text-white tech-font">2.50%</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Average Query Settlement Delay</span>
                  <span className="text-lg font-bold text-cyan-400 tech-font">&lt; 15ms</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-4">
              <span>SLA guarantees available for enterprise delegates</span>
              <a href="#" className="text-cyan-400 hover:underline">Enterprise Relays &rarr;</a>
            </div>
          </div>
        </div>

      </main>

      {/* OVERLAY PROCESS VIEW & VISUAL TERMINAL (DRAWER PANEL) */}
      <AnimatePresence>
        {showProcessView && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            
            {/* Click outside to close (disabled while active/running logs) */}
            <div 
              onClick={() => {
                if (!runMutation.isPending) {
                  setShowProcessView(false)
                  setShowResultsDashboard(false)
                }
              }} 
              className="absolute inset-0 cursor-pointer" 
            />

            {/* Slide-over process panel drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#090909] border-l border-white/10 shadow-2xl h-screen flex flex-col justify-between overflow-hidden"
            >
              
              {/* Drawer Header */}
              <div className="bg-[#111] px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="text-cyan-400 animate-pulse" size={16} />
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider tech-font">
                      Process View | Querygate CLI Engine
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Executing query for: <strong className="text-cyan-400">{runMutation.variables?.name}</strong>
                    </p>
                  </div>
                </div>
                
                <button 
                  disabled={runMutation.isPending}
                  onClick={() => {
                    setShowProcessView(false)
                    setShowResultsDashboard(false)
                  }}
                  className={`text-gray-400 hover:text-white transition-colors duration-150 p-1.5 rounded-lg border border-transparent ${
                    runMutation.isPending ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                
                {/* Visual Terminal */}
                <div className="bg-[#050608] rounded-xl border border-white/10 p-5 flex-1 flex flex-col justify-between shadow-inner h-[280px]">
                  
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      <span className="text-[10px] text-gray-500 font-medium ml-2 tech-font">querygate-live-feed</span>
                    </div>
                    <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest tech-font flex items-center gap-1 font-semibold">
                      <Terminal size={11} />
                      Connection Active
                    </span>
                  </div>

                  {/* Step by step Terminal output */}
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 font-mono text-xs text-gray-300 leading-relaxed scrollbar-thin">
                    <AnimatePresence>
                      {terminalLogs.map((log, index) => {
                        let isSuccessLog = log.startsWith('Validating x402 payment header') || log.startsWith('RESPONSE') || log.startsWith('TX')
                        let textClass = isSuccessLog ? 'text-emerald-400 font-semibold' : 'text-gray-400'

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-cyan-500/50 shrink-0 font-mono select-none">&gt;</span>
                            <span className={`${textClass} break-all`}>{log}</span>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Loader or Done Status */}
                  <div className="border-t border-white/5 pt-3 mt-4 text-[11px] text-gray-500 flex justify-between items-center font-mono">
                    <div className="flex items-center gap-2">
                      {runMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin text-cyan-400" size={12} />
                          <span className="text-cyan-400/80 animate-pulse">Streaming logs...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="text-emerald-400" size={12} />
                          <span className="text-emerald-400 font-semibold">Telemetry Complete</span>
                        </>
                      )}
                    </div>
                    <span>USDC micro-settlement success</span>
                  </div>

                </div>

                {/* GLOWING SKELETON LOADER ANIMATION */}
                <AnimatePresence>
                  {runMutation.isPending && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-4 overflow-hidden"
                    >
                      <div className="text-xs text-gray-400 flex items-center gap-2 uppercase tracking-wider font-semibold">
                        <Loader2 className="animate-spin text-cyan-400" size={14} />
                        Executing Decentralized Query...
                      </div>
                      
                      <div className="relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col gap-3">
                        {/* Glow effect slide */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                        
                        <div className="h-4 bg-white/5 rounded-lg w-1/3" />
                        <div className="h-3 bg-white/5 rounded-lg w-3/4" />
                        <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* RESULTS DASHBOARD VIEW once terminal stream completes */}
                <AnimatePresence>
                  {showResultsDashboard && runMutation.data && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="flex flex-col gap-6"
                    >
                      
                      <div className="border-t border-white/10 pt-4 flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <Check className="border border-emerald-400 rounded-full p-0.5" size={14} />
                        Query execution success • Results generated
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Risk Analysis Card with Gauge */}
                        <div className="bg-[#121212] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider mb-3">Risk Assessment</span>
                            <div className="flex items-center gap-4">
                              
                              {/* Color-coded Gauge */}
                              <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle 
                                    cx="32" 
                                    cy="32" 
                                    r="28" 
                                    stroke="rgba(255,255,255,0.03)" 
                                    strokeWidth="6" 
                                    fill="transparent" 
                                  />
                                  <circle 
                                    cx="32" 
                                    cy="32" 
                                    r="28" 
                                    stroke={
                                      runMutation.data.riskScore < 20 
                                        ? '#10B981' 
                                        : runMutation.data.riskScore < 50 
                                        ? '#F59E0B' 
                                        : '#EF4444'
                                    } 
                                    strokeWidth="6" 
                                    fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 28}
                                    strokeDashoffset={2 * Math.PI * 28 * (1 - runMutation.data.riskScore / 100)}
                                    className="transition-all duration-1000 ease-out"
                                  />
                                </svg>
                                <span className="absolute text-xs font-bold tech-font text-white">{runMutation.data.riskScore}%</span>
                              </div>

                              <div>
                                <span className={`text-base font-bold tracking-wide uppercase ${runMutation.data.riskColor}`}>
                                  {runMutation.data.riskLevel}
                                </span>
                                <span className="text-[10px] text-gray-500 block mt-0.5">Calculated score out of 100</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-[10px] text-gray-500 border-t border-white/5 pt-3 leading-relaxed">
                            Based on consensus vectors, this query has been fully verified against exploit definitions.
                          </div>
                        </div>

                        {/* Cost & Routing summary Card */}
                        <div className="bg-[#121212] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider mb-2">Billing Metrics</span>
                            <div className="flex flex-col gap-1">
                              <span className="text-lg font-bold text-white tech-font">{runMutation.data.cost}</span>
                              <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">x402 Micropayment settled</span>
                            </div>
                          </div>

                          <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg flex items-center justify-between text-[11px] font-mono mt-4">
                            <span className="text-gray-500">Protocol Fee (2.5%):</span>
                            <span className="text-gray-300">{(runMutation.data.costNum * 0.025).toFixed(6)} USDC</span>
                          </div>
                        </div>

                      </div>

                      {/* Markdown-style AI Analysis Insights section */}
                      <div className="bg-[#121212] border border-white/5 rounded-xl p-5 text-left">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider mb-4">Deep LLM Agent Analysis</span>
                        
                        {/* Custom rendered insights style markdown */}
                        <div className="prose prose-invert max-w-none text-xs leading-relaxed text-gray-300 font-sans flex flex-col gap-4">
                          
                          {/* Markdown translation helper mock layout */}
                          <div className="border-b border-white/5 pb-2">
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              <Shield size={14} className="text-cyan-400" />
                              EXECUTIVE INSIGHTS
                            </h4>
                          </div>

                          <div className="space-y-4 font-sans text-gray-300">
                            {runMutation.data.insights.split('\n\n').map((paragraph, pIdx) => {
                              if (paragraph.startsWith('###')) {
                                return <h4 key={pIdx} className="text-sm font-bold text-white pt-2 border-b border-white/5 pb-1">{paragraph.replace('###', '').trim()}</h4>
                              }
                              if (paragraph.startsWith('####')) {
                                return <h5 key={pIdx} className="text-xs font-bold text-cyan-400 pt-1 uppercase tracking-wider">{paragraph.replace('####', '').trim()}</h5>
                              }
                              if (paragraph.startsWith('*')) {
                                return (
                                  <ul key={pIdx} className="list-disc list-inside space-y-2.5 pl-1">
                                    {paragraph.split('\n').map((bullet, bIdx) => {
                                      // Bold markup highlight translation
                                      const cleanBullet = bullet.replace('*', '').trim()
                                      const parts = cleanBullet.split('**')
                                      return (
                                        <li key={bIdx} className="text-xs text-gray-300">
                                          {parts.map((part, ptIdx) => ptIdx % 2 === 1 ? <strong key={ptIdx} className="text-white font-semibold">{part}</strong> : part)}
                                        </li>
                                      )
                                    })}
                                  </ul>
                                )
                              }
                              
                              // Paragraph bold markup mapping
                              const parts = paragraph.split('**')
                              return (
                                <p key={pIdx} className="text-xs text-gray-400 leading-relaxed">
                                  {parts.map((part, ptIdx) => ptIdx % 2 === 1 ? <strong key={ptIdx} className="text-white font-semibold">{part}</strong> : part)}
                                </p>
                              )
                            })}
                          </div>

                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Drawer Footer Actions */}
              <div className="bg-[#111] p-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>Settled via x402 Direct Relays</span>
                
                {/* Tech Utility Buttons */}
                <div className="flex gap-2">
                  <button
                    disabled={!showResultsDashboard}
                    onClick={() => {
                      if (!runMutation.data) return
                      const reportJson = JSON.stringify({
                        timestamp: new Date().toISOString(),
                        serviceId: runMutation.data.id,
                        serviceName: runMutation.data.name,
                        riskScore: runMutation.data.riskScore,
                        riskLevel: runMutation.data.riskLevel,
                        costSettled: runMutation.data.cost
                      }, null, 2)
                      navigator.clipboard.writeText(reportJson)
                      handleCopyEndpoint(reportJson, 'copy-json-utility')
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold font-sans transition-all cursor-pointer ${
                      showResultsDashboard 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white' 
                        : 'bg-white/[0.01] border-white/5 text-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {copiedTextId === 'copy-json-utility' ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <FileJson size={12} />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={!showResultsDashboard}
                    onClick={() => {
                      if (!runMutation.data) return
                      const reportJson = JSON.stringify({
                        timestamp: new Date().toISOString(),
                        serviceId: runMutation.data.id,
                        serviceName: runMutation.data.name,
                        riskScore: runMutation.data.riskScore,
                        riskLevel: runMutation.data.riskLevel,
                        costSettled: runMutation.data.cost,
                        recommendation: runMutation.data.riskLevel === 'Safe' ? 'EXCELLENT' : 'MONITOR'
                      }, null, 2)
                      const blob = new Blob([reportJson], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `querygate-report-${runMutation.data.id}.json`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold font-sans transition-all cursor-pointer ${
                      showResultsDashboard 
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-400 shadow-lg' 
                        : 'bg-white/[0.01] border-white/5 text-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <Download size={12} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

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

    </div>
  )
}
