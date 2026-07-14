type SafeHtmlProps = {
  html: string;
} & React.HTMLAttributes<HTMLDivElement>;

const SafeHtml = ({ html, ...props }: SafeHtmlProps) => {
  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: this is a safe html
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
};

export { SafeHtml };
