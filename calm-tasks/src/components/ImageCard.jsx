import React from "react";
import demo from "../assets/card-sample.png";

export default function ImageCard({ title = "Notes board", description = "Preview of layout" }) {
  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-2xl shadow-lg dark:bg-black/60">
      <div className="overflow-hidden rounded-xl">
        <img src={demo} alt={title} className="w-full h-56 object-cover" />
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
      </div>
    </div>
  );
}
