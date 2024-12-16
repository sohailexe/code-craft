import Header from "./_components/Header";
import { motion } from "framer-motion";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
          <div>{/* <motion.div className="progress-bar h-[1500px]" /> */}</div>
        </div>
      </div>
    </div>
  );
}
