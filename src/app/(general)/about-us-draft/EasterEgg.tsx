"use client";

const EasterEgg = ({ children }: { children: React.ReactNode }) => {
  const handleMouseEnter = () => {
    const emojis = document.querySelectorAll(".emoji");
    emojis.forEach((emoji, index) => {
      // Remove existing animation classes to ensure replay
      emoji.classList.remove("bounce-up", "bounce-up-higher");
      // Force reflow to reset the animation
      void (emoji as HTMLElement).offsetWidth;

      setTimeout(() => {
        emoji.classList.remove("hidden");
        emoji.classList.add(index === 1 ? "bounce-up-higher" : "bounce-up");
      }, index * 100);
    });
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onClick={handleMouseEnter}
      className="relative inline-block underline underline-offset-4 decoration-dotted cursor-pointer"
    >
      {children}
      <span className="emoji hidden absolute left-[-10px] -top-5">🇸🇪</span>
      <span className="emoji hidden absolute left-[20px] -top-7">💃</span>
      <span className="emoji hidden absolute left-[50px] -top-5">🇸🇪</span>
    </span>
  );
};

export default EasterEgg;
