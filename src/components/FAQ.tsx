"use client";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
    {
        question: "How is hemiBTC backed?",
        answer: "hemiBTC is 1:1 backed by Bitcoin reserves held in secure custody wallets. The Proof of Reserve dashboard allows real-time verification of these holdings."
    },
    {
        question: "Are the reserves audited?",
        answer: "Yes, the reserves are auditable on-chain at any time using this dashboard. We also perform periodic third-party audits to ensure security and compliance."
    },
    {
        question: "Can I redeem hemiBTC for BTC?",
        answer: "Yes, hemiBTC is redeemable 1:1 for Bitcoin through our bridge interface, subject to standard processing times and network fees."
    },
    {
        question: "What is the Hemi Network?",
        answer: "Hemi is a modular Layer-2 network powered by Bitcoin and Ethereum, providing superior scalability, security, and interoperability."
    }
];

export function FAQ() {
    return (
        <div className="w-full max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {FAQS.map((faq, i) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-secondary rounded-lg bg-secondary/10 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/20 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-medium">{question}</span>
                {isOpen ? <Minus className="w-4 h-4 text-muted-foreground" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
            </button>
            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out text-sm text-muted-foreground pl-4 pr-12",
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    {answer}
                </div>
            </div>
        </div>
    );
}
