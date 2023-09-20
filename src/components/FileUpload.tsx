"use client";
import { uploadtoS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

type Props = {};

const FileUpload = (props: Props) => {
  const [uploading, setUploading] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please Upload a file less than 10mb");
        return;
      }
      try {
        setUploading(true);
        const data = await uploadtoS3(file);

        if (!data?.file_key || !data.file_name) {
          toast.error("something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: (data) => {
            toast.success(data.message);
          },
          onError: (err) => {
            toast.error("Error creating chat");
          },
        });
        console.log("data", data);
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl ">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col ",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin " />
            <p className="mt-2 text-sm text-slate-500 ">
              Spilling tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500 " />
            <p className=" mt-2 text-sm text-slate-400  ">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
