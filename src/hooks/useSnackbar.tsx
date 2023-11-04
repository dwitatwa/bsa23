import { useState } from "react";
type snackType = "success" | "failed" | "warning" | "loading" | null;

export default function useSnackbar() {
  const [showComp, setShowComp] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [type, setType] = useState<snackType>(null);

  function showSnack(status: boolean, theText: string | null, theType: snackType) {
    setShowComp(status);
    setText(theText);
    setType(theType);
  }

  function SnackBar() {
    if (!showComp) return null;

    return (
      <div className="fixed top-0 left-0 z-50 w-full flex justify-center">
        <div
          className={`flex justify-center items-center mt-10 ${
            type === "loading"
              ? "bg-sky-700 text-sky-100"
              : type === "failed"
              ? "bg-red-700 text-red-100"
              : type === "success"
              ? "bg-green-700 text-sky-100"
              : type === "warning"
              ? "bg-yellow-700 text-yellow-100"
              : null
          }  w-fit px-5 py-2 rounded-md gap-2`}
        >
          {type === "loading" ? (
            <div className="border-2 border-white w-4 h-4 rounded-full border-t-2 border-t-gray-400 animate-spin" />
          ) : type === "success" ? (
            <svg fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
              <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-3.97-3.03a.75.75 0 00-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-.01-1.05z" />
            </svg>
          ) : type === "failed" ? (
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
              <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z" />
            </svg>
          ) : null}
          {text}
        </div>
      </div>
    );
  }

  return { showSnack, SnackBar };
}
