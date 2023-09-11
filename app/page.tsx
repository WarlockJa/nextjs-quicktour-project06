import Posts from "./components/Posts";
import MyProfilePic from "./components/MyProfilePic";

// revalidation interval config
export const revalidate = 86400; // seconds. normally would be a very high number 86400(day)

export default function Home() {
  return (
    <div className="mx-auto">
      <MyProfilePic />
      <p className="my-12 text-3xl text-center dark:text-white">
        Hello and Welcome ✋&nbsp;
        <span className="whitespace-nowrap">
          I'm <span className="font-bold">Dave</span>
        </span>
      </p>
      <Posts />
    </div>
  );
}
