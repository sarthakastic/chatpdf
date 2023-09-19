import { Button } from "@/components/ui/button";
import Link from "../../node_modules/next/link";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-slate-500 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <div className="flex flex-col items-center text-center ">
          <div className="flex items-center ">
            <h1 className="mr-3 text-5xl font-semibold ">
              Chat with any PDF <UserButton afterSignOutUrl="/" />{" "}
            </h1>
          </div>
          <div className="flex mt-2">
            {isAuth && <Button>Go to Chat</Button>}
          </div>
          <p className="max-w-xl mt-2 text-lg text-slate-200 ">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research papers
          </p>

          <div className="w-full mt-4 ">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get started <LogIn className=" w-4 h-4 ml-2 " />{" "}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
