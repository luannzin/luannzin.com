type LogoProps = {
  theme?: "dark" | "light";
};

const Logo = ({ theme }: LogoProps) => {
  switch (theme) {
    case "dark":
      return (
        <svg
          width="76"
          height="119"
          viewBox="0 0 76 119"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 91.6667L70 27.6667"
            stroke="#FAFAFA"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M6 91.6667H48.6667"
            stroke="#FAFAFA"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M6 6.33334V91.6667"
            stroke="#FAFAFA"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M70 27.6667H27.3333"
            stroke="#FAFAFA"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M70 113V27.6667"
            stroke="#FAFAFA"
            stroke-width="12"
            stroke-linecap="round"
          />
        </svg>
      );

    case "light":
      return (
        <svg
          width="76"
          height="119"
          viewBox="0 0 76 119"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 91.6667L70 27.6667"
            stroke="#000000"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M6 91.6667H48.6667"
            stroke="#000000"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M6 6.33334V91.6667"
            stroke="#000000"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M70 27.6667H27.3333"
            stroke="#000000"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            d="M70 113V27.6667"
            stroke="#000000"
            stroke-width="12"
            stroke-linecap="round"
          />
        </svg>
      );
  }
};

export default Logo;
