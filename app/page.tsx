import Header from "./(components)/Header";
import Projects from "./(components)/Projects";

export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-4 max-w-[32rem]">
      <Header />
      <Projects />
    </div>
  );
}
