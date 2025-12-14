import logo from "../assets/react.svg";

export const LoadingData = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="w-24 h-24 mb-4 relative">
        <img
          src={logo}
          alt="Logo"
          className="w-full h-full object-contain animate-pulse"
        />
      </div>
      <div className="flex space-x-1 text-md text-gray-700 font-medium">
        <span className="animate-bounce [animation-delay:0ms]">L</span>
        <span className="animate-bounce [animation-delay:100ms]">o</span>
        <span className="animate-bounce [animation-delay:200ms]">a</span>
        <span className="animate-bounce [animation-delay:300ms]">d</span>
        <span className="animate-bounce [animation-delay:400ms]">i</span>
        <span className="animate-bounce [animation-delay:500ms]">n</span>
        <span className="animate-bounce [animation-delay:600ms]">g</span>
        <span className="animate-bounce [animation-delay:700ms]">.</span>
        <span className="animate-bounce [animation-delay:800ms]">.</span>
        <span className="animate-bounce [animation-delay:900ms]">.</span>
        <span className="animate-bounce [animation-delay:1000ms]">.</span>
        <span className="animate-bounce [animation-delay:1100ms]">.</span>
      </div>
    </div>
  );
};
