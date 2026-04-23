import { Loader } from "lucide-react";

const Loaderx = () => {

    return (
        <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-[#0662f1]" size={48} />
        </div>
      </div>
    )
}

export default Loaderx