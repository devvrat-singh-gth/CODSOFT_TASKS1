"use client";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";

export default function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[90] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button aria-label="Close sidebar" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} /><motion.div className="absolute inset-y-0 left-0 w-[min(86vw,320px)] shadow-2xl" initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ duration: 0.22 }}><Sidebar mobile onClose={onClose} /></motion.div></motion.div>}</AnimatePresence>;
}
