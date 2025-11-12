import { Button } from "@/components/ui/button"
import styles from "./button-rotate.module.css"

export const ButtonRotate = () => {
  const text = "I LOVE YOUR DESIGN"

  return (
    <div className="border-primary rounded-full border border-dotted p-1">
      <Button className={`bg-primary relative grid h-[100px] w-[100px] place-content-center overflow-hidden rounded-full p-0 ${styles.buttonRotate}`}>
        <p
          className={`absolute inset-0 ${styles.textRotate}`}
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {Array.from(text).map((char, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                inset: "6px",
                transform: `rotate(${19 * i}deg)`,
                transformOrigin: "50% 50%",
                userSelect: "none",
                display: "inline-block",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>

        <div className="text-primary bg-background relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <svg
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute h-4 w-4 transition-transform duration-300 ease-in-out"
            style={{ transform: "translate(0, 0)" }}
          >
            <path
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
              fill="currentColor"
            />
          </svg>
          <svg
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute h-4 w-4 transition-transform duration-300 ease-in-out"
            style={{ transform: "translate(-150%, 150%)" }}
          >
            <path
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Button>
    </div>
  )
}