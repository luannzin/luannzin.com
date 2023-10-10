type LogoProps = {
  theme?: "dark" | "light";
};

const Logo = ({ theme }: LogoProps) => {
  switch (theme) {
    case "dark":
      return (
        <svg
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 5V69.9275"
            stroke="#FAFAFA"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M53.6956 26.3044L21.2319 69.8897"
            stroke="#FAFAFA"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M21.2319 26.3044L53.6957 26.3044"
            stroke="#FAFAFA"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M21.2319 69.9276H53.6957"
            stroke="#FAFAFA"
            stroke-width="10"
            stroke-linecap="round"
          />
          <circle cx="69.9275" cy="69.9275" r="5.07246" fill="#FAFAFA" />
        </svg>
      );

    case "light":
      return (
        <svg
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 5V69.9275"
            stroke="black"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M53.6956 26.3043L21.2319 69.8896"
            stroke="black"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M21.2319 26.3043L53.6957 26.3043"
            stroke="black"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M21.2319 69.9275H53.6957"
            stroke="black"
            stroke-width="10"
            stroke-linecap="round"
          />
          <circle cx="69.9275" cy="69.9276" r="5.07246" fill="black" />
        </svg>
      );
  }
};

export default Logo;
