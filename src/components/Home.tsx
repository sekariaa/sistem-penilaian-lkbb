import React from "react";
import Link from "next/link";
import ButtonComponent from "./button/ButtonComponent";

interface HomeProps {
  user: any;
}

const Home: React.FC<HomeProps> = () => {
  return (
    <main className="min-h-screen px-6 py-6 flex items-start justify-center lg:justify-start bg-cover bg-center bg-no-repeat sm:bg-none md:bg-none lg:bg-[url('/paskib.png')] lg:bg-right-bottom lg:bg-65%">
      <section>
        <section className="flex flex-col items-center justify-center font-bold space-y-1 text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-black-primary">
          <div>
            <p>Rekap Nilai</p>
          </div>
          <div className="flex items-center gap-1">
            <hr className="w-20 md:w-32 h-1 border-0 rounded bg-black-primary" />
            <p>Lomba Paskibraka </p>
          </div>
          <div>
            <p>Solusi Cerdas dan Praktis</p>
          </div>
        </section>
        <section className="flex justify-center items-center py-5 gap-3">
          <Link
            href="https://drive.google.com/drive/u/0/folders/1xQ69tmZDno-Xrz1812ubAVpB3C5CWcHl"
            target="_blank"
          >
            <ButtonComponent intent="secondary-small">Template</ButtonComponent>
          </Link>
          <Link
            href="https://drive.google.com/drive/u/0/folders/1kwwzwzxGP2fgcz3VxiQzGKiFpAFJOvR_"
            target="_blank"
          >
            <ButtonComponent intent="primary-small">Tutorial</ButtonComponent>
          </Link>
        </section>
      </section>
    </main>
  );
};

export default Home;
