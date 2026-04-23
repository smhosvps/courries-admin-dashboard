import { Link } from "react-router-dom";
import {
  Video,
  Volume2,
  LayoutGrid,
  Clock,
  Tv,
  Image,
  Church,
  Lightbulb,
  Mic,
} from "lucide-react";

type Props = {};

export default function DashboardAdmin({}: Props) {
  const features = [
    {
      name: "Schedules",
      icon: Clock,
      path: "/dashboard/schedules",
      color: "bg-yellow-100 hover:bg-yellow-200",
    },
    {
      name: "Video Stream",
      icon: Video,
      path: "/dashboard/video-stream",
      color: "bg-blue-100 hover:bg-blue-200",
    },
    {
      name: "Audio Stream",
      icon: Volume2,
      path: "/dashboard/audio-stream",
      color: "bg-purple-100 hover:bg-purple-200",
    },
    {
      name: "Manage Slider",
      icon: LayoutGrid,
      path: "/dashboard/manage-slider",
      color: "bg-green-100 hover:bg-green-200",
    },
    {
      name: "Live TV",
      icon: Tv,
      path: "/dashboard/live-tv",
      color: "bg-red-100 hover:bg-red-200",
    },
    {
      name: "Flyer",
      icon: Image,
      path: "/dashboard/flyer",
      color: "bg-pink-100 hover:bg-pink-200",
    },
    {
      name: "Salvation TV",
      icon: Church,
      path: "/dashboard/salvation-tv",
      color: "bg-orange-100 hover:bg-orange-200",
    },
    {
      name: "Sermon",
      icon: Mic,
      path: "/dashboard/sermon",
      color: "bg-indigo-100 hover:bg-indigo-200",
    },
    {
      name: "Inspiration",
      icon: Lightbulb,
      path: "/dashboard/inspiration",
      color: "bg-teal-100 hover:bg-teal-200",
    },
  ];
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.path}
            className={`${feature.color} rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group`}
          >
            <div className="flex flex-col items-center text-center">
              <feature.icon className="h-12 w-12 text-gray-700 mb-4 group-hover:text-gray-900 stroke-[1.5]" />
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-700">
                Manage {feature.name.toLowerCase()} settings and configurations
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
