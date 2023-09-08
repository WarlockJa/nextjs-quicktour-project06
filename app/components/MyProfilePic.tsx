import Image from "next/image";

export default function MyProfilePic() {
  return (
    <section className="w-full mx-auto">
      <Image
        className="border-black border-4 dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8"
        src={"/images/00ai-sparks-superJumbo-v2.jpg"}
        width={200}
        height={200}
        alt="AI question"
        priority={true}
      />
    </section>
  );
}
