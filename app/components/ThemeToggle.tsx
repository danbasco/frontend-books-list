import { useState, useEffect } from "react";

const ThemeToggle: React.FC = () => {

    const [dark, setDark] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark";
        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 hover:cursor-pointer"
      aria-label="Alternar tema"
    >
      <div
        className={`absolute w-6 h-6 rounded-full transition-all duration-500 ${
          dark
            ? "bg-yellow-400 shadow-[inset_-8px_0_0_0_#071202]"
            : "bg-yellow-300"
        }`}
      ></div>

      {/* Raios do Sol */}
      <div
        className={`absolute w-10 h-10 transition-all duration-500 ${
          dark ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      >
        <div className="absolute inset-0 before:content-[''] before:absolute before:top-0 before:left-1/2 before:w-0.5 before:h-2 before:bg-yellow-400 before:transform before:-translate-x-1/2 before:-translate-y-full"></div>
        <div className="absolute inset-0 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0.5 before:h-2 before:bg-yellow-400 before:transform before:-translate-x-1/2 before:translate-y-full"></div>
        <div className="absolute inset-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-2 before:bg-yellow-400 before:transform before:-translate-y-1/2 before:-translate-x-full"></div>
        <div className="absolute inset-0 before:content-[''] before:absolute before:right-0 before:top-1/2 before:h-0.5 before:w-2 before:bg-yellow-400 before:transform before:-translate-y-1/2 before:translate-x-full"></div>
      </div>
    </button>
  );

}


export default ThemeToggle;
