import React from "react";

const VideoProject = ({ number, title, text, src }) => {
    return (
        <div className="relative h-auto w-full border-t-2 border-fadedsky-900 dark:border-fadedsky-50 mt-4">
            <div className="relative block font-display font-light text-6xl text-fadedsky-700 dark:text-fadedsky-400 mt-6 mb-10">
                {number}
            </div>
            <div className="relative flex justify-start flex-col-reverse lg:flex-row w-full h-auto">
                <span className="relative block h-auto flex-3 mr-10 mb-8 overflow-visible">
                    <video className="max-h-128 rounded-lg shadow-lg" src={src} preload="metadata" controls></video>
                </span>
                <span className="relative block h-auto flex-2">
                    <h2 className="relative block text-right font-display font-medium text-4xl text-fadedsky-700 dark:text-fadedsky-400 mt-4 mb-2">
                        {title}
                    </h2>
                    <p className="relative block font-body text-lg text-fadedsky-800 dark:text-fadedsky-200">{text}</p>
                </span>
            </div>
        </div>
    );
};

export default VideoProject;
