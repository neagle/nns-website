import classnames from "classnames";

interface Props {
  disableInteractions?: boolean;
  fontSize?: number;
  breakWords?: boolean;
}

const Logo = ({
  fontSize,
  disableInteractions = false,
  breakWords = false,
}: Props) => {
  const styleBlock = {
    fontSize: fontSize ? `${fontSize}px` : undefined,
  };

  return (
    <h1
      aria-label="NOVA Nightsky Theater"
      className={classnames(
        [
          "text-3xl",
          "text-primary",
          "uppercase",
          "font-bold",
          "m-0",
          "mt-[-0.10em]",
          "p-0",
          "leading-none",
          "inline-block",
          "filter drop-shadow-[0_0_5px_rgba(0,0,0,0.7)]!",
        ],
        {
          "hover:[&_svg]:transform hover:[&_svg]:scale-x-120 hover:[&_svg]:scale-y-120 hover:[&_svg]:rotate-180 hover:[&_svg>path]:fill-[hsl(37,100%,90%)]":
            !disableInteractions,
        }
      )}
      style={styleBlock}
    >
      <span>N</span>
      <b
        aria-hidden="true"
        className={classnames([
          "p-0",
          "m-[0_-0.075em_0_-0.025em]",
          "relative inline-block",
          "top-[0.1em]",
        ])}
      >
        <svg
          viewBox="0 0 400 400"
          className={classnames(
            ["top-0", "w-[0.9em] h-[0.9em]", "left-0", "m-0", "duration-1000"],
            {
              "transition-all": !disableInteractions,
              "transition-none": disableInteractions,
            }
          )}
        >
          <path
            d="M200,0,233.99186938124421,95.38378320753311,317.55705045849464,38.19660112501052,288.9918693812442,135.34362224782797,390.21130325903073,138.19660112501052,310,200,390.21130325903073,261.80339887498945,288.9918693812442,264.65637775217203,317.55705045849464,361.8033988749895,233.99186938124421,304.6162167924669,200,400,166.00813061875579,304.6162167924669,82.4429495415054,361.8033988749895,111.00813061875579,264.65637775217203,9.7886967409693,261.8033988749895,90,200,9.7886967409693,138.19660112501046,111.00813061875577,135.34362224782797,82.44294954150536,38.196601125010545,166.00813061875579,95.38378320753311Z"
            fill="hsl(37, 97.6%, 67.8%)"
            className={classnames(["duration-1000"], {
              "transition-all": !disableInteractions,
            })}
          />
        </svg>
      </b>
      <span>
        VA{breakWords ? <br /> : " "}Nightsky{breakWords ? <br /> : " "}Theater
      </span>
    </h1>
  );
};

export default Logo;
